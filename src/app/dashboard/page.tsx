
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
          <ResponsiveContainer width="100%" height="120%">
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












