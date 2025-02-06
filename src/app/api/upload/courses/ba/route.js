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

        // Get header row and find center columns
        const headerRow = sheet[0];
        const centerColumns = [];
        
        // Find all center columns and their data positions
        for (let i = 3; i < headerRow.length; i++) {
            const cellValue = headerRow[i];
            if (cellValue) {
                const centerName = cellValue.trim();
                // Skip if the column name contains "Total"
                if (!centerName.toLowerCase().includes('total')) {
                    // When we find a center name, record its position and the next column (groups)
                    centerColumns.push({
                        name: centerName,
                        studentCol: i,
                        groupCol: i + 1
                    });
                }
                // Skip the next column as it's for groups
                i++;
            }
        }

        const courseEntries = [];
        
        // Process each row (skip header)
        for (let i = 1; i < sheet.length; i++) {
            const row = sheet[i];
            if (!row[0]) continue; // Skip empty rows

            const courseLevel = parseInt(row[0]);
            const courseName = row[1];
            const courseId = row[2];
            
            // Skip if essential data is missing or if it's a total row
            if (!courseLevel || !courseName || !courseId || 
                courseName.toLowerCase().includes('total')) continue;

            const centers = [];

            // Process each center using the mapped columns
            for (const center of centerColumns) {
                const numberOfStudents = row[center.studentCol];
                const numberOfGroups = row[center.groupCol];
                
                // Convert to numbers, defaulting to 0 if conversion fails
                const students = parseInt(numberOfStudents) || 0;
                const groups = parseInt(numberOfGroups) || 0;
                
                // Only add centers with valid data
                if (students > 0 || groups > 0) {
                    centers.push({
                        centerName: center.name,
                        numberOfStudents: students,
                        numberOfGroups: groups
                    });
                }
            }

            // Only add courses that have at least one valid center
            if (centers.length > 0) {
                courseEntries.push({
                    courseLevel,
                    courseName,
                    courseId,
                    department,
                    centers
                });
            }
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
