"use client";
import { useEffect, useState } from "react";
import { Property } from "@/types/Property";
import { PlusIcon } from "@heroicons/react/16/solid";
import router from "next/router";
import { usePathname } from "next/navigation";

function Properties() {
  // Use the Property type for the state
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const pathname = usePathname();

  useEffect(() => {
    // Fetch data from the API
    async function fetchProperties() {
      try {
        const response = await fetch(
          `${apiUrl}/property?search=&sortBy=id&direction=asc&size=5`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();

        // Assuming the response has a `data` property which is an array of Property
        setProperties(data.data as Property[]); // Type assertion to Property[]
      } catch (err) {
        setError("Failed to fetch properties");
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const handleCreate = () => {
    router.push(`${pathname}/create-event`);
    console.log("Create a new event");
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Properties</h2>
        <button
          onClick={handleCreate}
          className="flex items-center px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
        >
          <PlusIcon className="mr-2 w-5 h-5" />
          Create
        </button>
      </div>

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Location
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              City
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {properties.map((property) => (
            <tr key={property.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {property.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {property.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {property.location || "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {property.city || "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {property.category.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${property.price}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Properties;
