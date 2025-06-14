'use client';
import React, { useState } from 'react';
import { Calendar, Clock, FileText, GraduationCap } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('admin@lecturehub.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt:', { username, password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-purple-100 p-8">
          {/* Logo/Icon Section */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="bg-orange-400 rounded-lg p-3 relative">
                <Calendar className="w-8 h-8 text-white" />
                <div className="absolute -top-1 -right-1 bg-white rounded-full p-1">
                  <GraduationCap className="w-4 h-4 text-orange-400" />
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-slate-600 rounded-lg p-2">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <div className="absolute -bottom-1 right-4 bg-slate-600 rounded-lg p-1.5">
                <FileText className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-semibold text-center text-gray-800 mb-8">
            Login
          </h1>

          {/* Form */}
          <div className="space-y-6">
            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50"
                placeholder="admin@lecturehub.com"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50"
                placeholder="••••••••"
              />
            </div>

            {/* Login Button */}
            <button
              onClick={handleSubmit}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 outline-none"
            >
              Login
            </button>

            {/* Forgot Password Link */}
            <div className="text-center">
              <button
                onClick={() => console.log('Forgot password clicked')}
                className="text-blue-500 hover:text-blue-600 text-sm font-medium transition-colors duration-200 bg-transparent border-none cursor-pointer"
              >
                Forgot password?
              </button>
            </div>

            {/* Terms and Privacy */}
            <div className="text-center text-xs text-gray-500 leading-relaxed">
              By logging in, you agree to our{' '}
              <button
                onClick={() => console.log('Terms clicked')}
                className="text-blue-500 hover:text-blue-600 transition-colors duration-200 bg-transparent border-none cursor-pointer underline"
              >
                Terms of Service
              </button>{' '}
              and{' '}
              <button
                onClick={() => console.log('Privacy clicked')}
                className="text-blue-500 hover:text-blue-600 transition-colors duration-200 bg-transparent border-none cursor-pointer underline"
              >
                Privacy Policy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}