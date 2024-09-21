import { useState, useEffect } from 'react';

interface Facility {
  id: number;
  name: string;
  icon: string | null;
}

export function useFacilities(propertyId: string) {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const response = await fetch(`${apiUrl}/property/${propertyId}/facilities`);
        if (!response.ok) {
          throw new Error('Failed to fetch facilities');
        }
        const data = await response.json();
        setFacilities(data.data);
        setLoading(false);
      } catch (err) {
        setError('An error occurred while fetching facilities');
        setLoading(false);
      }
    };

    fetchFacilities();
  }, [propertyId, apiUrl]);

  return { facilities, loading, error };
}