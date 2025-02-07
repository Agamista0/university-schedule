'use client'

import { useState } from 'react'

const RoomsLabsInfo = () => {
  const roomsData = [
    {
      center: 'Assuit',
      rooms: [
        {
          name: 'مدرج8',
          capacity: 250,
          equipment: ['1شاشة-65', 'Cisco Kit', '6 Sound', 'Video', 'Active panal']
        },
        // ... other rooms data
      ]
    },
    // ... other centers data
  ]

  const [selectedCenter, setSelectedCenter] = useState('all')

  const filteredRooms = selectedCenter === 'all' 
    ? roomsData 
    : roomsData.filter(center => center.center === selectedCenter)

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Rooms & Labs Information Guide</h1>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">File Structure</h2>
            <p className="text-gray-600 mb-4">
              The Rooms & Labs file should be an Excel file (.xlsx) with the following columns:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Center Name</li>
                <li>Room/Lab Name</li>
                <li>Capacity</li>
                <li>Equipment (Comma-separated list)</li>
              </ul>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Example Data</h2>
            <select 
              className="mb-4 p-2 border rounded"
              value={selectedCenter}
              onChange={(e) => setSelectedCenter(e.target.value)}
            >
              <option value="all">All Centers</option>
              {roomsData.map(center => (
                <option key={center.center} value={center.center}>
                  {center.center}
                </option>
              ))}
            </select>

            <div className="overflow-x-auto">
              {filteredRooms.map(center => (
                <div key={center.center} className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">{center.center}</h3>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room/Lab</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipment</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {center.rooms.map((room, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{room.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{room.capacity}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            <ul className="list-disc list-inside">
                              {room.equipment.map((item, i) => (
                                <li key={i}>{item}</li>
                              ))}
                            </ul>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Download Template</h2>
            <a 
              href="/formats/rooms-labs-format.xlsx"
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              download
            >
              Download Excel Template
              <svg className="ml-2 -mr-1 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
              </svg>
            </a>
          </div>

          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold mb-4">Important Notes</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Center names must match exactly with the names used in other files</li>
              <li>Room/Lab names should be unique within each center</li>
              <li>Capacity should be specified as a number</li>
              <li>Equipment should be comma-separated without spaces</li>
              <li>Do not modify the template structure or column headers</li>
              <li>Empty rows will be ignored during processing</li>
            </ul>
          </div>

          <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h3 className="text-lg font-medium text-yellow-800 mb-2">Equipment Standards</h3>
            <p className="text-yellow-700">
              Common equipment items include: Cisco Kit, Sound Systems, Video Equipment, Active Panels, and Display Screens.
              Please use standard equipment names for consistency across all centers.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoomsLabsInfo
