import React from 'react';
import { 
  Upload, 
  Calendar, 
  Clock, 
  User, 
  Settings, 
  HelpCircle, 
  LogOut,
  GraduationCap,
  ChevronRight
} from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      {/* Header with Logo */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-purple-500 rounded flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center">
            <Clock className="w-4 h-4 text-gray-600" />
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 p-4">
        <div className="space-y-2">
          {/* File Upload - Active State */}
          <div className="bg-purple-500 text-white rounded-lg p-3 flex items-center justify-between cursor-pointer hover:bg-purple-600 transition-colors">
            <div className="flex items-center space-x-3">
              <Upload className="w-5 h-5" />
              <span className="font-medium">File Upload</span>
            </div>
            <ChevronRight className="w-4 h-4" />
          </div>

          {/* Lecture Schedule */}
          <div className="text-gray-600 rounded-lg p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5" />
              <span className="font-medium">Lecture Schedule</span>
            </div>
            <ChevronRight className="w-4 h-4" />
          </div>

          {/* Section Schedule */}
          <div className="text-gray-600 rounded-lg p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5" />
              <span className="font-medium">Section Schedule</span>
            </div>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="p-4 border-t border-gray-100">
        <div className="space-y-2">
          {/* Profile */}
          <div className="text-gray-600 rounded-lg p-3 flex items-center space-x-3 cursor-pointer hover:bg-gray-50 transition-colors">
            <User className="w-5 h-5" />
            <span className="font-medium">Profile</span>
          </div>

          {/* Settings */}
          <div className="text-gray-600 rounded-lg p-3 flex items-center space-x-3 cursor-pointer hover:bg-gray-50 transition-colors">
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </div>

          {/* Help */}
          <div className="text-gray-600 rounded-lg p-3 flex items-center space-x-3 cursor-pointer hover:bg-gray-50 transition-colors">
            <HelpCircle className="w-5 h-5" />
            <span className="font-medium">Help</span>
          </div>

          {/* Logout */}
          <div className="text-red-500 rounded-lg p-3 flex items-center space-x-3 cursor-pointer hover:bg-red-50 transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;