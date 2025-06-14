'use client';

import React from 'react';
import { Calendar, Users, ArrowLeft } from 'lucide-react';
import Sidebar from '../../components/sidebar';

export default function ITDepartmentUploads() {
  const handleUploadFiles = (type) => {
    console.log('Upload files for:', type);
    // Handle file upload logic here
  };

  const handleViewFormat = (type) => {
    console.log('View format for:', type);
    // Handle view format logic here
  };

  const handleBackToCategories = () => {
    console.log('Back to categories');
    // Handle navigation back to categories
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <span className="text-purple-600 font-medium cursor-pointer hover:text-purple-700">
                  File Upload
                </span>
                <span className="text-gray-400">Lecture Schedule</span>
              </div>
              <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">A</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              IT Department File Uploads
            </h1>
          </div>

          {/* Upload Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Lecture Schedule Upload */}
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <div className="mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  Lecture Schedule Upload
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Submit the weekly lecture schedule for all IT courses. Ensure CSV format for quick processing.
                </p>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={() => handleViewFormat('lecture-schedule')}
                  className="text-purple-600 hover:text-purple-700 text-sm font-medium transition-colors"
                >
                  View Format
                </button>
                <button
                  onClick={() => handleUploadFiles('lecture-schedule')}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  Upload Files
                </button>
              </div>
            </div>

            {/* Student Enrollment Records */}
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <div className="mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  Student Enrollment Records
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Upload new student enrollment lists and course registrations. Use our provided Excel template.
                </p>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={() => handleViewFormat('student-enrollment')}
                  className="text-purple-600 hover:text-purple-700 text-sm font-medium transition-colors"
                >
                  View Format
                </button>
                <button
                  onClick={() => handleUploadFiles('student-enrollment')}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  Upload Files
                </button>
              </div>
            </div>
          </div>

          {/* Back to Categories Button */}
          <div className="flex justify-center">
            <button
              onClick={handleBackToCategories}
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Categories
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}