import React, { useState } from 'react'
import Link from 'next/link'

function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`fixed top-0 left-0 h-screen bg-slate-950 text-white transition-all duration-300 z-[9999] ${
      isExpanded ? 'w-64' : 'w-[70px]'
    }`}>
      {/* Toggle Button */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className={`absolute top-4 bg-slate-800 p-1 rounded-full border border-slate-700 hover:bg-slate-700 transition-all duration-300 ${
          isExpanded ? 'right-4' : 'left-1/2 -translate-x-1/2'
        }`}
      >
        {isExpanded ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        )}
      </button>

      {/* Only show content when sidebar is expanded */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Schedule Button */}
          <Link href="/schedule" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Schedule</span>
          </Link>

          {/* Upload Button */}
          <Link href="/upload" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <span>Upload</span>
          </Link>

          {/* Edit Info Button */}
          <Link href="/edit-info" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Edit Info</span>
          </Link>
        </div>
      )}
    </div>
  )
}

export default Sidebar
