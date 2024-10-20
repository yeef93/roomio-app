import React, { useState, useEffect } from "react";

interface FilterProps {
  onFilterChange: (filters: any) => void;
  onResetFilters: () => void;
  initialFilters?: any; // Add initialFilters to the props
}

export default function PropertyFilter({
  onFilterChange,
  onResetFilters,
  initialFilters = {}, // Default to empty object if no initial filters provided
}: FilterProps) {
  // Function to get today's date in 'YYYY-MM-DD' format
  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // Convert to 'YYYY-MM-DD'
  };

  // Function to get next date (1 day after checkIn)
  const getNextDate = (startDate: string) => {
    const date = new Date(startDate || getCurrentDate());
    date.setDate(date.getDate() + 1); // Add one day to checkIn date
    return date.toISOString().split("T")[0];
  };

  // State for storing all filter values
  const [filters, setFilters] = useState({
    search: initialFilters.search || "",
    city: initialFilters.city || "",
    guests: initialFilters.guests || "",
    minPrice: initialFilters.minPrice || "",
    maxPrice: initialFilters.maxPrice || "",
    checkIn: initialFilters.checkIn || getCurrentDate(),
    checkOut: initialFilters.checkOut || getNextDate(initialFilters.checkIn || getCurrentDate()),
    category: initialFilters.category || "",
  });

  // Update filters if initialFilters change (e.g., on page reload)
  useEffect(() => {
    setFilters({
      search: initialFilters.search || "",
      city: initialFilters.city || "",
      guests: initialFilters.guests || "",
      minPrice: initialFilters.minPrice || "",
      maxPrice: initialFilters.maxPrice || "",
      checkIn: initialFilters.checkIn || getCurrentDate(),
      checkOut: initialFilters.checkOut || getNextDate(initialFilters.checkIn || getCurrentDate()),
      category: initialFilters.category || "",
    });
  }, [initialFilters]);

  // State for storing city list, initialized as an empty array
  const [cities, setCities] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Fetch cities on component mount
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch(`${apiUrl}/property/cities`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setCities(data.data); // Adjust this based on your API response structure
      } catch (error) {
        console.error("Failed to fetch cities:", error);
        setError("Failed to load cities. Please try again later."); // Set error message
      }
    };

    fetchCities();
  }, [apiUrl]);

  // Handle input changes and dynamically update checkOut when checkIn changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "checkIn" && { checkOut: getNextDate(value) }), // Adjust checkOut if checkIn changes
    }));
    onFilterChange({ ...filters, [name]: value });
  };

  // Handle reset button click
  const handleResetFilters = () => {
    const defaultFilters = {
      search: "",
      city: "",
      guests: "",
      minPrice: "",
      maxPrice: "",
      checkIn: getCurrentDate(),
      checkOut: getNextDate(getCurrentDate()),
      category: "",
    };
    setFilters(defaultFilters);
    onResetFilters();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Filters</h2>
        <button
          onClick={handleResetFilters}
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          Reset Filters
        </button>
      </div>
      <input
        type="text"
        placeholder="Search properties..."
        className="w-full p-2 mb-4 border rounded-md"
        name="search"
        value={filters.search}
        onChange={handleInputChange}
      />
      <h3 className="font-semibold mb-2">Location</h3>
      <select
        name="city"
        value={filters.city}
        onChange={handleInputChange}
        className="w-full p-2 mb-4 border rounded-md"
      >
        <option value="">Select City</option>
        {cities && cities.length > 0 ? (
          cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))
        ) : (
          <option disabled>No cities available</option>
        )}
      </select>
      {error && <p className="text-red-500 mb-4">{error}</p>}{" "}
      {/* Display error message if any */}
      <h3 className="font-semibold mb-2">Guests</h3>
      <input
        type="number"
        placeholder="Number of guests"
        className="w-full p-2 mb-4 border rounded-md"
        name="guests"
        value={filters.guests}
        onChange={handleInputChange}
      />
      <h3 className="font-semibold mb-2">Budget</h3>
      <div className="flex gap-2 mb-4">
        <input
          type="number"
          placeholder="Min Price"
          className="w-1/2 p-2 border rounded-md"
          name="minPrice"
          value={filters.minPrice}
          onChange={handleInputChange}
        />
        <input
          type="number"
          placeholder="Max Price"
          className="w-1/2 p-2 border rounded-md"
          name="maxPrice"
          value={filters.maxPrice}
          onChange={handleInputChange}
        />
      </div>
      <h3 className="font-semibold mb-2">Dates</h3>
      <div className="mb-4">
        <input
          type="date"
          className="w-full p-2 mb-2 border rounded-md"
          name="checkIn"
          value={filters.checkIn}
          onChange={handleInputChange}
          min={getCurrentDate()} // Prevent choosing past dates for check-in
        />
        <input
          type="date"
          className="w-full p-2 border rounded-md"
          name="checkOut"
          value={filters.checkOut}
          onChange={handleInputChange}
          min={filters.checkIn} // Prevent check-out from being earlier than check-in
        />
      </div>
    </div>
  );
}
