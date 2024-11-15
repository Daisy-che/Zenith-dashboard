
"use client"
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
import AquasenseDashboard from "../notifications/page";
import { FaBell } from 'react-icons/fa';

import { fetchDistance } from "../components/utils/thingspeak";
import Layout from "../components/Layout";
const SMS_LEOPARD_API_URL = "https://api.smsleopard.com/v1/sms/send";
const SMS_LEOPARD_ACCESS_TOKEN = process.env.NEXT_PUBLIC_API_LEOPARD_KEY;
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
        to: "+254748064111",
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
  const [averageDistance, setAverageDistance] = useState<number | null>(null);
  const [minDistance, setMinDistance] = useState<number | null>(null);
  const [maxDistance, setMaxDistance] = useState<number | null>(null);
  const [blockageCount, setBlockageCount] = useState(0);
  const [rateOfChange, setRateOfChange] = useState<number | null>(null);
  const [smsCount, setSmsCount] = useState(0);
  const [fetchSuccessCount, setFetchSuccessCount] = useState(0);
  const [fetchFailureCount, setFetchFailureCount] = useState(0);
  const [alertResponseTime, setAlertResponseTime] = useState<number | null>(null);
  const [blockageTimestamps, setBlockageTimestamps] = useState<number[]>([]);
  const smsThreshold = 20;
  useEffect(() => {
    const getData = async () => {
      try {
        await fetchDistance((distanceValue: string) => {
          setFetchSuccessCount((prev) => prev + 1);
          setDistance(distanceValue);
          const numericDistance = parseFloat(distanceValue);
          setData((prevData) => [
            ...prevData,
            { name: new Date().toLocaleTimeString(), distance: numericDistance },
          ]);
          // Average distance calculation
          const totalDistance = data.reduce((sum, point) => sum + point.distance, numericDistance);
          setAverageDistance(totalDistance / (data.length + 1));
          // Min and Max distance
          setMinDistance(Math.min(...data.map((d) => d.distance), numericDistance));
          setMaxDistance(Math.max(...data.map((d) => d.distance), numericDistance));
          // Rate of change
          if (data.length > 1) {
            const prevDistance = data[data.length - 1].distance;
            setRateOfChange(numericDistance - prevDistance);
          }
          // Blockage detection and blockage count
          if (numericDistance < smsThreshold) {
            setBlockageCount((prevCount) => prevCount + 1);
            setBlockageTimestamps((prevTimestamps) => [...prevTimestamps, Date.now()]);
           
            const startAlertTime = performance.now();
            sendSMS(`Alert: Distance is ${numericDistance} cm, below the threshold.`);
            const endAlertTime = performance.now();
            setAlertResponseTime(endAlertTime - startAlertTime);
           
            setSmsCount((prev) => prev + 1);
          }
        });
      } catch (error) {
        setFetchFailureCount((prev) => prev + 1);
      }
    };
    getData();
  }, [data]);
  const timeBetweenBlockages =
    blockageTimestamps.length > 1
      ? blockageTimestamps[blockageTimestamps.length - 1] -
        blockageTimestamps[blockageTimestamps.length - 2]
      : null;
  return (
    <Layout>
      <header className="flex justify-between items-center bg-gray-200">
     
            <div className="relative"></div>
            <div className="flex items-center">
               <AquasenseDashboard/> 
               <button>
              
                <svg
                  className="w-6 h-6 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                
                </svg>
              </button> 
            </div>
          </header>
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 text-black">
      <div className="grid grid-cols-2 gap-4 p-8 w-full max-w-4xl">
        <div className="text-center p-4 bg-white bg-opacity-10 backdrop-blur-lg rounded-lg shadow-lg">
          <h2 className="text-lg font-bold">Average Distance</h2>
          <p>{averageDistance !== null ? `${averageDistance.toFixed(2)} cm` : "N/A"}</p>
        </div>
        <div className="text-center p-4 bg-white bg-opacity-10 backdrop-blur-lg rounded-lg shadow-lg">
          <h2 className="text-lg font-bold">Blockage Count</h2>
          <p>{blockageCount}</p>
        </div>
        {/* <div className="text-center p-4 bg-white bg-opacity-10 backdrop-blur-lg rounded-lg shadow-lg">
          <h2 className="text-lg font-bold">Rate of Change</h2>
          <p>{rateOfChange !== null ? `${rateOfChange.toFixed(2)} cm/s` : "N/A"}</p>
        </div> */}
        {/* <div className="text-center p-4 bg-white bg-opacity-10 backdrop-blur-lg rounded-lg shadow-lg">
          <h2 className="text-lg font-bold">SMS Alerts Sent</h2>
          <p>{smsCount}</p>
        </div> */}
        <div className="text-center p-4 bg-white bg-opacity-10 backdrop-blur-lg rounded-lg shadow-lg">
          <h2 className="text-lg font-bold">Alert Response Time</h2>
          <p>
            {alertResponseTime !== null ? `${alertResponseTime.toFixed(2)} ms` : "N/A"}
          </p>
        </div>
        <div className="text-center p-4 bg-white bg-opacity-10 backdrop-blur-lg rounded-lg shadow-lg">
          <h2 className="text-lg font-bold">Time Between Blockages</h2>
          <p>{timeBetweenBlockages ? `${timeBetweenBlockages / 1000} s` : "N/A"}</p>
        </div>
      </div>
      {/* Graph Section */}
      <div className="text-center p-8 bg-white bg-opacity-10 backdrop-blur-lg rounded-lg shadow-lg mt-8">
  <h1 className="text-3xl font-bold mb-4">Drainage System Reading</h1>

  {/* Blockage alert message */}
  {distance && parseFloat(distance) < smsThreshold && (
    <div className="text-red-600 text-lg font-semibold mb-4">
      Blockage detected, SMS sent
    </div>
  )}

  <div className="text-xl mb-6">
    {distance ? (
      <p>
        <span className="font-semibold">Distance:</span> {distance} cm
      </p>
    ) : (
      <p>Waiting for data...</p>
    )}
  </div>
  <div className="w-full h-60"> {/* Increased height to h-96 */}
    <ResponsiveContainer width="102%" height="100%">
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

