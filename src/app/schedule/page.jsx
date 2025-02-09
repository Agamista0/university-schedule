'use client'
import React from 'react'
import scheduleData from './message.json'
import Sidebar from '../api/components/Sidebar'

function Page() {
  // Add these new state and handler functions at the beginning of the component
  const [isDragging, setIsDragging] = React.useState(false);
  const [startX, setStartX] = React.useState(0);
  const [scrollLeft, setScrollLeft] = React.useState(0);
  const scrollContainerRef = React.useRef(null);
  const containerRef = React.useRef(null);
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  // Add new ref and state for vertical scrolling
  const leftTableRef = React.useRef(null);
  const rightTableRef = React.useRef(null);

  // Add at the top with other state declarations
  const [scrollX, setScrollX] = React.useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  // Get unique days for the header
  const uniqueDays = [...new Set(scheduleData.map(item => item.day))].sort((a, b) => {
    const dayOrder = {
      'Saturday': 0,
      'Sunday': 1,
      'Monday': 2,
      'Tuesday': 3,
      'Wednesday': 4,
      'Thursday': 5,
      'Friday': 6
    };
    return dayOrder[a] - dayOrder[b];
  });
  
  // Get unique centers
  const uniqueCenters = [...new Set(scheduleData.map(item => item.center))]

  // Update the uniqueTimes to match the data format
  const uniqueTimes = [
    '8:00-9:00',
    '9:00-10:00',
    '10:00-11:00',
    '11:00-12:00',
    '12:00-1:00',
    '1:00-2:00',
    '2:00-3:00',
    '3:00-4:00',
    '4:00-5:00'
  ];
  // Get unique halls for each center
  const getHallsByCenter = (center) => {
    return [...new Set(scheduleData
      .filter(item => item.center === center)
      .map(item => item.hall))]
  }

  // Update the getLecturesForHall function to handle the time format
  const getLecturesForHall = (center, hall, day) => {
    return scheduleData.filter(item => 
      item.center === center && 
      item.hall === hall && 
      item.day === day
    ).sort((a, b) => {
      const getTimeValue = (timeStr) => {
        const [start] = timeStr.split(':');
        const hour = parseInt(start.trim());
        return hour >= 8 ? hour : hour + 12;
      };
      return getTimeValue(a.time) - getTimeValue(b.time);
    });
  };

  // Update the time comparison logic
  const isMatchingTime = (lectureTime, slotTime) => {
    const normalizeTime = (time) => {
      // Handle cases where time might be in different formats
      const hour = parseInt(time.split(':')[0]);
      return hour >= 8 ? 
        `${hour}:00` : 
        `${(hour + 12)}:00`;
    };

    // Extract just the start time from both strings
    const lectureStart = lectureTime.split(':')[0];
    const slotStart = slotTime.split('-')[0];
    
    // Compare normalized versions
    return normalizeTime(lectureStart.trim()) === normalizeTime(slotStart.trim());
  };

  // Color classes for centers
  const centerColorClasses = [
    'bg-red-100',
    'bg-blue-100',
    'bg-green-100',
    'bg-yellow-100',
    'bg-purple-100',
    'bg-pink-100'
  ];

  // Color classes for halls
  const hallColorClasses = [
    'bg-red-200',
    'bg-blue-200',
    'bg-green-200',
    'bg-yellow-200',
    'bg-purple-200',
    'bg-pink-200',
    'bg-indigo-200',
    'bg-orange-200'
  ];

  // Add fullscreen toggle handler
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(err => console.error('Error entering fullscreen:', err));
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
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Add handler for vertical scroll synchronization
  const handleVerticalScroll = (event) => {
    const scrollingElement = event.target;
    if (scrollingElement.classList.contains('right-table')) {
      leftTableRef.current.scrollTop = scrollingElement.scrollTop;
    } else {
      rightTableRef.current.scrollTop = scrollingElement.scrollTop;
    }
  };

  // Add new handler for delete action
  const handleDelete = () => {
    // You can implement the delete functionality here
    console.log('Delete clicked');
  };

  // Add new handler for PDF download
  const handleDownloadPDF = () => {
    // You can implement the PDF download functionality here
    console.log('Download PDF clicked');
  };

  // Add this effect after other useEffect hooks
  React.useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const scrollLeft = scrollContainerRef.current.scrollLeft;
        setScrollX(scrollLeft);
        
        // Find and update the fixed header's scroll position
        const fixedHeader = document.querySelector('.fixed .overflow-x-auto');
        if (fixedHeader) {
          fixedHeader.scrollLeft = scrollLeft;
        }
      }
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <div className={`flex ${isFullscreen ? 'w-screen' : ''}`}>
      {!isFullscreen && <Sidebar />}
      <div 
        ref={containerRef} 
        className={`p-4  ${isFullscreen ? 'h-screen w-screen overflow-auto bg-white' : 'w-[calc(100%-170px)]'} 
          ${!isFullscreen ? 'ml-[70px] mx-6' : ''} scrollbar-hide`}
      >
        {/* Only show header and buttons when not in fullscreen */}
        {!isFullscreen && (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Lectures</h2>
          </>
        )}

        <button
          onClick={toggleFullscreen}
          className="fixed right-4 top-4 bg-gray-800 hover:bg-gray-700 text-white px-3 py-1 rounded shadow-md z-50 transition-colors text-sm flex items-center gap-1"
        >
          {isFullscreen ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5 5.25 5.25" />
              </svg>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
              </svg>
            </>
          )}
        </button>

        <div className={`flex scrollbar-hide ${isFullscreen ? 'h-screen' : ''}`}>
          <div 
            ref={leftTableRef}
            className={`overflow-y-auto min-w-fit scrollbar-hide ${
              isFullscreen ? 'max-h-screen' : 'max-h-[calc(100vh-12rem)]'
            }`}
            onScroll={handleVerticalScroll}
            style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
          >
            <table className="border-collapse bg-gray-50 text-sm sticky top-0 ">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left min-w-[96px]">Center</th>
                  <th className="border p-2 text-left min-w-[96px]">Hall</th>
                </tr>
              </thead>
              <tbody>
              <td className='mt-10 bg-gray-50 p-0.5'> <tr className='bg-gray-100'> <br /> </tr> </td>
                {uniqueCenters.map((center, centerIndex) => {
                  const centerHalls = getHallsByCenter(center);
                  return (
                    <React.Fragment key={center}>
                      {centerHalls.map((hall, hallIndex) => (
                        <tr key={`${center}-${hall}`}>
                          {hallIndex === 0 && (
                            <td 
                              rowSpan={centerHalls.length} 
                              className={`border p-1 font-semibold text-center text-sm ${centerColorClasses[uniqueCenters.indexOf(center) % centerColorClasses.length]}`}
                              style={{ height: '120px' }}
                            >
                              {center}
                            </td>
                          )}
                          <td 
                            className={`border p-1 text-center ${hallColorClasses[hallIndex % hallColorClasses.length]}`}
                            style={{ height: '120.75px' }}
                          >
                            <div className="h-24 w-24 flex flex-col justify-center p-5">
                              <div className="font-semibold text-sm">{hall}</div>
                              <div className="text-xs text-gray-600">
                                Capacity: {scheduleData.find(item => 
                                  item.center === center && 
                                  item.hall === hall
                                )?.capacity || 'N/A'}
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div 
            ref={rightTableRef}
            className={`right-table overflow-y-auto flex-1 scrollbar-hide ${
              isFullscreen ? 'max-h-screen' : 'max-h-[calc(100vh-12rem)]'
            }`}
            onScroll={handleVerticalScroll}
            style={{ 
              msOverflowStyle: 'none', /* IE and Edge */
              scrollbarWidth: 'none'  /* Firefox */
            }}
          >
            {/* Fixed header */}
            <div className="fixed top-[64px] z-50 bg-white "
                 style={{ 
                   width: rightTableRef.current ? rightTableRef.current.clientWidth : '100%',
                   msOverflowStyle: 'none',
                   scrollbarWidth: 'none'
                 }}>
              <div className="overflow-x-auto scrollbar-hide">
                <table className="border-collapse text-sm w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      {uniqueDays.map(day => (
                        <th key={day} colSpan={uniqueTimes.length} className="border p-2 text-center">
                          <div className="font-bold text-sm">{day}</div>
                        </th>
                      ))}
                    </tr>
                    <tr className="bg-gray-50">
                      {uniqueDays.map(day => (
                        uniqueTimes.map(time => (
                          <th key={`${day}-${time}`} className="border p-1 text-center whitespace-nowrap">
                            <div className="text-xs font-medium w-[120px]">{time}</div>
                          </th>
                        ))
                      ))}
                    </tr>
                  </thead>
                </table>
              </div>
            </div>

            {/* Add padding to account for fixed header */}
            <div className="h-[64px]"></div>

            <div
              ref={scrollContainerRef}
              className="overflow-x-auto cursor-grab active:cursor-grabbing select-none scrollbar-hide w-full relative"
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onMouseMove={handleMouseMove}
              style={{ 
                msOverflowStyle: 'none',
                scrollbarWidth: 'none'
              }}
            >
              {/* Main table content */}
              <table className="border-collapse bg-white text-sm">
                <tbody>
                  {uniqueCenters.map((center) => {
                    const centerHalls = getHallsByCenter(center);
                    return (
                      <React.Fragment key={center}>
                        {centerHalls.map((hall) => (
                          <tr key={`${center}-${hall}`}>
                            {uniqueDays.map(day => (
                              uniqueTimes.map(time => {
                                const lecture = getLecturesForHall(center, hall, day)
                                  .find(l => isMatchingTime(l.time, time));
                                return (
                                  <td key={`${day}-${time}`} className="border p-0 align-top">
                                    <div className="w-32 h-[120px] bg-gray-50 border flex flex-col justify-center">
                                      {lecture ? (
                                        <>
                                          <div className="flex-1 flex flex-col justify-center text-center">
                                            <div className="text-xs font-semibold text-blue-700 line-clamp-2 px-1">{lecture.lecture}</div>
                                            <div className="text-[10px] text-gray-600">{lecture.professor}</div>
                                            <div className="text-[10px] text-gray-500">
                                              {/* Show all available groups */}
                                              {Object.entries(lecture.groups).map(([group, mode], index) => (
                                                <span key={group}>
                                                  {index > 0 && <br/>}
                                                  Group {group}: {mode}
                                                </span>
                                              ))}
                                            </div>
                                          </div>
                                        </>
                                      ) : (
                                        <div className="text-xs text-gray-400 text-center">No lecture</div>
                                      )}
                                    </div>
                                  </td>
                                );
                              })
                            ))}
                          </tr>
                        ))}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Only show these sections when not in fullscreen */}
        {!isFullscreen && (
          <>
            {/* Buttons section */}
            <div className="mt-4 flex gap-4 justify-end">
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow-md transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
                Delete Schedule
              </button>
              <button
                onClick={handleDownloadPDF}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow-md transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Download PDF
              </button>
            </div>

            {/* Sections header and coming soon message */}
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Sections</h2>
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <p className="text-gray-500 text-lg">Coming Soon</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Page
