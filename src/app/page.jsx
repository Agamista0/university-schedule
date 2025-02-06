'use client'
import React from 'react'
import scheduleData from '../../public/message.json'

function Page() {
  // Get unique days for the header
  const uniqueDays = [...new Set(scheduleData.map(item => item.day))]
  
  // Get unique centers
  const uniqueCenters = [...new Set(scheduleData.map(item => item.center))]

  // Get all unique times sorted chronologically
  const uniqueTimes = [...new Set(scheduleData.map(item => item.time))].sort((a, b) => {
    const getTimeValue = (timeStr) => {
      // Reuse the same time conversion logic from getLecturesForHall
      const [start] = timeStr.split('-');
      const time = start.padEnd(5, ':00');
      const [hours, minutes] = time.split(':').map(Number);
      
      let adjustedHours = hours;
      if (hours >= 1 && hours <= 7) adjustedHours += 12;
      if (hours === 12) adjustedHours = 12;
      
      return new Date(`1970-01-01T${adjustedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`).getTime();
    };
    return getTimeValue(a) - getTimeValue(b);
  });

  // Get unique halls for each center
  const getHallsByCenter = (center) => {
    return [...new Set(scheduleData
      .filter(item => item.center === center)
      .map(item => item.hall))]
  }

  // Get lectures for specific hall and day
  const getLecturesForHall = (center, hall, day) => {
    return scheduleData.filter(item => 
      item.center === center && 
      item.hall === hall && 
      item.day === day
    ).sort((a, b) => {
      // Convert start times to Date objects with proper AM/PM handling
      const getTimeValue = (timeStr) => {
        const [start] = timeStr.split('-');
        const time = start.padEnd(5, ':00');
        const [hours, minutes] = time.split(':').map(Number);
        
        // Convert to 24-hour format based on schedule context
        let adjustedHours = hours;
        if (hours >= 1 && hours <= 7) { // PM times
          adjustedHours += 12;
        }
        if (hours === 12) { // Noon
          adjustedHours = 12;
        }
        
        return new Date(`1970-01-01T${adjustedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`).getTime();
      };
      return getTimeValue(a.time) - getTimeValue(b.time);
    })
  }

  return (
    <div className="p-6 max-w-screen-2xl mx-auto ">
      <table className="w-full border-collapse bg-white">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-3 text-left">Center</th>
            <th className="border p-3 text-left">Hall</th>
            {uniqueDays.map(day => (
              <th key={day} className="border p-3 text-center">
                <div className="font-bold">{day}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {uniqueCenters.map((center) => (
            getHallsByCenter(center).map((hall) => (
              <tr key={`${center}-${hall}`}>
                <td className="border p-3 bg-blue-50 font-semibold text-center">{center}</td>
                <td className="border p-3 bg-green-50 text-center">
                  <div className="font-semibold">Hall: {hall}</div>
                  <div className="text-sm text-gray-600">
                    Capacity: {scheduleData.find(item => 
                      item.center === center && 
                      item.hall === hall
                    )?.capacity || 'N/A'}
                  </div>
                </td>
                {uniqueDays.map(day => {
                  const dayLectures = getLecturesForHall(center, hall, day);
                  return (
                    <td key={day} className="border p-3 min-w-[1400px]">
                      <div className="space-x-4 flex">
                        {uniqueTimes.map(time => {
                          const lecture = dayLectures.find(l => l.time === time);
                          return (
                            <div
                              key={time}
                              className="p-2 bg-gray-50 rounded border flex flex-col justify-center max-w-[200px] w-[100%] max-h-[200px]"
                            >
                              {lecture ? (
                                <>
                                  <div className="text-sm font-medium text-gray-600 text-center">
                                    {lecture.time}{' '}
                                    {new Date(`1970-01-01T${lecture.time.split('-')[0].padEnd(5, ':00')}`)
                                      .toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
                                      .split(' ')[1]}
                                  </div>
                                  <div className="flex-1 flex flex-col justify-center text-center">
                                    <div className="text-sm font-semibold text-blue-700 line-clamp-3">{lecture.lecture}</div>
                                    <div className="text-xs text-gray-600">{lecture.professor}</div>
                                    <div className="text-xs text-gray-500">
                                      Groups: {lecture.groups.A}/{lecture.groups.B}
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <div className="flex items-center justify-center h-full min-h-[100px]">
                                  <div className="text-sm font-medium text-gray-400">
                                    {time}{' '}
                                    {new Date(`1970-01-01T${time.split('-')[0].padEnd(5, ':00')}`)
                                      .toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
                                      .split(' ')[1]}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Page
