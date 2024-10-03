import { useEffect, useState } from "react";
import { processDrainageData } from "../utils/drainage";
export const useDrainageData = () => {
  const [data, setData] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const processedData = await processDrainageData();
        setData(processedData);
      } catch (error: any) {
        setError(`Error fetching data: ${error.message}`);
        console.error("Error fetching data:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { data, loading, error };
};
