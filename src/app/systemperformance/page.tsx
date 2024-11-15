"use client";

import { useSensorData } from "../components/hooks/useGetMap";
import Layout from "../components/Layout";
import Map from "../components/map";
import SensorTable from "../performance";
const HomePage = () => {
  const { sensorData, loading, error } = useSensorData();
  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-600">Error: {error}</p>;
  return (
    <Layout>
      <div className="flex h-screen mb-6">
        <div className="w-full  text-white flex flex-col "></div>
        <div className=" p-10">
          <Map sensorData={sensorData} />

          <div>
            {/* <SensorTable sensorData={sensorData} /> */}
          </div>
        </div>
      </div>
     </Layout>
  );
};
export default HomePage;
