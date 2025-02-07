'use client';
import { useState } from 'react';

export default function CenterGroupInfo() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Center and Group Format Guide</h1>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">File Structure</h2>
            <p className="text-gray-600 mb-4">
              The Center and Group file should be an Excel file (.xlsx) with the following columns:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li># (Sequential number)</li>
                <li>Center Name</li>
                <li>Group (Comma-separated group names, e.g., "A,B" or "C,D")</li>
              </ul>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Example Data</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Center Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Group</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[
                    { id: 1, center: 'Ain Shams', groups: 'A,B' },
                    { id: 2, center: 'Alexandria', groups: 'C,D' },
                    { id: 3, center: 'Aswan', groups: 'A,B' },
                  ].map((row) => (
                    <tr key={row.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.center}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.groups}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Download Template</h2>
            <a 
              href="/formats/center-group-format.xlsx"
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
              <li>The sequential number (#) must be unique and start from 1</li>
              <li>Center names must match exactly with the names used in other files</li>
              <li>Groups should be comma-separated without spaces (e.g., "A,B" not "A, B")</li>
              <li>Each center can have multiple groups</li>
              <li>Do not modify the template structure or column headers</li>
              <li>Empty rows will be ignored during processing</li>
            </ul>
          </div>

          <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h3 className="text-lg font-medium text-yellow-800 mb-2">Valid Group Combinations</h3>
            <p className="text-yellow-700">
              Groups are typically assigned as either "A,B" or "C,D" pairs. Please ensure you use these standard combinations
              unless specifically instructed otherwise.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}