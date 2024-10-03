"use client";

import React, { useState } from "react";
import { Bell } from "lucide-react";

import { useNotifications } from "../components/hooks/useGetNotifications";

import Layout from "../components/Layout";

interface Notification {
  id: string | number;
  message: string;
  created_at: string;
}

interface NotificationCardProps {
  message: string;
  created_at: string;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  message,
  created_at,
}) => (
  <div className="bg-gray-50 p-4 rounded-lg shadow flex justify-between items-center">
    <p className="text-gray-800">{message}</p>
    <p className="text-sm text-gray-500">
      {new Date(created_at).toLocaleString()}
    </p>
  </div>
);

const AquasenseDashboard: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const notifications = useNotifications();

  return (
    <Layout>
      <div id="Settings" className="min-h-screen bg-gray-100 p-10">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold flex items-center">
              <Bell className="mr-2" /> Notifications
            </h2>
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={isEnabled}
                  onChange={() => setIsEnabled(!isEnabled)}
                />
                <div
                  className={`block w-14 h-8 rounded-full ${
                    isEnabled ? "bg-green-400" : "bg-gray-300"
                  }`}
                ></div>
                <div
                  className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${
                    isEnabled ? "transform translate-x-6" : ""
                  }`}
                ></div>
              </div>
            </label>
          </div>
          {isEnabled ? (
            <div className="space-y-4">
              {notifications.map((notification: Notification) => (
                <NotificationCard
                  key={notification.id}
                  message={notification.message}
                  created_at={notification.created_at}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center">
              Notifications are currently disabled.
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AquasenseDashboard;
