import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPinIcon, BuildingOfficeIcon } from "@heroicons/react/16/solid";

interface PropertyCardProps {
  id: number;
  images: { id: number; imageUrl: string }[];
  name: string;
  location: string | null;
  city: string | null;
  category: { name: string; imageUrl: string };
  tenant: {
    id: number;
    email: string;
    firstname: string;
    lastname: string;
    avatar: string;
  };
  price: number;
  checkin: string;
  checkout: string;
  room: number;
  adult: number;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  id,
  images,
  name,
  location,
  city,
  category,
  tenant,
  price,
  checkin,
  checkout,
  room,
  adult,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hovered, setHovered] = useState(false);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  // Create a URL-friendly property name
  const formattedName = name.replace(/\s+/g, "-").toLowerCase();

  return (
    <div
      className="property-card border rounded-lg shadow-md bg-white relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="carousel-container relative overflow-hidden">
        <div
          className="carousel-wrapper flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image) => (
            <div key={image.id} className="carousel-item flex-shrink-0 w-full">
              <Image
                src={image.imageUrl}
                alt={`Property ${id}`}
                className="object-cover w-full h-48 rounded-t-lg"
                width={300}
                height={300}
              />
            </div>
          ))}
        </div>
        {images.length > 1 && (
          <>
            {/* Prev and Next buttons (visible on hover) */}
            {hovered && (
              <>
                <button
                  className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-opacity-80 bg-white text-gray-700 rounded-full p-1 px-3"
                  onClick={prevSlide}
                >
                  &lt;
                </button>
                <button
                  className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-opacity-80 bg-white text-gray-700 rounded-full p-1 px-3"
                  onClick={nextSlide}
                >
                  &gt;
                </button>
              </>
            )}

            {/* Bullet indicators (always visible) */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {images.map((_, index) => (
                <span
                  key={index}
                  className={`h-2 w-2 rounded-full bg-opacity-50 ${
                    currentIndex === index ? "bg-white" : "bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      {/* Make only the card text and price clickable */}
      <Link
        href={{
          pathname: `/${id}-${formattedName}`,
          query: {
            checkin: checkin,
            checkout: checkout,
            room: room,
            adult: adult,
          },
        }}
        className="block px-4 py-2"
      >
        <h2 className="text-xl font-semibold">{name}</h2>
        <p className="text-gray-600 flex">
          <MapPinIcon className="h-5 w-5 mr-1 text-indigo-600" />
          {location}, {city}
        </p>
        <p className="text-gray-600 flex">
        <BuildingOfficeIcon className="h-5 w-5 mr-1 text-indigo-600" />
        {category.name}</p>
        <div className=" flex">
          <p className="text-lg font-bold text-gray-600">Start From &nbsp;</p>
          <p className="text-lg font-bold text-red-500">
            {" "}
            Rp.{price.toFixed(0)}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default PropertyCard;
