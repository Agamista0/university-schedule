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
    '08:00 : 09:00',
    '09:00 : 10:00',
    '10:00 : 11:00',
    '11:00 : 12:00',
    '12:00 : 01:00',
    '01:00 : 02:00',
    '02:00 : 03:00',
    '03:00 : 04:00',
    '04:00 : 05:00',
    '05:00 : 06:00',
    '06:00 : 07:00',
    '07:00 : 08:00'
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
      // Handle cases where time is like "08:00 : 9:00" or "8:00 : 9:00"
      const [start] = time.split(':');
      const hour = parseInt(start.trim());
      return hour >= 8 ? 
        `${hour.toString().padStart(2, '0')}:00` : 
        `${(hour + 12).toString().padStart(2, '0')}:00`;
    };

    // Extract just the start time from both strings
    const [lectureStart] = lectureTime.split(':');
    const [slotStart] = slotTime.split(':');
    
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

  return (
    <div className={`flex ${isFullscreen ? '' : ''}`}>
      {!isFullscreen && <Sidebar />}
      <div 
        ref={containerRef} 
        className={`p-4 ${isFullscreen ? 'h-screen overflow-auto bg-white' : 'max-w-screen-2xl mx-auto'}`}
      >
        <button
          onClick={toggleFullscreen}
          className="fixed right-4 top-4 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded shadow-md z-50 transition-colors text-sm"
        >
          {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        </button>
        <div className="flex" style={{ minWidth: isFullscreen ? '100vw' : 'auto' }}>
          <table className="border-collapse bg-white text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left w-24">Center</th>
                <th className="border p-2 text-left w-36">Hall</th>
              </tr>
            </thead>
            <tbody>
              {uniqueCenters.map((center, centerIndex) => {
                const centerHalls = getHallsByCenter(center);
                return (
                  <React.Fragment key={center}>
                    {centerHalls.map((hall, hallIndex) => (
                      <tr key={`${center}-${hall}`}>
                        {hallIndex === 0 && (
                          <td 
                            rowSpan={centerHalls.length} 
                            className={`border p-2 font-semibold text-center text-sm ${centerColorClasses[uniqueCenters.indexOf(center) % centerColorClasses.length]}`}
                          >
                            {center}
                          </td>
                        )}
                        <td className={`border p-2 text-center ${hallColorClasses[hallIndex % hallColorClasses.length]}`}>
                          <div className="font-semibold text-sm">{hall}</div>
                          <div className="text-xs text-gray-600">
                            Capacity: {scheduleData.find(item => 
                              item.center === center && 
                              item.hall === hall
                            )?.capacity || 'N/A'}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>

          <div 
            ref={scrollContainerRef}
            className="overflow-x-auto cursor-grab active:cursor-grabbing select-none"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onMouseMove={handleMouseMove}
          >
            <table className="border-collapse bg-white text-sm">
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
                      <th key={`${day}-${time}`} className="border p-1 text-center">
                        <div className="text-xs font-medium">{time}</div>
                      </th>
                    ))
                  ))}
                </tr>
              </thead>
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
                                <td key={`${day}-${time}`} className="border p-1 align-top">
                                  <div className="w-32 h-32 p-1 bg-gray-50 rounded border flex flex-col justify-center">
                                    {lecture ? (
                                      <>
                                        <div className="flex-1 flex flex-col justify-center text-center">
                                          <div className="text-xs font-semibold text-blue-700 line-clamp-2">{lecture.lecture}</div>
                                          <div className="text-[10px] text-gray-600">{lecture.professor}</div>
                                          <div className="text-[10px] text-gray-500">
                                            {/* Show all available groups */}
                                            {Object.entries(lecture.groups).map(([group, mode], index) => (
                                              <span key={group}>
                                                {index > 0 && <br/>}
                                                Group  {group}: {mode}
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
    </div>
  )
}

export default Page
