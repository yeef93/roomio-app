"use client";

import React from "react";
import { usePathname, useSearchParams } from "next/navigation";
import ImageCarousel from "@/components/Property/ImageCarousel";
import BookingDetails from "./BookDetails";
import { usePropertyDetails } from "@/hooks/usePropertyDetails";
import { useFacilities } from "@/hooks/useFacilities";
import PropertyDetailSkeleton from "../Skeleton/PropertyDetailSkeleton";
import RoomDetails from "./RoomDetails";
import { BuildingOfficeIcon, MapPinIcon } from "@heroicons/react/16/solid";

export default function PropertyDetail() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const fullSlug = pathname.split("/").pop() || "";
  const id = fullSlug.split("-")[0];

  const checkin = searchParams.get("checkin");
  const checkout = searchParams.get("checkout");
  const room = searchParams.get("room");
  const adult = searchParams.get("adult");
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const { property, loading: propertyLoading } = usePropertyDetails(id, apiUrl);
  const {
    facilities,
    loading: facilitiesLoading,
    error: facilitiesError,
  } = useFacilities(id);

  if (propertyLoading || facilitiesLoading) {
    return <PropertyDetailSkeleton />;
  }

  if (!property) {
    return (
      <div className="text-center py-10 text-red-600">Property not found</div>
    );
  }

  return (
    <div className="">
      <ImageCarousel images={property.images} />
      <div className="flex flex-row px-20 justify-between">
        <div>
          <div className="px-4 py-6 lg:py-10">
            <div className="w-[90%]">
              <div className="border-b-2 mb-4 border-slate-200">
                <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                  {property.name}
                </h1>
                <div className="flex items-center text-sm sm:text-base text-gray-600 mt-2 mb-2">
                  <BuildingOfficeIcon className="w-4 h-4 mr-1 text-gray-500" />
                  <p className="mr-3">{property.category.name}</p>
                  <MapPinIcon className="w-4 h-4 mr-1 text-gray-500" />
                  <p>{property.city}</p>
                </div>
                <p className="text-gray-600 mb-2">
                  {property.location}, {property.city}
                </p>
                <p className="text-gray-600 mb-2">{property.description}</p>
              </div>

              <div className="flex items-center mb-6">
                <img
                  src={property.tenant.avatar}
                  alt={property.tenant.firstname}
                  className="rounded-full w-12 h-12 mr-4"
                />
                <div>
                  <p className="text-lg">
                    Hosted by {property.tenant.firstname}{" "}
                    {property.tenant.lastname}
                  </p>
                  <p className="text-base text-gray-400">
                    Since {new Date(property.tenant.createdAt).getFullYear()}
                  </p>
                </div>
              </div>

              <h2 className="lg:text-xl font-bold mb-4">Facilities</h2>
              {facilitiesError ? (
                <p className="text-red-600">Error loading facilities</p>
              ) : (
                <ul className="grid grid-cols-2 gap-2 mb-6">
                  {facilities.map((facility) => (
                    <li key={facility.id} className="flex items-center">
                      {facility.icon && (
                        <img
                          src={facility.icon}
                          alt={facility.name}
                          className="w-5 h-5 mr-2"
                        />
                      )}
                      <span>{facility.name}</span>
                    </li>
                  ))}
                </ul>
              )}

              <h2 className="lg:text-xl font-bold mb-4">Choose your room</h2>
              <RoomDetails rooms={property.rooms} />
            </div>
          </div>
        </div>

        <div>
          <BookingDetails
            checkin={checkin}
            checkout={checkout}
            room={room}
            adult={adult}
          />
        </div>
      </div>
    </div>
  );
}
