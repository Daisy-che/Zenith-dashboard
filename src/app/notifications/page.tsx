
'use client';
import React, { useState } from "react";
import { Bell } from "lucide-react";
import { useNotifications } from "../components/hooks/useGetNotifications";

interface Notification {
  id: string | number;
  message: string;
  created_at: string;
}

const AquasenseDashboard: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const notifications = useNotifications();

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="mr-10 focus:outline-none"
      >
        <Bell className="w-6 h-6 text-blue-500" />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-20">
          <div className="py-2">
            {notifications.length > 0 ? (
              notifications.map((notification: Notification) => (
                <div key={notification.id} className="px-4 py-2 hover:bg-gray-100">
                  <p className="text-sm text-gray-800">{notification.message}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(notification.created_at).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="px-4 py-2 text-sm text-gray-500">No notifications</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AquasenseDashboard;