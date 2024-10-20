import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import DestinationCard from "./DestinationCard";

const destinations = [
  { title: "Jakarta", imageUrl: "/assets/images/jakarta.jpg", city: "jakarta" },
  { title: "Bali", imageUrl: "/assets/images/bali.jpg", city: "bali" },
  { title: "Bandung", imageUrl: "/assets/images/bandung.jpg", city: "bandung" },
  { title: "Surabaya", imageUrl: "/assets/images/surabaya.jpg", city: "surabaya" },
  { title: "Semarang", imageUrl: "/assets/images/semarang.jpg", city: "semarang" },
  { title: "Yogyakarta", imageUrl: "/assets/images/yogyakarta.jpg", city: "yogyakarta" },
];

const fetchTotalProperties = async (city: string) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  try {
    const response = await fetch(`${apiUrl}/property?city=${city}`);
    const data = await response.json();
    if (data && data.data && data.data.totalItems) {
      return data.data.totalItems;
    }
  } catch (error) {
    console.error(`Failed to fetch data for ${city}:`, error);
  }
  return 0;
};

function DestinationsGrid() {
  const [destinationsData, setDestinationsData] = useState(
    destinations.map((destination) => ({
      ...destination,
      accommodations: "...", // Initially set accommodations to "..."
    }))
  );

  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    const fetchAccommodations = async () => {
      const updatedDestinations = await Promise.all(
        destinations.map(async (destination) => {
          const totalItems = await fetchTotalProperties(destination.city);
          return { ...destination, accommodations: totalItems };
        })
      );
      setDestinationsData(updatedDestinations);
    };

    fetchAccommodations();
  }, []);

  // Handler for redirecting with selected city filter
  const handleDestinationClick = (city: string) => {
    router.push(`/properties?city=${city}`); // Navigate to the properties page with city query
  };

  return (
    <section className="py-10">
      <h2 className="text-3xl font-bold text-center mb-8 text-slate-800">
        Top destinations in Indonesia
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {destinationsData.map((destination, index) => (
          <DestinationCard
            key={index}
            title={destination.title}
            accommodations={destination.accommodations}
            imageUrl={destination.imageUrl}
            onClick={() => handleDestinationClick(destination.city)} // Pass city on click
          />
        ))}
      </div>
    </section>
  );
}

export default DestinationsGrid;