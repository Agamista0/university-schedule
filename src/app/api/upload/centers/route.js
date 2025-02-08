import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import connectDB from '@/app/api/lib/db';
import Center from '@/app/api/lib/models/Center';

export async function POST(request) {
    try {
        await connectDB();

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

        // Skip header row and process data
        const centerEntries = [];
        for (let i = 1; i < sheet.length; i++) {
            const row = sheet[i];
            if (!row[0]) continue; 

            centerEntries.push({
                centerName: row[1],
                groups: row[2]
            });
        }

        // Clear existing centers
        await Center.deleteMany({});

        // Insert new centers
        const result = await Center.insertMany(centerEntries);

        return NextResponse.json({
            message: 'Centers uploaded successfully',
            count: result.length,
            data: result
        }, { status: 201 });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({
            message: 'Error uploading centers',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}
