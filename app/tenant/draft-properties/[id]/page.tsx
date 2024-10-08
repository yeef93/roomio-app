"use client";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/16/solid";
import PropertyDetail from "@/components/Tenant/PropertyDetail";
import Multiselect from "@/components/Multiselect";
import { useSession } from "next-auth/react";

const DraftProperty = () => {
  const pathname = usePathname();
  const router = useRouter();
  const propertyId = pathname.split("/").pop();
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { data: session } = useSession();
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

  const handleRemoveRoom = (index: number) => {
    const updatedRooms = rooms.filter((_, i) => i !== index);
    setRooms(updatedRooms);
  };

  const handleFacilityChange = (facilityIds: number[]) => {
    setPropertyData({ ...propertyData, facilities: facilityIds });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      // Step 2: Upload Images
      const imageFormData = new FormData();
      propertyData.images.forEach((image) => {
        imageFormData.append("files", image);
      });

      const imageResponse = await fetch(`${apiUrl}/property/${propertyId}/images`, {
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
        },
        method: "POST",
        body: imageFormData,
      });

      const imageResult = await imageResponse.json();
      if (!imageResult.success) {
        throw new Error("Failed to upload images");
      }

      // Step 3: Upload Facilities
      const facilitiesResponse = await fetch(`${apiUrl}/property/${propertyId}/facilities`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          facilityIds: propertyData.facilities,
        }),
      });

      const facilitiesResult = await facilitiesResponse.json();
      if (!facilitiesResult.success) {
        throw new Error("Failed to upload facilities");
      }

      // Step 4: Upload Rooms
      await Promise.all(
        rooms.map(async (room) => {
          const roomResponse = await fetch(`${apiUrl}/property/${propertyId}/rooms`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${session?.user.token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(room),
          });
          const roomResult = await roomResponse.json();
          if (!roomResult.success) {
            throw new Error("Failed to upload room");
          }
        })
      );

      console.log("Property images, facilities, and rooms submitted successfully");
      router.push("/tenant/properties");
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
              <textarea
                name="description"
                value={room.description}
                onChange={(e) => handleRoomChange(index, e)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />

              {/* Additional fields for room details */}
              <label className="block text-sm font-medium text-gray-700 mt-2">
                Capacity
              </label>
              <input
                type="number"
                name="capacity"
                value={room.capacity}
                onChange={(e) => handleRoomChange(index, e)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />

              <label className="block text-sm font-medium text-gray-700 mt-2">
                Size (sqm)
              </label>
              <input
                type="number"
                name="size"
                value={room.size}
                onChange={(e) => handleRoomChange(index, e)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />

              <label className="block text-sm font-medium text-gray-700 mt-2">
                Bed Type
              </label>
              <input
                type="text"
                name="bedType"
                value={room.bedType}
                onChange={(e) => handleRoomChange(index, e)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />

              <label className="block text-sm font-medium text-gray-700 mt-2">
                Total Bed
              </label>
              <input
                type="number"
                name="totalBed"
                value={room.totalBed}
                onChange={(e) => handleRoomChange(index, e)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />

              <label className="block text-sm font-medium text-gray-700 mt-2">
                Quantity (qty)
              </label>
              <input
                type="number"
                name="qty"
                value={room.qty}
                onChange={(e) => handleRoomChange(index, e)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />

              <label className="block text-sm font-medium text-gray-700 mt-2">
                Base Price
              </label>
              <input
                type="number"
                name="basePrice"
                value={room.basePrice}
                onChange={(e) => handleRoomChange(index, e)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />

              <label className="block text-sm font-medium text-gray-700 mt-2">
                Total Bathroom
              </label>
              <input
                type="number"
                name="totalBathroom"
                value={room.totalBathroom}
                onChange={(e) => handleRoomChange(index, e)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />

              {/* Remove Room Button */}
              <button
                type="button"
                onClick={() => handleRemoveRoom(index)}
                className="mt-2 text-red-500"
              >
                Remove Room
              </button>
            </div>
          ))}
          {/* Add Room Button */}
          <button
            type="button"
            onClick={handleAddRoom}
            className="mt-2 text-blue-500"
          >
            + Add Room
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Submit Property
        </button>
      </form>
    </div>
  );
};

export default DraftProperty;