import { NextResponse } from 'next/server';
import clientPromise from '@/app/util/clientPromise';

export async function GET() {
  try {
    const client = await clientPromise;
    await client.db().command({ ping: 1 });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Successfully connected to MongoDB' 
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to connect to MongoDB' 
    }, { status: 500 });
  }
}