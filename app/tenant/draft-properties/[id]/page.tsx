"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/16/solid";
import PropertyDetail from "@/components/Tenant/PropertyDetail";
import Multiselect from "@/components/Multiselect";

const DraftProperty = () => {
  const router = useRouter();
  const [propertyData, setPropertyData] = useState({
    propertyName: "",
    description: "",
    price: "",
    images: [] as File[], // Correct the type to File[]
    facilities: [] as number[], // Use number array for facility IDs
  });
  const [rooms, setRooms] = useState([
    {
      name: "",
      description: "",
      capacity: 0,
      size: 0,
      bedType: "",
      totalBed: 0,
      qty: 0,
      basePrice: 0,
      totalBathroom: 0,
      facilities: [] as number[], // Use number array for facility IDs
    },
  ]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPropertyData({ ...propertyData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const imageFiles = Array.from(e.target.files);
      setPropertyData((prev) => ({
        ...prev,
        images: [...prev.images, ...imageFiles],
      }));
    }
  };

  const handleRoomChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const updatedRooms = rooms.map((room, i) =>
      i === index ? { ...room, [e.target.name]: e.target.value } : room
    );
    setRooms(updatedRooms);
  };

  const handleAddRoom = () => {
    setRooms([
      ...rooms,
      {
        name: "",
        description: "",
        capacity: 0,
        size: 0,
        bedType: "",
        totalBed: 0,
        qty: 0,
        basePrice: 0,
        totalBathroom: 0,
        facilities: [], // Reset facilities for new room
      },
    ]);
  };

  const handleFacilityChange = (facilityIds: number[]) => {
    setPropertyData({ ...propertyData, facilities: facilityIds });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Prepare form data
      const formData = new FormData();
      formData.append("propertyName", propertyData.propertyName);
      formData.append("description", propertyData.description);
      formData.append("price", propertyData.price);
      propertyData.images.forEach((image) => {
        formData.append("images", image);
      });
      propertyData.facilities.forEach((facility) => {
        formData.append("facilities[]", facility.toString()); // Convert number to string
      });

      // Submit property data
      const propertyResponse = await fetch("{{base_url}}/property", {
        method: "POST",
        body: formData,
      });
      const propertyResult = await propertyResponse.json();
      if (propertyResult.success) {
        const propertyId = propertyResult.data.id;

        // Submit rooms data
        await Promise.all(
          rooms.map(async (room) => {
            const roomResponse = await fetch(
              `{{base_url}}/property/${propertyId}/rooms`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(room),
              }
            );
            return roomResponse.json();
          })
        );

        console.log("Property and rooms submitted successfully");
        router.push("/tenant/properties");
      }
    } catch (error) {
      console.error("Error submitting property:", error);
    }
  };

  return (
    <div className="bg-white border rounded-lg shadow-sm p-4">
      <div className="flex justify-between">
        <h1 className="text-xl tracking-widest font-semibold">Property Draft</h1>
        <button
          onClick={() => router.push("/tenant/properties")}
          className="px-4 py-2 text-blue-500 flex"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-1" />
          Back
        </button>
      </div>

      {/* Property Detail Component */}
      <div className="border mt-4">
        <PropertyDetail />
      </div>

      {/* Property Form */}
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Property Images
          </label>
          <input
            type="file"
            name="images"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
          <div className="mt-2">
            {propertyData.images.map((image, index) => (
              <p key={index} className="text-gray-700">
                {image.name}
              </p>
            ))}
          </div>
        </div>

        {/* Facilities */}
        <Multiselect
          selectedFacilities={propertyData.facilities}
          onChange={handleFacilityChange}
        />

        {/* Rooms Section */}
        <div>
          <h2 className="text-lg font-medium">Rooms</h2>
          {rooms.map((room, index) => (
            <div key={index} className="border p-4 rounded-lg mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Room Name
              </label>
              <input
                type="text"
                name="name"
                value={room.name}
                onChange={(e) => handleRoomChange(index, e)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
              <label className="block text-sm font-medium text-gray-700 mt-2">
                Description
              </label>
              <input
                type="text"
                name="description"
                value={room.description}
                onChange={(e) => handleRoomChange(index, e)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
              {/* Additional fields for room details */}
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddRoom}
            className="mt-2 text-blue-500"
          >
            Add Room
          </button>
        </div>

        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Submit Property
        </button>
      </form>
    </div>
  );
};

export default DraftProperty;