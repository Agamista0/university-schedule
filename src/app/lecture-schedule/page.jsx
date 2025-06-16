"use client";

import React from "react";
import Sidebar from "../../components/sidebar";
import ScheduleTable from "@/components/ScheduleTable";
import { Button } from "@/components/ui/button";
import axios from "axios";

export default function page() {
  const [scheduleFetchedData, setScheduleFetchedData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchLectures = async () => {
      try {
        const response = await axios.get("/api/distribute-lectures");
        if (response.data) {
          setScheduleFetchedData(response.data);
          setLoading(false);
        } else {
        }
      } catch (error) {
        console.error("Error fetching lectures:", error);
      }
    };

    fetchLectures();
  }, []);

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
        <div className=" mx-auto px-4 sm:px-6 lg:px-8 ">
          <div className="mb-8">
            {loading ? (
              <div className="flex justify-center items-center h-full mt-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
              </div>
            ) : scheduleFetchedData !== null &&
              scheduleFetchedData !== undefined &&
              scheduleFetchedData != [] ? (
              <>
                <ScheduleTable scheduleData={scheduleFetchedData} />
                <div
                  className={`flex justify-end mt-4 gap-4 ${
                    scheduleFetchedData.length > 1 ? "" : "hidden"
                  } mx-[7.2rem] mt-8`}
                >
                  <Button className="bg-blue-600 hover:bg-blue-500">
                    Download Schedule
                  </Button>
                  <Button variant="destructive" className="text-white">
                    Delete Schedule
                  </Button>
                </div>
              </>
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <Button className="bg-blue-600 hover:bg-blue-500">
                  Download Schedule
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
