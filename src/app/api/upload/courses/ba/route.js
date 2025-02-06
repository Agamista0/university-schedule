import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import connectDB from '@/app/api/lib/db';
import Course from '@/app/api/lib/models/Course';


export async function POST(request) {
    try {
        await connectDB();

        const department = "BA";
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json({ 
                message: 'No file uploaded',
                error: 'File is required' 
            }, { status: 400 });
        }

        // Convert file to buffer
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { 
            header: 1,
            raw: false
        });

        // Get center names from header row (skip first 3 columns)
        const centerNames = sheet[0].slice(3).filter(Boolean);

        const courseEntries = [];
        
        // Process each row (skip header)
        for (let i = 1; i < sheet.length; i++) {
            const row = sheet[i];
            if (!row[0]) continue; // Skip empty rows

            const courseLevel = parseInt(row[0]);
            const courseName = row[1];
            const courseId = row[2];
            
            // Skip if essential data is missing
            if (!courseLevel || !courseName || !courseId) continue;

          
            const centers = [];
            let colIndex = 3; // Start after courseId column

            // Process each center's data
            for (let j = 0; j < centerNames.length; j++) {
                const numberOfStudents = parseInt(row[colIndex] || 0);
                const numberOfGroups = parseInt(row[colIndex + 1] || 0);
                
                if (numberOfStudents > 0) {
                    centers.push({
                        centerName: centerNames[j],
                        numberOfStudents,
                        numberOfGroups
                    });
                }
                
                colIndex += 2; // Move to next center (2 columns per center)
            }

            courseEntries.push({
                courseLevel,
                courseName,
                courseId,
                department,
                centers
            });
        }

        // Clear existing courses for this department
        await Course.deleteMany({ department });

        // Insert new courses
        const result = await Course.insertMany(courseEntries);

        return NextResponse.json({
            message: `Courses for department ${department} uploaded successfully`,
            count: result.length,
            data: result
        }, { status: 201 });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({
            message: 'Error uploading courses',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}
