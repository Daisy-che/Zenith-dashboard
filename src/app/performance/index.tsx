import React from 'react';


interface Sensor {
  id: number;
  address: string;
  latitude: number;
  longitude: number;
  status: string;
}

interface SensorTableProps {
  sensorData: Sensor[];
}

const SensorTable: React.FC<SensorTableProps> = ({ sensorData }) => {
  const recentSensorData = sensorData
    .sort((a, b) => b.id - a.id) 
    .slice(0, 4); 

  return (
    <div className="w- ml-[-30%] p-2 mt-4 border border-black nesthubmax:mt-96 nesthubmax:w-96">
      <table className="w-full bg-white rounded-lg shadow h-6 nesthubmax:w-6">
        <thead>
          <tr className="font-serif">
            <th className="py-2 px-4 border-b text-left">Sensor ID</th>
            <th className="py-2 px-4 border-b text-left">Address</th>
            <th className="py-2 px-4 border-b text-left">Latitude</th>
            <th className="py-2 px-4 border-b text-left">Longitude</th>
            <th className="py-2 px-4 border-b text-left">Status</th>
          </tr>
        </thead>
        <tbody className="font-serif">
          {recentSensorData.map((sensor) => (
            <tr key={sensor.id} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b">{sensor.id}</td>
              <td className="py-2 px-4 border-b">{sensor.address}</td>
              <td className="py-2 px-4 border-b">{sensor.latitude}</td>
              <td className="py-2 px-4 border-b">{sensor.longitude}</td>
              <td className="py-2 px-4 border-b">{sensor.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SensorTable;
