"use client";

import React from "react";
import Sidebar from "../../components/sidebar";

export default function UploadCategorySelector() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 z-10">
        <Sidebar activeLink="file-upload" />
      </div>

      {/* Main Content Area */}
      <div className="ml-64">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <span className="text-gray-900 font-medium">
                  Lecture Schedule
                </span>
                <span className="text-gray-400">Current Lectures Schedule</span>
              </div>
              <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">Y</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8"></div>
        </div>
      </div>
    </div>
  );
}
