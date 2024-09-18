import { useState, useEffect } from 'react';

interface Room {
    id: number;
    name: string;
    description: string;
    capacity: number;
    size: number;
    bedType: string;
    totalBed: number;
    qty: number;
    basePrice: number;
    totalBathroom: number;
    isActive: boolean;
    currentPrice: number | null;
    actualPrice: number;
  }

  
interface PropertyDetails {
    id: number;
    name: string;
    description: string;
    location: string;
    city: string;
    category: string;
    tenant: {
      id: number;
      email: string;
      firstname: string;
      lastname: string;
      avatar: string;
      createdAt: string;
    };
    images: { id: number; imageUrl: string }[];
    rooms: Room[];
  }

export const usePropertyDetails = (id: string | undefined, apiUrl: string | undefined) => {
  const [property, setProperty] = useState<PropertyDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      if (!id || !apiUrl) return;
      
      try {
        const response = await fetch(`${apiUrl}/property/${id}`);
        const data = await response.json();
        if (data.success) {
          setProperty(data.data);
        } else {
          console.error('API returned unsuccessful response:', data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching property details:', error);
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [id, apiUrl]);

  return { property, loading };
};
