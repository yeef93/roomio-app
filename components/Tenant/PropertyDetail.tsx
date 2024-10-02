"use client"
import { useEffect, useState } from "react";
import { Property } from "@/types/Property"; // Adjust based on where your types are
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

const PropertyDetail = () => {
  const router = useRouter();
  const pathname = usePathname(); // Get the current pathname
  const { data: session } = useSession();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const token = session?.user?.token || "";

  // Extract the property id from the pathname
  const id = pathname.split("/").pop(); // Assumes the id is the last part of the URL

  useEffect(() => {
    if (id) {
      const fetchProperty = async () => {
        try {
          const response = await fetch(`${apiUrl}/property/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!response.ok) {
            throw new Error("Failed to fetch property details.");
          }
          const data = await response.json();
          setProperty(data.data);
        } catch (err) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("An unknown error occurred");
          }
        } finally {
          setLoading(false);
        }
      };

      fetchProperty();
    }
  }, [id, token]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!property) return <div>Property not found</div>;

  return (
    <div className="bg-white p-4">
      <h2 className="text-2xl font-semibold mb-4">{property.name}</h2>
      <p>
        <strong>Location:</strong> {property.location || "N/A"}
      </p>
      <p>
        <strong>City:</strong> {property.city || "N/A"}
      </p>
      <p>
        <strong>Category:</strong> {property.category.name}
      </p>
      <p>
        <strong>Description:</strong> {property.description || "No description"}
      </p>      
    </div>
  );
};

export default PropertyDetail;