// components/PropertyCard.tsx
import React, { useState } from 'react';

interface PropertyCardProps {
  id: number;
  images: { id: number; imageUrl: string }[];
  name: string;
  location: string | null;
  city: string | null;
  category: string;
  tenant: {
    id: number;
    email: string;
    firstname: string;
    lastname: string;
    avatar: string;
  };
  price: number;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  id,
  images,
  name,
  location,
  city,
  category,
  tenant,
  price
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  return (
    <div className="property-card border rounded-lg shadow-md p-4 bg-white">
      <div className="carousel-container relative overflow-hidden">
        <div
          className="carousel-wrapper flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image) => (
            <div
              key={image.id}
              className="carousel-item flex-shrink-0 w-full"
            >
              <img
                src={image.imageUrl}
                alt={`Property ${id}`}
                className="object-cover w-full h-48 rounded-lg"
              />
            </div>
          ))}
        </div>
        {images.length > 1 && (
          <>
            <button
              className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-700 text-white rounded-full p-2"
              onClick={prevSlide}
            >
              &lt;
            </button>
            <button
              className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-700 text-white rounded-full p-2"
              onClick={nextSlide}
            >
              &gt;
            </button>
          </>
        )}
      </div>
      <h2 className="text-xl font-semibold mb-2">{name}</h2>
      <p className="text-gray-600 mb-2">{location}, {city}</p>
      <p className="text-gray-600 mb-2">{category}</p>
      <p className="text-lg font-bold">Price: Rp.{price.toFixed(2)}</p>
    </div>
  );
};

export default PropertyCard;
