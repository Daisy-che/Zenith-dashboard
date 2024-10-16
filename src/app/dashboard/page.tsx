
// "use client";

// import React, { useEffect } from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import { useRouter } from "next/navigation";
// import { getCookie } from "cookies-next";

// import Layout from "../components/Layout";
// import { useDrainageData } from "../components/hooks/useData";
// import AquasenseDashboard from "../notifications/page";


// const Dashboard: React.FC = () => {
//   const router = useRouter();
//   const { data, loading, error } = useDrainageData();

//   useEffect(() => {
//     const isLoggedIn = getCookie("isLoggedIn");
//     if (!isLoggedIn) {
//       router.push("/dashboard");
//     }
//   }, [router]);

//   const processLineChartData = (data: any[]) => {
//     return data.map((item: any) => ({
//       name: new Date(item.timestamp).toLocaleDateString(),
//       waterLevel: item.water_level,
//       waterPressure: item.water_pressure,
//     }));
//   };

//   if (loading)
//     return (
//       <div className="flex justify-center items-center h-screen">
//         Loading...
//       </div>
//     );
//   if (error)
//     return (
//       <div className="flex justify-center items-center h-screen text-red-500">
//         {error}
//       </div>
//     );

//   const lineChartData = processLineChartData(data);
//   return (
//     <Layout>
//       <div className="flex bg-white overflow-hidden">
//         <div className="flex-1 ml-[20%]">
//           <header className="flex justify-between items-center">
//             <div className="relative"></div>
//             <div className="flex items-center">
//               <AquasenseDashboard/>
//               <button>
//                 <svg
//                   className="w-6 h-6 text-blue-500"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   {/* <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//                   /> */}
//                 </svg>
//               </button>
//             </div>
//           </header>
//           <main>
//             <h3 className="text-3xl font-semibold text-center text-blue-500 items-center ml-[-390px] mb-12">
//               Overview
//             </h3>
//             <h2 className="text-xl font-semibold text-center items-center ml-[-360px]">
//               Water level and Water Pressure rate in the drainage system
//             </h2>
//             <div className="grid grid-cols-2">
//               <div className="mt-20 ml-[-260px]">
//                 <div className="flex justify-center items-center space-x-16 mb-8">
//                   <div className="flex items-center ml-96">
//                     <div className="w-8 h-7 bg-emerald-400 mr-2"></div>
//                     <span className="text-gray-700 font-medium">
//                       Water level
//                     </span>
//                   </div>
//                   <div className="flex items-center">
//                     <div className="w-8 h-7 bg-blue-500 mr-2"></div>
//                     <div className="text-gray-700 font-medium">
//                       Water Pressure
//                     </div>
//                   </div>
//                 </div>

//                 <div className="ml-40">
//                   <ResponsiveContainer width="140%" height={400}>
//                     <LineChart data={lineChartData}>
//                       <CartesianGrid strokeDasharray="3 3" />
//                       <XAxis dataKey="name" />
//                       <YAxis />
//                       <Tooltip />
//                       <Legend />
//                       <Line
//                         type="monotone"
//                         dataKey="waterLevel"
//                         stroke="#3B82F6"
//                       />
//                       <Line
//                         type="monotone"
//                         dataKey="waterPressure"
//                         stroke="#10B981"
//                       />
//                     </LineChart>
//                   </ResponsiveContainer>
//                 </div>
//               </div>
//             </div>
//           </main>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default Dashboard;
"use client";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { fetchDistance } from "../components/utils/thingspeak";
import Layout from "../components/Layout";

const SMS_LEOPARD_API_URL = "https://api.smsleopard.com/v1/sms/send";
const SMS_LEOPARD_ACCESS_TOKEN =
  "alA4aXRHVHc2OG9QUGF2a0dxYVc6M01pSldhYUhDMlF2eVdnNHdYZnpNUjMzQzZZeFNNTVUyQmN4aEhuYg==";
interface DataPoint {
  name: string;
  distance: number;
}
const sendSMS = async (message: string) => {
  try {
    const response = await fetch(SMS_LEOPARD_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SMS_LEOPARD_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        to: "+254748064111", // Replace with the actual phone number
        message: message,
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to send SMS. Status: " + response.status);
    }
    console.log("SMS sent successfully");
  } catch (error) {
    console.error("Error sending SMS:", error);
  }
};
const WebSocketAPIExample = () => {
  const [distance, setDistance] = useState<string | null>(null);
  const [data, setData] = useState<DataPoint[]>([]);
  const [blockageDetected, setBlockageDetected] = useState<boolean>(false);
  const threshold = 10; // 10 cm threshold
  const smsThreshold = 10; // 10 cm threshold for SMS alert
  useEffect(() => {
    const getData = async () => {
      await fetchDistance((distanceValue: string) => {
        setDistance(distanceValue);
        const numericDistance = parseFloat(distanceValue);
        // Check if the distance is below the threshold
        if (numericDistance < threshold) {
          setBlockageDetected(true);
        } else {
          setBlockageDetected(false);
        }
        // Send SMS if distance is below 10cm
        if (numericDistance < smsThreshold) {
          sendSMS(
            `Alert: Distance is ${numericDistance}cm, below the 10cm threshold.`
          );
        }
        setData((prevData) => [
          ...prevData,
          {
            name: new Date().toLocaleTimeString(),
            distance: numericDistance,
          },
        ]);
      });
    };
    getData();
  }, []);
  return (
    <Layout>
    <div className="flex items-center justify-center min-h-screen text-black">
      <div className="text-center p-8 bg-white bg-opacity-10 backdrop-blur-lg rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4">Drainage-system Reading</h1>
        <div className="text-xl mb-6">
          {distance ? (
            <>
              <p>
                <span className="font-semibold">Distance:</span> {distance} cm
              </p>
              {blockageDetected && (
                <p className="text-red-500 font-bold">
                  Blockage detected! Distance is below {threshold} cm.
                </p>
              )}
              {parseFloat(distance) < smsThreshold && (
                <p className="text-yellow-500 font-bold">
                  SMS alert sent! Distance is below {smsThreshold} cm.
                </p>
              )}
            </>
          ) : (
            <p>Waiting for data...</p>
          )}
        </div>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="distance" stroke="#82CA9D" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
    </Layout>
  );
};
export default WebSocketAPIExample;












