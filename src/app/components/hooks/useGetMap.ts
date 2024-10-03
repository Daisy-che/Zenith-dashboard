import { useState, useEffect } from "react";
import { fetchSensorData } from "../utils/utils";

export const useSensorData = () => {
  const [sensorData, setSensorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); 

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchSensorData();
        setSensorData(data);
      } catch (err) {
        
        if (err instanceof Error) {
          setError(err.message); 
        } else {
          setError("An unknown error occurred"); 
        }
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  return { sensorData, loading, error };
};
