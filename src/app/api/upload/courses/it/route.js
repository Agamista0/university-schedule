import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import connectDB from '@/app/api/lib/db';
import Course from '@/app/api/lib/models/Course';

export async function POST(request) {
    try {
        await connectDB();
        const department = "IT";
        
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

        // Get center information from headers
        const headerRow = sheet[0]; // Adjusted to the correct header row
        const centers = [];
        
        // Find center columns (starting from index 4)
        for (let i = 4; i < headerRow.length; i++) {
            const cellValue = headerRow[i];
            if (cellValue) {
                centers.push({
                    name: cellValue.trim(),
                    sectionsCol: i, // Adjusted for the "no. of sections" column
                    capacityCol: ++i  // Adjusted for the "Section Capacity" column
                });
                
            }
        }

        const courseEntries = [];

        // Process each row (skip header)
        for (let i = 2; i < sheet.length; i++) { // Start from row 3
            const row = sheet[i];
            if (!row[0]) continue; // Skip empty rows

            const courseId = row[1]?.toString();
            const courseLevel = parseInt(row[2]?.toString());
            const courseName = row[3]?.toString();

            // Skip if essential data is missing
            if (!courseId || !courseLevel || !courseName) continue;

            const centerData = [];

            // Process each center's data
            centers.forEach(center => {
                const numberOfSections = parseInt(row[center.sectionsCol]?.toString()) || 0;
                const sectionCapacity = parseInt(row[center.capacityCol]?.toString()) || 0;
                const totalStudents = numberOfSections * sectionCapacity;

                if (numberOfSections > 0 && sectionCapacity > 0) {
                    centerData.push({
                        centerName: center.name,
                        numberOfStudents: totalStudents,
                        numberOfGroups: numberOfSections
                    });
                }
            });

            // Only add courses with valid center data
            if (centerData.length > 0) {
                courseEntries.push({
                    courseId,
                    courseLevel,
                    courseName,
                    department,
                    centers: centerData
                });
            }
        }

        // Clear existing courses for IT department
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
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        }, { status: 500 });
    }
}
