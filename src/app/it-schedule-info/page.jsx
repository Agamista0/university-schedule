'use client';
import { useState } from 'react';

export default function ITStudentInfo() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">IT Student Registration Format Guide</h1>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">File Structure</h2>
            <p className="text-gray-600 mb-4">
              The IT student registration file should be an Excel file (.xlsx) with the following structure:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-3">Required Columns:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Basic Information:</h4>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Course ID</li>
                    <li>Course Level</li>
                    <li>Course Name</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Per Center Information:</h4>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>Number of sections</li>
                    <li>Section Capacity</li>
                    <li>Total Capacity (auto-calculated)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Centers Included</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                'Assuit', 'Ain Shams', 'Alexandria', 'Menoufia',
                'Suhag', 'Qena', 'Hurghada', 'Beni Sweif',
                'Aswan', 'Elsadat', 'El Ismaielia', 'El Fayoum',
                'Tanta'
              ].map(center => (
                <div key={center} className="bg-blue-50 p-3 rounded-lg text-blue-700">
                  {center}
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Important Rules</h2>
            <div className="bg-yellow-50 p-6 rounded-lg">
              <ul className="list-disc list-inside space-y-3 text-gray-700">
                <li>All section numbers must be positive integers</li>
                <li>Section capacity must be between 20 and 40 students</li>
                <li>Course levels must be between 1 and 4</li>
                <li>Total capacity is automatically calculated (sections × capacity)</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="/public/formats/register-student-it-format.xlsx"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              download
            >
              Download Template
              <svg className="ml-2 -mr-1 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
              </svg>
            </a>

            <button 
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
            >
              Back to Upload
              <svg className="ml-2 -mr-1 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
              </svg>
            </button>
          </div>

          <div className="mt-8 prose max-w-none">
            <h2 className="text-xl font-semibold mb-4">Sample Data Format</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Level</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sections</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Capacity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">IT111</td>
                    <td className="px-6 py-4 whitespace-nowrap">1</td>
                    <td className="px-6 py-4 whitespace-nowrap">Electronics</td>
                    <td className="px-6 py-4 whitespace-nowrap">8</td>
                    <td className="px-6 py-4 whitespace-nowrap">30</td>
                    <td className="px-6 py-4 whitespace-nowrap">240</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}