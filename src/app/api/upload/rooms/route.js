import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import connectDB from '@/app/api/lib/db';
import Room from '@/app/api/lib/models/Room';

function determineRoomType(name) {
    // Check if the room name contains "LAB" or matches lab pattern
    if (name.includes('LAB') || /R\d+\(LAB\)/.test(name)) {
        return 'LAB';
    }
    // For lecture halls (مدرج) and other rooms
    return 'LECTURE_HALL';
}

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

        const roomEntries = [];
        let currentCenter = '';

        // Skip header row and process data
        for (let i = 1; i < sheet.length; i++) {
            const row = sheet[i];
            if (!row || row.length === 0) continue; // Skip empty rows

            // Update current center if cell in first column is not empty
            if (row[0]) {
                currentCenter = row[0];
            }

            // Skip rows without room name or capacity
            if (!row[1] || !row[2]) continue;

            const roomName = row[1].trim();
            const capacity = parseInt(row[2]);
            const possibilities = row[3] ? row[3].trim() : null;

            roomEntries.push({
                center: currentCenter,
                name: roomName,
                type: determineRoomType(roomName),
                capacity: capacity,
                possibilities: possibilities
            });
        }

        // Clear existing rooms
        await Room.deleteMany({});

        // Insert new rooms
        const result = await Room.insertMany(roomEntries);

        return NextResponse.json({
            message: 'Rooms uploaded successfully',
            count: result.length,
            data: result
        }, { status: 201 });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({
            message: 'Error uploading rooms',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}
