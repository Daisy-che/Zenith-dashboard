
import { PerformanceData } from "./types";


export const fetchPerformance = async (): Promise<PerformanceData[]> => {
  try {
      const response = await fetch('/api/systemperformance', {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          },
      });

      if (!response.ok) {
          throw new Error(`Failed to fetch performance data.`);
      }

      const data = await response.json() as PerformanceData[];
      console.log('Fetched performance data:', data);

    
      const performanceMetrics = data.map(item => ({
          id: item.id,
          system_performance: item.system_performance, 
          date_of_record: item.date_of_record,
          status: item.status,
        
    }));

      return performanceMetrics; 
  } catch (error: any) {
      console.error('Error fetching performance data:', error.message || error);
      throw error;
  }
};
