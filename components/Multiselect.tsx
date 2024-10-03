import React, { useEffect, useState } from "react";

interface Facility {
  id: number;
  name: string;
}

interface MultiselectProps {
  selectedFacilities: number[];
  onChange: (facilityIds: number[]) => void;
}

const Multiselect: React.FC<MultiselectProps> = ({
  selectedFacilities,
  onChange,
}) => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchFacilities = async () => {
      const response = await fetch(`${apiUrl}/facility`);
      const data = await response.json();
      if (data.success) {
        setFacilities(data.data);
      }
    };

    fetchFacilities();
  }, []);

  const toggleFacility = (id: number) => {
    if (selectedFacilities.includes(id)) {
      onChange(selectedFacilities.filter((facilityId) => facilityId !== id));
    } else {
      onChange([...selectedFacilities, id]);
    }
  };

  const filteredFacilities = facilities.filter((facility) =>
    facility.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Facilities
      </label>
      <input
        type="text"
        placeholder="Search facilities..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
      />
      <div
        className="flex flex-wrap mt-2 max-h-40 overflow-y-auto border border-gray-300 rounded-md p-2"
        style={{ maxHeight: '100px' }} // You can adjust the height as needed
      >
        {filteredFacilities.map((facility) => (
          <button
            key={facility.id}
            type="button"
            onClick={() => toggleFacility(facility.id)}
            className={`mr-2 mb-2 px-4 py-2 rounded-lg ${
              selectedFacilities.includes(facility.id)
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {facility.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Multiselect;
