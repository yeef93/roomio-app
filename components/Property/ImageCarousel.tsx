'use client'

import React, { useState } from 'react'
import Image from 'next/image'

interface ImageCarouselProps {
  images: { id: number; imageUrl: string }[];
}

export default function ImageCarousel({ images }: ImageCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const maxSlides = images.length - 1 // Number of slides possible

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === maxSlides ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? maxSlides : prev - 1))
  }

  return (
    <div className="relative mb-6 max-w-full overflow-hidden">
      {images.length > 0 && (
        <>
          <div className="flex">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentSlide * 83.33}%)`,
                width: `${(images.length + 1) * 83.33}%`
              }}
            >
              {images.map((image, index) => (
                <div
                  key={image.id}
                  className="w-[83.33%] h-[66vh] flex-shrink-0 relative"
                  style={{
                    marginLeft: index === 0 ? '-16.67%' : '0',
                  }}
                >
                  <Image
                    src={image.imageUrl}
                    alt={`Property image ${image.id}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
              {/* Add an extra slide that's a copy of the first image */}
              <div
                className="w-[83.33%] h-[66vh] flex-shrink-0 relative"
              >
                <Image
                  src={images[0].imageUrl}
                  alt={`Property image ${images[0].id}`}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Navigation buttons */}
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80 text-pink-600 text-4xl p-2 px-6 rounded-full shadow-md hover:bg-white transition-colors"
            aria-label="Previous image"
          >
            &#8249;
          </button>
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80 text-pink-600 text-4xl p-2 px-6 rounded-full shadow-md hover:bg-white transition-colors"
            aria-label="Next image"
          >
            &#8250;
          </button>
        </>
      )}
    </div>
  )
}