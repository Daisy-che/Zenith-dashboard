'use client';
import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { Home, BarChart2, LineChart, LogOut } from 'lucide-react';

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [showSignOutDropdown, setShowSignOutDropdown] = useState(false);

  const handleYesClick = () => {
    
    console.log("Signing out...");
     router.push('/login');
    setShowSignOutDropdown(false);
  };

  const SidebarItem = ({ icon, label, path }: { icon: React.ReactNode; label: string; path: string }) => {
    const isActive = pathname === path;
    return (
      <div
        onClick={() => router.push(path)}
        className={`flex items-center py-2 px-4 rounded cursor-pointer ${
          isActive ? 'bg-blue-600' : 'hover:bg-blue-500 transition-colors duration-200'
        }`}
      >
        {icon}
        <span className="ml-3 text-lg">{label}</span>
      </div>
    );
  };

  return (
    <div className="w-64 bg-[#008fff] text-white p-5 h-screen font-serif relative">
      <div className="flex items-center mb-8">
        <Image src="/logo.png" alt="AquaSense Logo" width={200} height={60} className="" />
      </div>
      <nav className="space-y-4">
        <SidebarItem icon={<Home size={24} />} label="Home" path="/dashboard" />
        <SidebarItem icon={<BarChart2 size={24} />} label="SystemPerformance" path="/systemperformance" />
        <SidebarItem icon={<LineChart size={24} />} label="Datamonitoring" path="/datamonitoring" />
      </nav>
      <div className="absolute bottom-5 left-0 w-full px-5">
        <div
          onClick={() => setShowSignOutDropdown(true)}
          className="flex items-center py-2 px-4 rounded cursor-pointer hover:bg-blue-500 transition-colors duration-200"
        >
          <LogOut size={24} />
          <span className="ml-3 text-lg">Sign Out</span>
        </div>
        {showSignOutDropdown && (
          <div className="absolute bottom-full left-0 w-full bg-white text-blue-500 rounded-t-md shadow-md text-sm mb-2">
            <p className="p-3 text-center">
              Are you sure you want to sign out?
            </p>
            <div className="flex justify-around p-3">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
                onClick={handleYesClick}
              >
                Yes
              </button>
              <button
                className="bg-gray-200 text-blue-500 px-4 py-2 rounded hover:bg-gray-300 text-sm"
                onClick={() => setShowSignOutDropdown(false)}
              >
                No
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;