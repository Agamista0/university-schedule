'use client';
import { useState } from 'react';
import axios from 'axios';
import Sidebar from '../api/components/Sidebar';
import Link from 'next/link';

export default function UploadPage() {
  const [files, setFiles] = useState({
    scheduleBA: null,
    registerStudentBA: null,
    scheduleIT: null,
    registerStudentIT: null,
    centerGroup: null,
    roomsLabs: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = {
    IT: {
      scheduleIT: 'Schedule IT',
      registerStudentIT: 'Register Student IT',
    },
    BA: {
      scheduleBA: 'Schedule BA',
      registerStudentBA: 'Register Student BA',
    },
    University : {
      centerGroup: 'Center and Group',
      roomsLabs: 'Rooms and Labs',
    }
  };

  const fileFormats = {
    scheduleIT: '/formats/schedule-format.xlsx',
    registerStudentIT: '/formats/student-registration-it-format.xlsx',
    scheduleBA: '/formats/schedule-format.xlsx',
    registerStudentBA: '/formats/student-registration-ba-format.xlsx',
    centerGroup: '/formats/center-group-template.xlsx',
    roomsLabs: '/formats/room-lab-assignment-template.xlsx'
  };

  const formatInfoPages = {
    scheduleIT: 'it-schedule-info',
    registerStudentIT: 'it-student-info',
    scheduleBA: 'ba-schedule-info',
    registerStudentBA: 'ba-student-info',
    centerGroup: 'center-group-info',
    roomsLabs: 'rooms-labs-info'
  };

  const endpointMap = {
    scheduleBA: '/api/upload/schedule/BA',
    registerStudentBA: '/api/upload/courses/ba',
    scheduleIT: '/api/upload/schedule/IT',
    registerStudentIT: '/api/upload/courses/it',
    centerGroup: '/api/upload/centers',
    roomsLabs: '/api/upload/rooms'
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e, fileType) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0], fileType);
    }
  };

  const handleFile = (file, fileType) => {
    setFiles(prev => ({
      ...prev,
      [fileType]: file
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if at least one file is uploaded
    const requiredFiles = Object.keys(categories[selectedCategory]);
    const uploadedFiles = requiredFiles.filter(key => files[key] !== null);

    if (uploadedFiles.length === 0) {
      setError('Please upload at least one file');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const uploadPromises = uploadedFiles.map(async (key) => {
        const endpoint = endpointMap[key];
        const formData = new FormData();
        formData.append('file', files[key]);

        const response = await axios.post(endpoint, formData, {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });

        // Validate response structure
        if (!response.data || !response.data.message) {
          throw new Error('Invalid server response');
        }

        return response;
      });

      const results = await Promise.allSettled(uploadPromises);
      
      // Check for any failed uploads
      const failedUploads = results.filter(result => result.status === 'rejected');
      if (failedUploads.length > 0) {
        const errorMessages = failedUploads.map(f => f.reason?.message || 'Unknown error');
        throw new Error(`Some files failed to upload: ${errorMessages.join(', ')}`);
      }

      setSuccess('Files uploaded successfully!');
      setFiles({
        scheduleBA: null,
        registerStudentBA: null,
        scheduleIT: null,
        registerStudentIT: null,
        centerGroup: null,
        roomsLabs: null
      });
      e.target.reset();
    } catch (err) {
      const errorMessage = err.response?.data?.error?.details || 
                          err.response?.data?.message || 
                          err.message || 
                          'Upload failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setFiles({
      scheduleBA: null,
      registerStudentBA: null,
      scheduleIT: null,
      registerStudentIT: null,
      centerGroup: null,
      roomsLabs: null
    });
    setError('');
    setSuccess('');
  };

  return (
    <div className="">
      <Sidebar />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              File Upload
            </h1>
            <p className="text-gray-600 text-lg">
              {selectedCategory ? `Upload ${selectedCategory} files` : 'Select a category to upload files'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center">
              <svg className="w-5 h-5 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-center">
              <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              {success}
            </div>
          )}

          {!selectedCategory ? (
            // Category Selection
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.keys(categories).map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  className="p-6 border-2 rounded-xl hover:border-blue-400 hover:bg-gray-50
                    transition-all duration-300 cursor-pointer
                    transform hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="text-center">
                    <div className="mb-3">
                      <svg className="w-12 h-12 mx-auto text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                    </div>
                    <p className="text-lg font-semibold text-gray-700">{category}</p>
                    <p className="text-sm text-gray-500">Upload {category} Files</p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            // File Upload Form
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(categories[selectedCategory]).map(([key, label]) => (
                  <div 
                    key={key}
                    className="relative group"
                    onDragEnter={(e) => handleDrag(e)}
                    onDragLeave={(e) => handleDrag(e)}
                    onDragOver={(e) => handleDrag(e)}
                    onDrop={(e) => handleDrop(e, key)}
                  >
                    <label 
                      className={`
                        relative block p-6 border-2 border-dashed rounded-xl 
                        ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'} 
                        ${files[key] ? 'bg-green-50 border-green-500' : 'hover:border-blue-400 hover:bg-gray-50'}
                        transition-all duration-300 cursor-pointer
                        transform hover:-translate-y-1 hover:shadow-lg
                      `}
                    >
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => handleFile(e.target.files[0], key)}
                        accept=".xlsx,.xls,.csv"
                      />
                      <div className="text-center">
                        <div className="mb-3">
                          {files[key] ? (
                            <svg className="w-8 h-8 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          ) : (
                            <svg className="w-8 h-8 mx-auto text-gray-400 group-hover:text-blue-500 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                          )}
                        </div>
                        <p className="text-sm font-semibold text-gray-700 mb-1">{label}</p>
                        <p className="text-xs text-gray-500">
                          {files[key] ? (
                            <span className="text-green-600 font-medium">{files[key].name}</span>
                          ) : (
                            'Drop file here or click to upload'
                          )}
                        </p>
                        <div className="mt-2">
                          <p className="text-xs text-amber-600">
                            ⚠️ Please ensure your file follows the required format.{' '}
                            <Link 
                              href={`/${formatInfoPages[key]}`}
                              target="_blank"
                              className="text-blue-600 hover:text-blue-800 underline"
                            >
                              View format
                            </Link>
                          </p>
                        </div>
                      </div>
                    </label>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setSelectedCategory(null)}
                  className="flex-1 py-2 px-4 rounded-lg border-2 border-gray-300
                    hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 
                    focus:ring-offset-2 transition-all duration-300 transform hover:-translate-y-0.5
                    text-base font-medium"
                >
                  Back to Categories
                </button>

                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-4 rounded-lg 
                    hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 
                    focus:ring-offset-2 transition-all duration-300 transform hover:-translate-y-0.5 
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
                    text-base font-medium shadow-lg hover:shadow-xl"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      Upload Files
                    </span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

