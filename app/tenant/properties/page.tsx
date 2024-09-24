"use client";
import { useEffect, useState } from "react";
import { Property } from "@/types/Property";
import { PlusIcon } from "@heroicons/react/16/solid";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import useUserData from "@/hooks/useUserData";
import { useSession } from "next-auth/react";
import Pagination from "@/components/Pagination";

function Properties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const token = session?.user?.token || ""; // Fallback to empty string if no token
  const { userData, loading: userLoading } = useUserData();
  const id = userData?.id;

  const pageSize = 10; // Number of items per page

  useEffect(() => {
    if (!userLoading && id) {
      const fetchProperties = async () => {
        try {
          setLoading(true); // Reset loading state on page change
          const response = await fetch(
            `${apiUrl}/property?search=&sortBy=id&direction=asc&tenantId=${id}&page=${
              currentPage - 1 // Zero-indexed page for the API
            }&pageSize=${pageSize}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          setProperties(data.data.properties as Property[]);
          setTotalPages(data.data.totalPages);
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

      fetchProperties();
    }
  }, [id, userLoading, currentPage]); // Add currentPage to the dependency array

  const handleCreate = () => {
    router.push("/tenant/properties/create-property");
  };

  const handlePageChange = (page: number) => {
    // Ensure the page is valid and update the state to trigger useEffect
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="bg-white border rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl tracking-widest font-semibold">Properties</h2>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                  </td>
                </tr>
              ))
            ) : error ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-red-500">{error}</td>
              </tr>
            ) : properties.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">No data available</td>
              </tr>
            ) : (
              properties.map((property) => (
                <tr key={property.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{property.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{property.location || "N/A"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{property.city || "N/A"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{property.category.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-red-500 hover:underline ml-4">Detail</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

      {!loading && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}

export default Properties;