"use client";
import Title from "./Title";
import testimonials from "@/utils/testimonials";
import Image from "next/image";
import { useEffect, useState } from "react";

function Testimonials() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [maxVisibleSlides, setMaxVisibleSlides] = useState(3);
  const autoSlideInterval = 5000; // 5 seconds interval for auto-swipe
  const [hovered, setHovered] = useState(false);

  // Adjust maxVisibleSlides based on screen width
  const updateMaxVisibleSlides = () => {
    if (window.innerWidth < 640) {
      setMaxVisibleSlides(1); // Mobile screens
    } else if (window.innerWidth < 768) {
      setMaxVisibleSlides(2); // Tablets
    } else {
      setMaxVisibleSlides(3); // Desktop screens
    }
  };

  useEffect(() => {
    updateMaxVisibleSlides(); // Initial check
    window.addEventListener("resize", updateMaxVisibleSlides);
    return () => window.removeEventListener("resize", updateMaxVisibleSlides);
  }, []);

  const nextSlide = () => {
    if (currentSlide < testimonials.length - maxVisibleSlides) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      setCurrentSlide(0); // Reset to the first slide
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(nextSlide, autoSlideInterval);

    // Clear the interval on component unmount or when user manually navigates
    return () => clearInterval(interval);
  }, [currentSlide, maxVisibleSlides]);

  return (
    <section
      className="bg-[#fafafb] "
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="mx-auto max-w-screen-xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <h2 className="lg:text-sm md:text-xs text-center uppercase text-gray-500">
          Testimonial
        </h2>
        <Title>
          What guests say about <span className="text-indigo-500">Roomio.</span>
        </Title>

        <div className="relative mt-8 overflow-hidden">
          {/* Slider container */}
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${
                currentSlide * (100 / maxVisibleSlides)
              }%)`,
            }}
          >
            {testimonials.map((item) => (
              <div
                key={item.id}
                className="p-4"
                style={{ minWidth: `${100 / maxVisibleSlides}%` }}
              >
                <blockquote className="group rounded-lg bg-gray-50 p-8 shadow-lg">
                  <div className="flex items-center gap-4">
                    <Image
                      alt={item.name}
                      src={`/assets/testimoni/${item.image}`}
                      className="size-14 rounded-full object-cover"
                      width={60}
                      height={60}
                    />
                    <div>
                      <p className="mt-0.5 text-lg font-medium text-gray-900">
                        {item.name}
                      </p>
                      <span className="text-gray-800 text-sm">
                        Guest From
                        <span className="font-bold"> {item.origin}</span>
                      </span>
                    </div>
                  </div>
                  <p className="mt-4 text-gray-700">{item.testimoni}</p>
                </blockquote>
              </div>
            ))}
          </div>

          {/* Navigation buttons */}
          {hovered && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-softLavender text-gray-500 p-2 rounded-full px-4 hover:bg-lavender hover:text-white border"
                disabled={currentSlide === 0}
              >
                &#10094;
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-softLavender text-gray-500 p-2 rounded-full px-4 hover:bg-lavender hover:text-white"
                disabled={
                  currentSlide >= testimonials.length - maxVisibleSlides
                }
              >
                &#10095;
              </button>
            </>
          )}

          {/* Bullet Indicators */}
          <div className="flex justify-center mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-4 h-1 mx-1 rounded-sm ${
                  index === currentSlide ? "bg-indigo-500" : "bg-gray-400"
                }`}
              ></button>
            ))}
          </div>

          
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
