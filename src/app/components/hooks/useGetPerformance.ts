'use client';
import { useState, useEffect } from 'react';

export const useGetPerformance = () => {
    const [performanceData, setPerformanceData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL;

                if (!apiUrl) {
                    throw new Error("API URL is not defined");
                }

                const response = await fetch(apiUrl);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log('Fetched data:', data);

                setPerformanceData(data);
            } catch (err) {
                console.error('Fetching data error:', err);

        
                if (err instanceof Error) {
                    setError(`Error fetching data: ${err.message}`);
                } else {
                    setError('An unknown error occurred');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { performanceData, loading, error };
};
