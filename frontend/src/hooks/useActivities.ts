import { useEffect, useState } from 'react';

export interface Activity {
  id: string;
  name: string;
}

export const useActivities = () => {
  // Default mock activities
  const mockActivities: Activity[] = [
    { id: '1', name: 'Cafe' },
    { id: '2', name: 'Restaurant' },
    { id: '3', name: 'Cinema' },
    { id: '4', name: 'Shopping Mall' },
    { id: '5', name: 'Park' },
    { id: '6', name: 'Karaoke' },
    { id: '7', name: 'Gym' },
    { id: '8', name: 'Beach' },
    { id: '9', name: 'Hiking Trail' },
    { id: '10', name: 'Art Gallery' },
  ];

  const [activities, setActivities] = useState<Activity[]>(mockActivities);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

        const response = await fetch(`${baseUrl}/v1/activity/activity`, {
          credentials: 'include',
        });

        if (!response.ok) {
          console.warn(`API returned status ${response.status}, using mock data`);
          setActivities(mockActivities);
          setError(null);
          setLoading(false);
          return;
        }

        const data = await response.json();
        
        // If data is empty or not an array, use mock data
        if (!Array.isArray(data) || data.length === 0) {
          console.warn('API returned empty data, using mock data');
          setActivities(mockActivities);
        } else {
          // Map API response to Activity interface
          const mappedActivities = data.map((item: any) => ({
            id: item.id || item.activity_id,
            name: item.name || item.activity_name,
          }));
          setActivities(mappedActivities);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching activities:', err);
        setError('Failed to load activities');
        // Use mock data as fallback
        setActivities(mockActivities);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  return { activities, loading, error };
};
