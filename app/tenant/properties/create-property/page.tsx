"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useSession } from "next-auth/react";
import NotificationModal from "@/components/NotificationModal";
import { ArrowLeftIcon } from "@heroicons/react/16/solid";
import Multiselect from "@/components/Multiselect";
import { Room } from "@/types/Room";

interface Category {
  id: number;
  name: string;
}

const CreatePropertyPage = () => {
  const [notificationMessage, setNotificationMessage] = useState<string | null>(
    null
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [facilities, setFacilities] = useState<number[]>([]);
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${apiUrl}/categories?size=100`);
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data.data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Property name is required"),
    description: Yup.string().required("Description is required"),
    categoryId: Yup.number().required("Category is required"),
    location: Yup.string().required("Location is required"),
    city: Yup.string().required("City is required"),
    map: Yup.string()
      .url("Must be a valid URL")
      .required("Map link is required"),
  });

  const handleSubmit = async (values: any) => {
    try {
      // Step 1: Submit the main property details
      const response = await fetch(`${apiUrl}/property`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...values, facilities }),
      });

      if (!response.ok) {
        throw new Error("Failed to create property");
      }

      const data = await response.json();
      const propertyId = data.data.id; // Get the property ID for image and room uploads

      // Step 2: Upload images
      if (images.length > 0) {
        const imageFormData = new FormData();
        images.forEach((image) => {
          imageFormData.append("files", image);
        });

        const imageResponse = await fetch(
          `${apiUrl}/property/${propertyId}/images`,
          {
            headers: {
              Authorization: `Bearer ${session?.user.token}`,
            },
            method: "POST",
            body: imageFormData,
          }
        );

        const imageResult = await imageResponse.json();
        if (!imageResult.success) {
          throw new Error("Failed to upload images");
        }
      }

      // Step 3: Upload Facilities
      const facilitiesResponse = await fetch(
        `${apiUrl}/property/${propertyId}/facilities`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session?.user.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            facilityIds: facilities,
          }),
        }
      );

      const facilitiesResult = await facilitiesResponse.json();
      if (!facilitiesResult.success) {
        throw new Error("Failed to upload facilities");
      }

      console.log("room");

      // Step 4: Submit rooms
      await Promise.all(
        rooms.map(async (room) => {
          try {            
            // Create the room
            const roomResponse = await fetch(`${apiUrl}/property/${propertyId}/rooms`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${session?.user.token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(room),
            });
      
            if (!roomResponse.ok) {
              throw new Error(`Room creation failed: ${roomResponse.statusText}`);
            }
      
            const roomResult = await roomResponse.json();
            console.log("test",roomResult)
            if (!roomResult.success) {
              throw new Error("Failed to upload room");
            }
      
            const roomId = roomResult.data.id;
            console.log("Room ID:", roomId);
      
            // Check if facilities exist and are valid
            if (room.facilities && Array.isArray(room.facilities) && room.facilities.length > 0) {
              console.log("Facilities to be added:", room.facilities);
      
              // Add room facilities
              const facilitiesRoomResponse = await fetch(`${apiUrl}/property/rooms/${roomId}/facilities`, {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${session?.user.token}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  facilityIds: room.facilities,
                }),
              });
      
              if (!facilitiesRoomResponse.ok) {
                throw new Error(`Facilities creation failed: ${facilitiesRoomResponse.statusText}`);
              }
      
              const facilitiesRoomResult = await facilitiesRoomResponse.json();
              if (!facilitiesRoomResult.success) {
                throw new Error("Failed to upload facilities");
              }
      
              console.log("Facilities successfully added to room:", roomId);
            } else {
              console.warn(`No valid facilities to add for room ${roomId}`);
            }
          } catch (error:any) {
            console.error("Error processing room:", error.message);
          }
        })
      );
      

      // Show success message and redirect
      setNotificationMessage("Property created successfully!");
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/tenant/properties");
      }, 3000);
    } catch (error) {
      console.error(error);
      setNotificationMessage("Failed to create property");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const imageFiles = Array.from(e.target.files);
      setImages([...images, ...imageFiles]);
    }
  };

  const handleAddRoom = () => {
    setRooms([
      ...rooms,
      {
        name: "",
        description: "",
        capacity: 1,
        size: 0,
        bedType: "",
        totalBed: 1,
        qty: 1,
        basePrice: 0,
        totalBathroom: 1,
        facilities: [],
      },
    ]);
  };

  const handleRemoveRoom = (index: number) => {
    if (rooms.length > 1) {
      setRooms(rooms.filter((_, i) => i !== index));
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

  return (
    <div className="bg-white border rounded-lg shadow-sm p-4">
      <div className="flex justify-between">
        <h1 className="text-xl font-bold mb-4">Create Property</h1>
        <button
          onClick={() => router.push("/tenant/properties")}
          className="px-4 py-2 text-blue-500 flex"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-1" />
          Back
        </button>
      </div>

      {/* Display notification modal */}
      {notificationMessage && (
        <NotificationModal
          message={notificationMessage}
          onClose={() => setNotificationMessage(null)}
        />
      )}

      <Formik
        initialValues={{
          name: "",
          description: "",
          categoryId: "",
          location: "",
          city: "",
          map: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue }) => (
          <Form
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            {/* Property Details */}
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Property Name
              </label>
              <Field
                name="name"
                type="text"
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <Field
                name="description"
                as="textarea"
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
              />
              <ErrorMessage
                name="description"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="categoryId"
                className="block text-sm font-medium text-gray-700"
              >
                Property Category
              </label>
              <Field
                as="select"
                name="categoryId"
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage
                name="categoryId"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700"
              >
                Location
              </label>
              <Field
                name="location"
                type="text"
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
              />
              <ErrorMessage
                name="location"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700"
              >
                City
              </label>
              <Field
                name="city"
                type="text"
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
              />
              <ErrorMessage
                name="city"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="map"
                className="block text-sm font-medium text-gray-700"
              >
                Map Link
              </label>
              <Field
                name="map"
                type="url"
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
              />
              <ErrorMessage
                name="map"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="images"
                className="block text-sm font-medium text-gray-700"
              >
                Property Images
              </label>
              <input
                type="file"
                multiple
                onChange={handleImageUpload}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="facilities"
                className="block text-sm font-medium text-gray-700"
              >
                Facilities
              </label>
              <Multiselect
                onChange={(facilityIds: number[]) => setFacilities(facilityIds)}
                selectedFacilities={facilities}
              />
            </div>

            {/* Rooms section */}
            <div>
              <h2 className="text-lg font-medium">Rooms</h2>
              {rooms.map((room, index) => (
                <div key={index} className="border p-4 mb-4">
                  <div className="mb-4">
                    <label
                      htmlFor={`room-name-${index}`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Room Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={room.name}
                      onChange={(e) => handleRoomChange(index, e)}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded"
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
                      Capacity (People)
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
                    <label className="block text-sm font-medium text-gray-700 mt-2">
                      Room Facilty
                    </label>
                    <Multiselect
                      selectedFacilities={room.facilities}
                      onChange={(facilityIds: number[]) => {
                        const updatedRooms = [...rooms];
                        updatedRooms[index].facilities = facilityIds;
                        setRooms(updatedRooms);
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveRoom(index)}
                    className="text-red-500"
                  >
                    Remove Room
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddRoom}
                className="text-blue-500"
              >
                Add Room
              </button>
            </div>

            <div className="mt-4">
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded"
              >
                Create Property
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreatePropertyPage;
