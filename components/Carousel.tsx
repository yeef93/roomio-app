"use client";
import React from "react";
import ImageSlider from "./ImageSlider";  // Adjust the path based on your folder structure
import SearchBar from "./SearchBar";      // Adjust the path as needed

interface CarouselWithSearchProps {
  images: string[];
}

const CarouselWithSearch: React.FC<CarouselWithSearchProps> = ({ images }) => {
  return (
    <div className="relative w-full h-[75vh] md:h-[55vh]">
      {/* Image Slider */}
      <ImageSlider images={images} />

      {/* Positioned SearchBar */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-full max-w-4xl px-4">
        <SearchBar />
      </div>
    </div>
  );
};

export default CarouselWithSearch;
