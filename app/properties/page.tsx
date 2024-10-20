"use client";

import React, { useState, useEffect } from "react";
import PropertyCard from "@/components/PropertyCard";
import PropertyCardSkeleton from "@/components/Skeleton/PropertyCardSkeleton";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyFilter from "@/components/Property/PropertyFilter";
import { useSearchParams } from "next/navigation";

interface Property {
  id: number;
  name: string;
  images: { id: number; imageUrl: string }[];
  location: string;
  city: string;
  category: { name: string; imageUrl: string };
  tenant: {
    id: number;
    email: string;
    firstname: string;
    lastname: string;
    avatar: string;
  };
  rooms: {
    id: number;
    basePrice: number;
    capacity: number;
  }[];
}

interface ApiResponse {
  statusCode: number;
  success: boolean;
  statusMessage: string;
  data: {
    totalItems: number;
    totalPages: number;
    pageSize: number;
    currentPage: number;
    properties: Property[];
  };
}

export default function Properties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({});
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const searchParams = useSearchParams();

  // Function to fetch properties from API
  const fetchProperties = async (page: number, filterQuery: any = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${apiUrl}/property?page=${page - 1}`);
      if (!response.ok) {
        throw new Error("Failed to fetch properties");
      }
      const data: ApiResponse = await response.json();
      const newProperties = [...properties, ...data.data.properties];
      setProperties(newProperties);
      setFilteredProperties(
        applyFilters(newProperties, filterQuery || filters)
      );
      setTotalPages(data.data.totalPages);
    } catch (err) {
      setError("An error occurred while fetching properties");
    } finally {
      setIsLoading(false);
    }
  };

  // Apply filters based on query parameters on page load
  useEffect(() => {
    const filterFromQuery = extractFiltersFromQuery(searchParams);
    setFilters(filterFromQuery);
    fetchProperties(currentPage, filterFromQuery);
  }, [searchParams]);

  // Function to extract filters from URL query parameters
  const extractFiltersFromQuery = (searchParams: any) => {
    const extractedFilters: any = {};
    if (searchParams.get("city"))
      extractedFilters.city = searchParams.get("city");
    if (searchParams.get("guests"))
      extractedFilters.guests = searchParams.get("guests");
    if (searchParams.get("minPrice"))
      extractedFilters.minPrice = searchParams.get("minPrice");
    if (searchParams.get("maxPrice"))
      extractedFilters.maxPrice = searchParams.get("maxPrice");
    if (searchParams.get("category"))
      extractedFilters.category = searchParams.get("category");
    return extractedFilters;
  };

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
      fetchProperties(currentPage + 1);
    }
  };

  const handleFilterChange = (newFilters: any) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    setFilteredProperties(applyFilters(properties, updatedFilters));
  };

  const handleResetFilters = () => {
    setFilters({});
    setFilteredProperties(properties);
  };

  const applyFilters = (props: Property[], currentFilters: any) => {
    return props.filter((property) => {
      if (
        currentFilters.search &&
        !property.name
          .toLowerCase()
          .includes(currentFilters.search.toLowerCase())
      ) {
        return false;
      }
      if (currentFilters.city && property.city !== currentFilters.city) {
        return false;
      }
      if (
        currentFilters.guests &&
        !property.rooms.some(
          (room) => room.capacity >= parseInt(currentFilters.guests)
        )
      ) {
        return false;
      }
      if (
        currentFilters.minPrice &&
        !property.rooms.some(
          (room) => room.basePrice >= parseInt(currentFilters.minPrice)
        )
      ) {
        return false;
      }
      if (
        currentFilters.maxPrice &&
        !property.rooms.some(
          (room) => room.basePrice <= parseInt(currentFilters.maxPrice)
        )
      ) {
        return false;
      }
      if (
        currentFilters.category &&
        property.category.name !== currentFilters.category
      ) {
        return false;
      }
      return true;
    });
  };

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-28">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/4">
            <PropertyFilter
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
              initialFilters={filters} // Pass initial filters to PropertyFilter
            />
          </div>
          <div className="md:w-3/4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {filteredProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  id={property.id}
                  images={property.images}
                  name={property.name}
                  location={property.location}
                  city={property.city}
                  category={property.category}
                  tenant={property.tenant}
                  price={property.rooms[0]?.basePrice || 0}
                  checkin=""
                  checkout=""
                  room={1}
                  adult={1}
                />
              ))}
              {isLoading && (
                <>
                  {Array.from({ length: 6 }).map((_, index) => (
                    <PropertyCardSkeleton key={index} />
                  ))}
                </>
              )}
            </div>
            {error && (
              <div className="text-center py-4 text-red-500">{error}</div>
            )}
            {currentPage < totalPages && filteredProperties.length > 0 && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Loading..." : "Load More"}
                </button>
              </div>
            )}
            {filteredProperties.length === 0 && !isLoading && (
              <div className="text-center py-4">
                No properties found matching your criteria.
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
