import { NextResponse } from 'next/server';
import { read, utils } from 'xlsx';
import connectDB from '@/app/api/lib/db';
import Schedule from '@/app/api/lib/models/Schedule';
import { verifyAuth } from '@/app/api/lib/auth';

const parseLectureDetails = (cellContent) => {
  if (!cellContent || typeof cellContent !== 'string') {
      return { lecture: null, professor: null, groups: {} };
  }

  const cleanedContent = cellContent.replace(/\s+/g, ' ').trim();
  const parts = cleanedContent.split('Dr.');
  const lecture = parts[0]?.trim() || null;
  
  let professor = null;
  let groups = {};

  if (parts.length > 1) {
      const professorPart = parts[1].trim();
      
      // Extract professor name (everything before the first "Group")
      const professorMatch = professorPart.match(/^(.*?)(?=Group|$)/);
      professor = professorMatch ? `Dr.${professorMatch[1].trim()}` : null;

      // Extract modes (VCR/FTF) within parentheses
      const modesMatch = [...professorPart.matchAll(/\((.*?)\)/g)];
      const modes = modesMatch.map(match => match[1].trim());

      // Extract group letters (A, B, C, D)
      const groupsMatch = [...professorPart.matchAll(/Group\s+(\w+)/g)];
      const groupLetters = groupsMatch.map(match => match[1].trim());

      // Pair groups with modes in object format
      if (groupLetters.length > 0 && modes.length > 0) {
          const minLength = Math.min(groupLetters.length, modes.length);
          for (let i = 0; i < minLength; i++) {
              groups[groupLetters[i]] = modes[i];
          }
      }
  }

  return { lecture, professor, groups };
};


export async function POST(request, { params }) {
    try {
        await connectDB();
        const schedule = params.schedule.toUpperCase();
        console.log(schedule);

        // Get the form data
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
        }

        // Convert file to buffer
        const buffer = await file.arrayBuffer();
        const workbook = read(new Uint8Array(buffer), { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
        const scheduleEntries = [];
        const days = [];

        // Fill down days for merged cells
        for (let i = 0; i < sheet.length; i++) {
            if (sheet[i][0]) {
                days[i] = sheet[i][0];
            } else {
                days[i] = days[i - 1];
            }
        }

        // Process sheet data
        for (let rowIdx = 0; rowIdx < sheet.length; rowIdx++) {
            const day = days[rowIdx];
            if (!day) continue;

            for (let colIdx = 1; colIdx < sheet[rowIdx].length; colIdx++) {
                const time = sheet[0][colIdx]; // First row contains time slots
                if (!time) continue;

                const cellContent = sheet[rowIdx][colIdx];
                const { lecture, professor, groups } = parseLectureDetails(cellContent);

                if (lecture && professor) {
                    scheduleEntries.push({
                        department: schedule ,
                        day,
                        time,
                        lecture,
                        professor,
                        groups
                    });
                }
            }
        }

        // Clear existing schedules for this type
        await Schedule.deleteMany({ department: schedule });

        // Insert new schedules
        const result = await Schedule.insertMany(scheduleEntries);

        return NextResponse.json({
            message: 'Schedule uploaded successfully',
            count: result.length,
            data: result
        }, { status: 201 });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({
            message: 'Error uploading schedule',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        }, { status: 500 });
    }
}

// Add configuration for the API route
export const config = {
    api: {
        // Increase payload size limit if needed
        bodyParser: false,
        sizeLimit: '10mb',
    },
};
