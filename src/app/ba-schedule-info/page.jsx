'use client';
import { useState } from 'react';

export default function BAScheduleInfo() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">BA Schedule Format Guide</h1>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">File Structure</h2>
            <p className="text-gray-600 mb-4">
              The BA registration schedule file should be an Excel file (.xlsx) with the following structure:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Time slots are arranged in columns (8:00-9:00, 9:00-10:00, etc.)</li>
                <li>Days of the week are arranged in rows (Saturday, Sunday, Monday, etc.)</li>
                <li>Each cell should contain:
                  <ul className="list-disc list-inside ml-6 mt-2">
                    <li>Course Name</li>
                    <li>Instructor Name</li>
                    <li>Group Information (e.g., Group A, Group B)</li>
                    <li>Location Type (VCR/FTF)</li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Download Template</h2>
            <a 
              href="/formats/register-ba-format.xlsx"
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              download
            >
              Download Excel Template
              <svg className="ml-2 -mr-1 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
              </svg>
            </a>
          </div>

          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold mb-4">Important Notes</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Time slots must be in the format HH:00 : HH:00</li>
              <li>Each cell should clearly indicate whether the class is VCR (Virtual) or FTF (Face-to-Face)</li>
              <li>Group assignments must be clearly specified (Group A, Group B, etc.)</li>
              <li>Instructor names should be prefixed with their title (Dr., Prof., etc.)</li>
              <li>Do not modify the template structure or time slot headers</li>
              <li>Ensure there are no scheduling conflicts for groups or instructors</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}