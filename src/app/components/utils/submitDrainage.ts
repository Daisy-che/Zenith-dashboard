const url = '/api/datamonitoring/';
export const submitDrainageData = async (payload: any) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`Failed to submit data: ${response.status} - ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error('Error in submitting drainage data:', error.message);
      throw error;
    }
  };