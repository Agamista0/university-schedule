"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { InfoIcon } from "lucide-react";
import Sidebar from "../../components/sidebar";

const page = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content Area */}
      {/* Fixed Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 z-10">
        <Sidebar />
      </div>
      <div>
        {/* Header */}
        <div className="ml-64 bg-white shadow-sm border-b ">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <span className="text-gray-900 font-medium">
                  Page Not Accessible
                </span>
                <span className="text-gray-400">Unauthorized</span>
              </div>
              <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">Y</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl ml-64 mx-auto px-4 sm:px-6 lg:px-8 py-12 ">
          <div className="flex justify-center items-center align-middle">
            <div className="flex flex-col justify-center align-middle gap-4 items-center space-x-4">
              <span>
                <InfoIcon className="w-12 h-12 text-red-500" />
              </span>

              <span className="text-gray-900 text-2xl font-medium flex flex-col items-center">
                Page Not Accessible
                <span className="text-gray-400 text-sm">Unauthorized</span>
              </span>

              <button
                onClick={handleGoBack}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-full transition-colors duration-200"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
