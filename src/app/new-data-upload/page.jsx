'use client';

import React, { useState } from 'react';
import { Download, ArrowLeft, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import Sidebar from '../../components/sidebar';

export default function StudentRegistrationFormat() {
  const [expandedCenters, setExpandedCenters] = useState({});

  const toggleCenter = (centerName) => {
    setExpandedCenters(prev => ({
      ...prev,
      [centerName]: !prev[centerName]
    }));
  };

  const handleDownloadTemplate = () => {
    console.log('Download template');
    // Handle template download logic
  };

  const handleBackToUpload = () => {
    console.log('Back to upload');
    // Handle navigation back to upload page
  };

  const centers = [
    'Main Campus',
    'Downtown Center',
    'Online Learning',
    'North Annex',
    'South Satellite'
  ];

  const fileStructureFields = [
    { field: 'Name:', description: 'Full name of the student', color: 'text-purple-600' },
    { field: 'ID:', description: 'Unique student identification number', color: 'text-purple-600' },
    { field: 'Course:', description: 'Specific course name (e.g., "Calculus I", "Marketing Principles")', color: 'text-purple-600' },
    { field: 'Level:', description: 'Academic level (e.g., "Undergraduate", "Graduate")', color: 'text-purple-600' },
    { field: 'Day:', description: 'Day of the week for the class (e.g., "Monday", "Tuesday")', color: 'text-purple-600' },
    { field: 'Time:', description: 'Class time in HH:MM format (e.g., "09:00", "14:30")', color: 'text-purple-600' },
    { field: 'Center:', description: 'Campus or center where the course is held (e.g., "Main", "Downtown", "Online")', color: 'text-purple-600' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 z-10">
        <Sidebar />
      </div>
      
      {/* Main Content Area */}
      <div className="ml-64">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <span className="text-purple-600 font-medium cursor-pointer hover:text-purple-700">
                  Upload Wizard
                </span>
                <span className="text-gray-400">Upload</span>
                <span className="text-gray-400">Schedule</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
              Student Registration Format Guide
            </h1>
          </div>

          {/* File Structure Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">File Structure</h2>
            <p className="text-gray-600 text-sm mb-6">
              Your student schedule file should be in CSV or Excel format and contain the following required columns:
            </p>
            
            <div className="space-y-3">
              {fileStructureFields.map((item, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <span className={`font-medium ${item.color} min-w-[60px]`}>
                    {item.field}
                  </span>
                  <span className="text-gray-600 text-sm">
                    {item.description}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Centers Included */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Centers Included</h2>
              <p className="text-gray-600 text-sm mb-6">
                Our system supports schedule uploads for the following academic centers. Click on each to view specific rules and considerations:
              </p>
              
              <div className="space-y-2">
                {centers.map((center, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => toggleCenter(center)}
                      className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-gray-700 font-medium">{center}</span>
                      {expandedCenters[center] ? (
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                    {expandedCenters[center] && (
                      <div className="px-3 pb-3 text-sm text-gray-600">
                        Specific rules and considerations for {center} will be displayed here.
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Important Rules */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Important Rules</h2>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div className="space-y-3">
                    <h3 className="font-medium text-red-800">Critical Guidelines for Upload</h3>
                    
                    <div className="text-sm text-red-700 space-y-2">
                      <p>
                        <strong>File names must follow the format:</strong><br />
                        'Schedule_YYYYMMDD_Department.csv' or '.xlsx'
                      </p>
                      
                      <p>
                        <strong>All required columns</strong> ('Name', 'ID', 'Course', 'Level', 'Day', 'Time', 'Center') must be present and correctly spelled.
                      </p>
                      
                      <p>
                        <strong>Do not include any header rows</strong> or introductory text before the column headers.
                      </p>
                      
                      <p>
                        <strong>Empty cells for required fields</strong> will result in errors for that entry.
                      </p>
                      
                      <p>
                        <strong>Time must be in 24-hour format</strong> (e.g., 13:00 for 1 PM).
                      </p>
                      
                      <p>
                        <strong>Ensure no duplicate entries</strong> for the same student on the same course and time slot.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sample Data Table */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Sample Data Table</h2>
            <p className="text-gray-600 text-sm mb-6">
              This table illustrates how your data should be formatted, distinguishing between valid and invalid entries for clarity.
            </p>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">ID</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Course</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Level</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Day</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Time</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Center</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4">
                      <div className="flex items-center text-green-600">
                        <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center mr-2">
                          <svg className="w-2.5 h-2.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        Valid
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-700">Alice Wonderland</td>
                    <td className="py-3 px-4 text-gray-700">1001</td>
                    <td className="py-3 px-4 text-gray-700">CS101</td>
                    <td className="py-3 px-4 text-gray-700">UG</td>
                    <td className="py-3 px-4 text-gray-700">Monday</td>
                    <td className="py-3 px-4 text-gray-700">09:00</td>
                    <td className="py-3 px-4 text-gray-700">Main Campus</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4">
                      <div className="flex items-center text-green-600">
                        <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center mr-2">
                          <svg className="w-2.5 h-2.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        Valid
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-700">Bob TheBuilder</td>
                    <td className="py-3 px-4 text-gray-700">1002</td>
                    <td className="py-3 px-4 text-gray-700">ARCH203</td>
                    <td className="py-3 px-4 text-gray-700">GR</td>
                    <td className="py-3 px-4 text-gray-700">Tuesday</td>
                    <td className="py-3 px-4 text-gray-700">14:30</td>
                    <td className="py-3 px-4 text-gray-700">Downtown Center</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4">
                      <div className="flex items-center text-green-600">
                        <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center mr-2">
                          <svg className="w-2.5 h-2.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        Valid
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-700">Charlie Chaplin</td>
                    <td className="py-3 px-4 text-gray-700">1003</td>
                    <td className="py-3 px-4 text-gray-700">FILM305</td>
                    <td className="py-3 px-4 text-gray-700">UG</td>
                    <td className="py-3 px-4 text-gray-700">Wednesday</td>
                    <td className="py-3 px-4 text-gray-700">11:00</td>
                    <td className="py-3 px-4 text-gray-700">Online Learning</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4">
                      <div className="flex items-center text-red-600">
                        <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center mr-2">
                          <svg className="w-2.5 h-2.5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                        Invalid
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-700">Diana Prince</td>
                    <td className="py-3 px-4 text-gray-700">1004</td>
                    <td className="py-3 px-4 text-gray-700">PHY201</td>
                    <td className="py-3 px-4 text-gray-700">UG</td>
                    <td className="py-3 px-4 text-gray-700">Thursday</td>
                    <td className="py-3 px-4 text-gray-700">10:00</td>
                    <td className="py-3 px-4 text-gray-700">Main Campus</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4">
                      <div className="flex items-center text-green-600">
                        <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center mr-2">
                          <svg className="w-2.5 h-2.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        Valid
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-700">Eve Harrington</td>
                    <td className="py-3 px-4 text-gray-700">1005</td>
                    <td className="py-3 px-4 text-gray-700">LIT102</td>
                    <td className="py-3 px-4 text-gray-700">GR</td>
                    <td className="py-3 px-4 text-gray-700">Friday</td>
                    <td className="py-3 px-4 text-gray-700">16:00</td>
                    <td className="py-3 px-4 text-gray-700">North Annex</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4">
                      <div className="flex items-center text-green-600">
                        <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center mr-2">
                          <svg className="w-2.5 h-2.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        Valid
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-700">Frankenstein</td>
                    <td className="py-3 px-4 text-gray-700">1006</td>
                    <td className="py-3 px-4 text-gray-700">BIO101</td>
                    <td className="py-3 px-4 text-gray-700">UG</td>
                    <td className="py-3 px-4 text-gray-700">Monday</td>
                    <td className="py-3 px-4 text-gray-700">13:00</td>
                    <td className="py-3 px-4 text-gray-700">South Satellite</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-3 px-4">
                      <div className="flex items-center text-green-600">
                        <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center mr-2">
                          <svg className="w-2.5 h-2.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        Valid
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-700">Grace Hopper</td>
                    <td className="py-3 px-4 text-gray-700">1007</td>
                    <td className="py-3 px-4 text-gray-700">ENG401</td>
                    <td className="py-3 px-4 text-gray-700">GR</td>
                    <td className="py-3 px-4 text-gray-700">Tuesday</td>
                    <td className="py-3 px-4 text-gray-700">10:00</td>
                    <td className="py-3 px-4 text-gray-700">Main Campus</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">
                      <div className="flex items-center text-red-600">
                        <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center mr-2">
                          <svg className="w-2.5 h-2.5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                        Invalid
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-700">Harry Potter</td>
                    <td className="py-3 px-4 text-gray-700">1008</td>
                    <td className="py-3 px-4 text-gray-700">MAGIC101</td>
                    <td className="py-3 px-4 text-gray-700">UG</td>
                    <td className="py-3 px-4 text-gray-700">Wednesday</td>
                    <td className="py-3 px-4 text-gray-700">14:00</td>
                    <td className="py-3 px-4 text-gray-700">Online Learning</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleDownloadTemplate}
              className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Template
            </button>
            
            <button
              onClick={handleBackToUpload}
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Upload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}