const url = '/api/data-monitoring/';

export const processDrainageData = async () => {
  try {
    const response = await fetch(url, {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} - ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('Error in fetching drainage systems:', error.message);
    throw error;
  }
};
