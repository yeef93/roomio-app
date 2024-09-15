// hooks/useProperties.ts
import { useState, useEffect } from 'react';
import { Property } from '@/types/Property';

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    async function fetchProperties() {
      try {
        const response = await fetch(`${apiUrl}/property?sortBy=id&direction=asc&size=5`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch properties');
        }

        // Process properties to find the minimum actualPrice
        const propertiesWithPrice = data.data.map((property: any) => {
          // Find the minimum actualPrice from rooms
          const minPrice = property.rooms.reduce((min: number, room: any) => 
            room.isActive ? Math.min(min, room.actualPrice) : min, Infinity);

          return {
            ...property,
            images: property.images.map((image: { imageUrl: string }, index: number) => ({
              id: index + 1, // Generate a unique id, or use a more robust method
              imageUrl: image.imageUrl
            })),
            price: minPrice === Infinity ? 0 : minPrice // Set price to 0 if no active rooms
          };
        });

        setProperties(propertiesWithPrice);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, [apiUrl]);

  return { properties, loading, error };
}
