import React, { useEffect } from "react";
import { AlertCircle, SearchCheck, SearchIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "./ui/button";

const ScheduleTable = ({ scheduleData }) => {
  const tableRef = React.useRef(null);
  const headerRef = React.useRef(null);
  const leftPanelRef = React.useRef(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [startX, setStartX] = React.useState(0);
  const [scrollLeft, setScrollLeft] = React.useState(0);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const containerRef = React.useRef(null);

  console.log(scheduleData);

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

  // Check if there's any data
  if (!scheduleData || scheduleData.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <Button
          className="bg-blue-600 hover:bg-blue-500 p-10 text-lg"
          onClick={() => {}}
        >
          Generate new schedule
        </Button>
      </div>
    );
  }

  // Data processing functions
  const uniqueDays = [...new Set(scheduleData.map((item) => item.day))].sort(
    (a, b) => {
      const dayOrder = {
        Saturday: 0,
        Sunday: 1,
        Monday: 2,
        Tuesday: 3,
        Wednesday: 4,
        Thursday: 5,
        Friday: 6,
      };
      return dayOrder[a] - dayOrder[b];
    }
  );

  const uniqueCenters = [...new Set(scheduleData.map((item) => item.center))];
  const uniqueTimes = [
    "8:00-9:00",
    "9:00-10:00",
    "10:00-11:00",
    "11:00-12:00",
    "12:00-1:00",
    "1:00-2:00",
    "2:00-3:00",
    "3:00-4:00",
    "4:00-5:00",
  ];
  const uniqueColors = [...new Set(scheduleData.map((item) => item.color))];

  console.log(uniqueColors);

  const getHallsByCenter = (center) => {
    const halls = [
      ...new Set(
        scheduleData
          .filter((item) => item.center === center)
          .map((item) => item.hall)
      ),
    ];
    return halls.length > 0 ? halls : null;
  };

  const getLecturesForHall = (center, hall, day, time) => {
    return scheduleData.find(
      (item) =>
        item.center === center &&
        item.hall === hall &&
        item.day === day &&
        isMatchingTime(item.time, time)
    );
  };

  const isMatchingTime = (lectureTime, slotTime) => {
    const normalizeTime = (time) => {
      const hour = parseInt(time.split(":")[0]);
      return hour >= 8 ? `${hour}:00` : `${hour + 12}:00`;
    };
    const lectureStart = lectureTime?.split(":")[0];
    const slotStart = slotTime.split("-")[0];
    return (
      lectureStart &&
      normalizeTime(lectureStart.trim()) === normalizeTime(slotStart.trim())
    );
  };

  const centerColorClasses = [
    "bg-red-100",
    "bg-blue-100",
    "bg-green-100",
    "bg-yellow-100",
    "bg-purple-100",
    "bg-pink-100",
  ];

  const hallColorClasses = [
    "bg-red-200",
    "bg-blue-200",
    "bg-green-200",
    "bg-yellow-200",
    "bg-purple-200",
    "bg-pink-200",
    "bg-indigo-200",
    "bg-orange-200",
  ];

  // Drag handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - tableRef.current.offsetLeft);
    setScrollLeft(tableRef.current.scrollLeft);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - tableRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    tableRef.current.scrollLeft = scrollLeft - walk;
  };

  // Sync scroll effect
  React.useEffect(() => {
    const handleScroll = () => {
      if (tableRef.current) {
        const scrollLeft = tableRef.current.scrollLeft;
        if (headerRef.current) {
          headerRef.current.scrollLeft = scrollLeft;
        }
      }
    };

    const table = tableRef.current;
    if (table) {
      table.addEventListener("scroll", handleScroll);
      return () => table.removeEventListener("scroll", handleScroll);
    }
  }, []);

  // Sync vertical scroll effect
  React.useEffect(() => {
    const handleVerticalScroll = () => {
      if (tableRef.current) {
        const scrollTop = tableRef.current.scrollTop;
        if (leftPanelRef.current) {
          leftPanelRef.current.scrollTop = scrollTop;
        }
      }
    };

    const table = tableRef.current;
    if (table) {
      table.addEventListener("scroll", handleVerticalScroll);
      return () => table.removeEventListener("scroll", handleVerticalScroll);
    }
  }, []);

  // Empty Center Component
  const EmptyCenterRow = ({ center, centerIndex }) => (
    <tr>
      <td
        className={`border-r font-medium text-center text-gray-900 
        ${centerColorClasses[centerIndex % centerColorClasses.length]}`}
      >
        <div className="h-28 w-[128px] flex flex-col items-center justify-center p-4">
          <span className="text-base">{center}</span>
        </div>
      </td>
      <td
        colSpan={uniqueDays.length * uniqueTimes.length + 1}
        className="border"
      >
        <div className="h-28 flex items-center justify-center p-4 bg-gray-50">
          <div className="flex items-center gap-2 text-gray-500">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">
              No scheduled classes for this center
            </span>
          </div>
        </div>
      </td>
    </tr>
  );

  return (
    <div
      className={`relative max-h-[calc(100vh-12rem)] ${
        isFullscreen ? "w-screen" : ""
      }`}
    >
      <div
        ref={containerRef}
        className={`p-4  ${
          isFullscreen
            ? "m-auto w-screen overflow-auto pt-[100px] bg-white"
            : "w-[calc(100%-170px)]"
        } 
          ${!isFullscreen ? "ml-[70px] mx-6" : ""} scrollbar-hide`}
      >
        {/* Filters - Appear only on non fullscreen */}
        {!isFullscreen && (
          <>
            <div className="flex w-full mb-4 justify-start p-4 items-center gap-4 align-middle h-[60px] bg-white border rounded">
              {/* Search */}
              <div>
                <input
                  type="text"
                  placeholder="Search Lectures"
                  className="border border-gray-300 rounded px-2 py-1"
                  onChange={() => {}}
                />
              </div>
              <div className="flex gap-2">
                <select
                  name="center"
                  id="center"
                  placeholder="Select Center"
                  className="border border-gray-300 rounded px-2 py-1"
                >
                  <option value="Select Center">Select Center</option>
                  {uniqueCenters.map((center, index) => (
                    <option key={index} value={center}>
                      {center}
                    </option>
                  ))}
                </select>
                <select
                  name="department"
                  id="department"
                  placeholder="Select Department"
                  className="border border-gray-300 rounded px-2 py-1"
                >
                  <option value="Select Department">Select Department</option>
                  <option value="it">IT</option>
                  <option value="business">Business</option>
                </select>
                <button className="border hover:bg-gray-700 hover:text-white px-3 py-1 rounded z-50 transition-colors text-sm flex items-center gap-1">
                  <SearchIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={toggleFullscreen}
                  className="border hover:bg-gray-700 hover:text-white px-3 py-1 rounded z-50 transition-colors text-sm flex items-center gap-1"
                >
                  {isFullscreen ? (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5 5.25 5.25"
                        />
                      </svg>
                      Exit Fullscreen
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
                        />
                      </svg>
                      Enter Fullscreen
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        )}
        {/* Fixed Header */}
        <div className="sticky top-0 z-30 bg-white">
          <div className="flex h-[60px]">
            {/* Left Header */}
            <div className="sticky left-0 z-30 w-64">
              <table className="border-collapse w-full h-full ">
                <thead>
                  <tr>
                    <th
                      rowSpan={2}
                      className="border px-6 text-center bg-gray-100 font-semibold text-gray-700"
                    >
                      Center
                    </th>
                    <th
                      rowSpan={2}
                      className="border px-6 text-center bg-gray-100 font-semibold text-gray-700"
                    >
                      Hall
                    </th>
                  </tr>
                </thead>
              </table>
            </div>

            {/* Days/Times Header */}
            <div
              ref={headerRef}
              className="overflow-hidden flex-1 w-52 scrollbar-hide h-full"
            >
              <table className="border-collapse w-full h-full">
                <thead className="h-full">
                  {/* Days Header */}
                  <tr className="h-full">
                    {uniqueDays.map((day) => (
                      <th
                        key={day}
                        colSpan={uniqueTimes.length}
                        className="bg-white"
                      >
                        <div className="h-full  font-normal text-center text-sm bg-gray-100 border rounded-lg">
                          <div className="flex items-center justify-center h-full align-middle">
                            {day}
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                  {/* Times Header */}
                  <tr>
                    {uniqueDays.map((day) =>
                      uniqueTimes.map((time) => (
                        <th
                          key={`${day}-${time}`}
                          className="text-center whitespace-nowrap"
                        >
                          <div className="text-xs w-52 h-[23px] font-medium text-gray-500 flex items-center justify-center">
                            {time}
                          </div>
                        </th>
                      ))
                    )}
                  </tr>
                </thead>
              </table>
            </div>
          </div>
        </div>
        {/* Scrollable Content */}
        <div
          className="flex overflow-auto scrollbar-hide h-full"
          style={{ height: "calc(100vh - 16rem)" }}
        >
          {/* Left Column Content */}
          <div
            ref={leftPanelRef}
            className="sticky left-0 w-64 bg-white z-20 overflow-auto scrollbar-hide h-full"
          >
            <table className="border-collapse w-full h-full">
              <tbody>
                {uniqueCenters.map((center, centerIndex) => {
                  const centerHalls = getHallsByCenter(center);
                  if (!centerHalls) {
                    return (
                      <EmptyCenterRow
                        key={center}
                        center={center}
                        centerIndex={centerIndex}
                      />
                    );
                  }
                  return centerHalls.map((hall, hallIndex) => (
                    <tr key={`${center}-${hall}`}>
                      {/* CENTER COLUMN */}
                      {hallIndex === 0 && (
                        <td
                          rowSpan={centerHalls.length}
                          className={`border-r font-medium text-center text-gray-900 
                            ${
                              centerColorClasses[
                                centerIndex % centerColorClasses.length
                              ]
                            }`}
                        >
                          <div className="h-28 w-[137px] flex flex-col items-center justify-center">
                            <span className="text-base">{center}</span>
                            <span className="text-xs text-gray-500 mt-1">
                              {centerHalls.length}{" "}
                              {centerHalls.length > 1 ? "Halls" : "Hall"}
                            </span>
                          </div>
                        </td>
                      )}
                      {/* HALL COLUMN */}
                      <td
                        className={`border text-center ${
                          hallColorClasses[hallIndex % hallColorClasses.length]
                        }`}
                      >
                        <div className="h-28 w-[114px] flex flex-col items-center justify-center">
                          <span className="font-medium text-gray-900 ">
                            {hall}
                          </span>
                          {/* HALL CAPACITY COMMENTED */}
                          {/* <div className="flex items-center gap-1 mt-2">
                            <svg
                              className="h-4 w-4 text-gray-500"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                            </svg>
                            <span className="text-xs text-gray-600">
                              Capacity:{" "}
                              {scheduleData.find(
                                (item) =>
                                  item.center === center && item.hall === hall
                              )?.capacityHall || "N/A"}
                            </span>
                          </div> */}
                        </div>
                      </td>
                    </tr>
                  ));
                })}
              </tbody>
            </table>
          </div>

          {/* Main Content */}
          <div
            ref={tableRef}
            className="flex-1 cursor-grab active:cursor-grabbing scrollbar-hide overflow-auto"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onMouseMove={handleMouseMove}
          >
            <table className="border-collapse bg-white text-sm">
              <tbody>
                {uniqueCenters.map((center) => {
                  const centerHalls = getHallsByCenter(center);
                  if (!centerHalls) return null;
                  return centerHalls.map((hall) => (
                    <tr key={`${center}-${hall}`}>
                      {uniqueDays.map((day) =>
                        uniqueTimes.map((time) => {
                          const lecture = getLecturesForHall(
                            center,
                            hall,
                            day,
                            time
                          );

                          return (
                            <td
                              key={`${day}-${time}`}
                              className="whitespace-nowrap"
                            >
                              <div
                                className={`h-28 w-52 rounded border-[1px] p-2 transition flex flex-col justify-center`}
                                style={
                                  lecture
                                    ? { backgroundColor: lecture.color }
                                    : { backgroundColor: "white" }
                                }
                              >
                                {lecture ? (
                                  <div className="flex-1 flex flex-col ">
                                    <div
                                      className={`text-xs text-wrap w-full font-semibold text-black line-clamp-2`}
                                    >
                                      {lecture.lecture}
                                    </div>
                                    <div className="text-[10px] text-gray-600">
                                      {lecture.professor}
                                    </div>
                                    <div className="text-[10px] text-gray-500">
                                      {Object.entries(lecture.groups).map(
                                        ([group, mode], index) => (
                                          <span key={group}>
                                            {index > 0 && <br />}
                                            Group {group}: {mode}
                                          </span>
                                        )
                                      )}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-xs text-gray-400 text-center h-full flex items-center justify-center">
                                    Available
                                  </div>
                                )}
                              </div>
                            </td>
                          );
                        })
                      )}
                    </tr>
                  ));
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleTable;
