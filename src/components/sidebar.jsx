"use client";
import React, { useState, useEffect } from "react";
import {
  Upload,
  Calendar,
  Clock,
  User,
  Settings,
  HelpCircle,
  LogOut,
  GraduationCap,
  ChevronRight,
  User2Icon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { jwtDecode } from "jwt-decode";

// sidebar links with roles who can access them
const sidebarLinks = [
  {
    label: "File Upload",
    icon: Upload,
    href: "/new-home",
    key: "file-upload",
    roles: ["admin"],
  },
  {
    label: "Lecture Schedule",
    icon: Calendar,
    href: "/lecture-schedule",
    key: "lecture-schedule",
    roles: ["user", "admin"],
  },
  {
    label: "Section Schedule",
    icon: Calendar,
    href: "/section-schedule",
    key: "section-schedule",
    roles: ["user", "admin"],
  },
  {
    label: "Admin Management",
    icon: User2Icon,
    href: "/admin-management",
    key: "admin-management",
    roles: ["admin"],
  },
];

const Sidebar = ({ activeLink }) => {
  const pathname = usePathname();
  const [userRoles, setUserRoles] = useState([]);

  // get user roles from token
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          let roles = [];
          if (decoded.role === "admin") {
            roles = ["admin", "user"]; // admin can see everything user can
          } else if (decoded.role === "user") {
            roles = ["user"];
          }
          setUserRoles(roles);
        } catch (e) {
          setUserRoles([]);
        }
      } else {
        setUserRoles([]);
      }
    }
  }, []);

  // filter links based on user roles
  const filteredLinks = sidebarLinks.filter((link) =>
    link.roles.some((role) => userRoles.includes(role))
  );

  // Utility to check if link is active
  const isActive = (href) => pathname === href;

  // logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/new-login";
  };

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
          {filteredLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link href={link.href} key={link.key} className="block">
                <div
                  className={`rounded-lg p-3 flex items-center justify-between cursor-pointer transition-colors
                    ${
                      active
                        ? "bg-purple-600 text-white"
                        : "text-gray-600 hover:bg-gray-50"
                    }
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{link.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </Link>
            );
          })}
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
          <div
            onClick={handleLogout}
            className="text-red-500 rounded-lg p-3 flex items-center space-x-3 cursor-pointer hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <button className="font-medium">Logout</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
