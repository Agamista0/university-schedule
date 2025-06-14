import { NextResponse } from 'next/server';
import connectDB from '../lib/db';
import Section from '../lib/models/Section';
import Distributed_lectures from '../lib/models/Distributed_lectures';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';

export async function POST(request) {
    try {
        await connectDB();
        
        // Check if there are any distributed lectures
        const distributedLectures = await Distributed_lectures.find({});
        if (!distributedLectures || distributedLectures.length === 0) {
            return NextResponse.json({
                message: 'No distributed lectures found. Please distribute lectures first.',
                error: 'No distributed lectures available'
            }, { status: 400 });
        }

        const filePath = path.join(process.cwd(), 'src/app/public/formats/test.json');
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const sections = JSON.parse(fileContent);

        // Clear existing data and insert new sections
        await Section.deleteMany({});
        const insertedSections = await Section.insertMany(sections);

        return NextResponse.json({
            message: 'Sections distributed successfully',
            count: insertedSections.length
        }, { status: 200 });

    } catch (error) {
        console.error('Error distributing sections:', error);
        return NextResponse.json({
            message: 'Error distributing sections',
            error: error.message
        }, { status: 500 });
    }
}

export async function GET() {
    try {
        await connectDB();
         // Parse query parameters
         const { searchParams } = new URL(request.url);
         const section = searchParams.get('section');
         const center = searchParams.get('center');
         const department = searchParams.get('department');
 
         // Build filter object
         const filter = {};
         if (section) filter.section = { $regex: section, $options: 'i' };
         if (center) filter.center = center;
         if (department) filter.department = department;
 
        const cursor = Section.find(filter).lean().cursor(); // Use cursor for streaming
        const encoder = new TextEncoder();

        const stream = new ReadableStream({
            async start(controller) {
                controller.enqueue(encoder.encode('['));
                let first = true;

                for await (const doc of cursor) {
                    const json = JSON.stringify(doc);
                    if (!first) controller.enqueue(encoder.encode(','));
                    controller.enqueue(encoder.encode(json));
                    first = false;
                }

                controller.enqueue(encoder.encode(']'));
                controller.close();
            }
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

    } catch (error) {
        console.error('Error fetching sections:', error);
        return NextResponse.json({
            message: 'Error fetching sections',
            error: error.message
        }, { status: 500 });
    }
}

export async function DELETE() {
    try {
        await connectDB();
        
        const result = await Section.deleteMany({});
        
        return NextResponse.json({
            message: 'All sections deleted successfully',
            deletedCount: result.deletedCount
        }, { status: 200 });

    } catch (error) {
        console.error('Error deleting sections:', error);
        return NextResponse.json({
            message: 'Error deleting sections',
            error: error.message
        }, { status: 500 });
    }
}
