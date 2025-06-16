"use client";

import React from "react";
import { Cloud, Building, GraduationCap, Users } from "lucide-react";
import Sidebar from "../../components/sidebar";
import ProtectedRoute from "../../components/ProtectedRoute.jsx";

export default function UploadCategorySelector() {
  const categories = [
    {
      id: "it-department",
      title: "IT Department Files",
      description:
        "Upload technical documents, software licenses, and project specifications securely for IT operations.",
      icon: Cloud,
      color: "text-blue-500",
    },
    {
      id: "business-admin",
      title: "Business Administration",
      description:
        "Submit administrative reports, financial records, and operational guidelines for review.",
      icon: Building,
      color: "text-purple-500",
    },
    {
      id: "university-resources",
      title: "University Resources",
      description:
        "Contribute academic papers, research data, and course materials for various departments.",
      icon: GraduationCap,
      color: "text-indigo-500",
    },
    {
      id: "teaching-assistants",
      title: "Teaching Assistants Documents",
      description:
        "Upload HR policies, employee records, and training manuals while maintaining confidentiality.",
      icon: Users,
      color: "text-gray-600",
    },
  ];

  const handleCategorySelect = (categoryId) => {
    console.log("Selected category:", categoryId);
    // Handle category selection logic here
  };

  return (
    <ProtectedRoute role="admin">
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
                  <span className="text-gray-900 font-medium">Admin</span>
                  <span className="text-gray-400">File Upload</span>
                </div>
                <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">Y</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Choose an Upload Category
              </h1>
              <p className="text-gray-600 max-w-2xl">
                Select a category below to upload files relevant to your content
                management needs. Each category provides a dedicated and secure
                space for your documents.
              </p>
            </div>

            {/* Category Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {categories.slice(0, 3).map((category) => {
                const IconComponent = category.icon;
                return (
                  <div
                    key={category.id}
                    className="bg-white rounded-lg border border-gray-200 p-6 hover:border-gray-300 transition-colors"
                  >
                    <div className="mb-4">
                      <IconComponent className={`w-8 h-8 ${category.color}`} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {category.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                      {category.description}
                    </p>
                    <button
                      onClick={() => handleCategorySelect(category.id)}
                      className="inline-flex items-center px-4 py-2 border border-blue-300 text-blue-600 rounded-md hover:bg-blue-50 transition-colors text-sm font-medium"
                    >
                      Select Category
                      <svg
                        className="w-4 h-4 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Fourth Category - Full Width */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 hover:border-gray-300 transition-colors max-w-md">
              <div className="mb-4">
                <Users className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Teaching Assistants Documents
              </h3>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                Upload HR policies, employee records, and training manuals while
                maintaining confidentiality.
              </p>
              <button
                onClick={() => handleCategorySelect("teaching-assistants")}
                className="inline-flex items-center px-4 py-2 border border-blue-300 text-blue-600 rounded-md hover:bg-blue-50 transition-colors text-sm font-medium"
              >
                Select Category
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
