"use client";
import React from "react";
import Carousel from "@/components/Carousel";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PropertyCard from "@/components/PropertyCard";
import Testimonials from "@/components/Testimonials";
import { useProperties } from "@/hooks/useProperties";
import PropertyCardSkeleton from "@/components/Skeleton/PropertyCardSkeleton";

function Home() {
  const { properties, loading, error } = useProperties();

  const images: string[] = [
    "/assets/hero/promohero.webp",
    "https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/1134175/pexels-photo-1134175.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    "https://images.pexels.com/photos/2677398/pexels-photo-2677398.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",    
    // Add more image paths as needed
  ];

  return (
    <>
      <Header />
      <div className="pt-16">
        <Carousel images={images} />
      </div>
      <div className="py-16 px-32">
        {loading ? (
          <div className="flex flex-wrap justify-center gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <PropertyCardSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : properties.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-4">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                id={property.id}
                images={property.images}
                name={property.name} // Use property name or title
                location={property.location}
                city={property.city}
                category={property.category}
                tenant={property.tenant}
                price={property.price}
                checkin="2023-08-20"
                checkout="2023-08-21"
                room={1}
                adult={1}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center my-8">
            <p className="text-lg font-semibold text-gray-700">
              Sorry, there are no properties available at the moment.
            </p>
          </div>
        )}
      </div>
      <Testimonials />
      <Footer />
    </>
  );
}

export default Home;
