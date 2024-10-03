export const fetchSensorData = async () => {
    const BASE_URL = 'https://aquasense-e472a26d7581.herokuapp.com';
    try {
      const response = await fetch(`${BASE_URL}/api/devices/`); 
      if (!response.ok) throw new Error('Failed to fetch sensor data');
      return await response.json();
    } catch (error) {
      console.error('Error fetching sensor data:', error);
      return [];
    }
  };