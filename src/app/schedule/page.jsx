"use client";
import React from "react";
import scheduleData from "./message.json";
import Sidebar from "../api/components/Sidebar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ScheduleTable from "@/components/ScheduleTable";
import { Button } from "@/components/ui/button";
import axios from "axios";
import message from "./message.json";

function Page({ type, fetchedData }) {
  const scrollContainerRef = React.useRef(null);
  const containerRef = React.useRef(null);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [scheduleFetchedData, setScheduleFetchedData] = React.useState(null);

  React.useEffect(() => {
    const fetchLectures = async () => {
      try {
        if (fetchedData) {
          setScheduleFetchedData(fetchedData);
        }
      } catch (error) {
        console.error("Error fetching lectures:", error);
      }
    };

    fetchLectures();
  }, [fetchedData]);

  // Add at the top with other state declarations
  const [scrollX, setScrollX] = React.useState(0);

  // Add fullscreen toggle handler
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current
        .requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch((err) => console.error("Error entering fullscreen:", err));
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Add fullscreen change listener
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Add this effect after other useEffect hooks
  React.useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const scrollLeft = scrollContainerRef.current.scrollLeft;
        setScrollX(scrollLeft);

        // Find and update the fixed header's scroll position
        const fixedHeader = document.querySelector(".fixed .overflow-x-auto");
        if (fixedHeader) {
          fixedHeader.scrollLeft = scrollLeft;
        }
      }
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return (
    <div className={`flex ${isFullscreen ? "w-screen" : ""}`}>
      {!isFullscreen && <Sidebar />}
      <div
        ref={containerRef}
        className={`p-4  ${
          isFullscreen
            ? "h-screen w-screen overflow-auto bg-white"
            : "w-[calc(100%-170px)]"
        } 
          ${!isFullscreen ? "ml-[70px] mx-6" : ""} scrollbar-hide`}
      >
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-green-500">
              <h1 className="text-2xl font-bold  mb-4">Lectures</h1>
            </AccordionTrigger>
            <AccordionContent>
              {scheduleFetchedData !== null &&
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
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>
              <h1 className="text-2xl font-bold text-gray-800 mb-4">
                Sections
              </h1>
            </AccordionTrigger>
            <AccordionContent>
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <p className="text-gray-500 text-lg">Coming Soon</p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}

export default Page;
