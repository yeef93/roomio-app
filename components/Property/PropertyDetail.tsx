'use client';
import React from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import ImageCarousel from '@/components/Property/ImageCarousel';
import BookingDetails from './BookDetails';
import { usePropertyDetails } from '@/hooks/usePropertyDetails';
import PropertyDetailSkeleton from '../Skeleton/PropertyDetailSkeleton';

export default function PropertyDetail() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const fullSlug = pathname.split('/').pop() || '';
  const id = fullSlug.split('-')[0];
  
  const checkin = searchParams.get('checkin');
  const checkout = searchParams.get('checkout');
  const room = searchParams.get('room');
  const adult = searchParams.get('adult');
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const { property, loading } = usePropertyDetails(id, apiUrl);

  if (loading) {
    return <PropertyDetailSkeleton/>;
  }

  if (!property) {
    return <div className="text-center py-10 text-red-600">Property not found</div>;
  }

  return (
    <div className="pt-28 lg:pt-2">
      {/* Full width ImageCarousel */}
      <ImageCarousel images={property.images} />
      
      {/* Property details */}
      <div className="px-4 lg:px-20 py-6 lg:py-12">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">{property.name}</h1>
          <p className="text-gray-600 mb-2">{property.description}</p>
          <p className="text-gray-600 mb-2">{property.location}, {property.city}</p>
          <p className="text-gray-600 mb-4">Category: {property.category}</p>

          {/* Host details */}
          <div className="flex items-center mb-6">
            <img
              src={property.tenant.avatar}
              alt={property.tenant.firstname}
              className="rounded-full w-12 h-12 mr-4"
            />
            <p className="text-lg">Hosted by {property.tenant.firstname} {property.tenant.lastname}</p>
          </div>

          {/* Rooms */}
          <h2 className="text-2xl lg:text-3xl font-bold mb-4">Available Rooms</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {property.rooms.map((room) => (
              <div key={room.id} className="border p-4 rounded-md bg-white shadow-md">
                <h3 className="text-xl font-semibold mb-2">{room.name}</h3>
                <p className="text-gray-600 mb-2">{room.description}</p>
                <p className="text-gray-600">Capacity: {room.capacity}</p>
                <p className="text-gray-600">Size: {room.size} sq ft</p>
                <p className="text-gray-600">Bed Type: {room.bedType}</p>
                <p className="text-gray-600">Total Beds: {room.totalBed}</p>
                <p className="text-gray-600">Bathrooms: {room.totalBathroom}</p>
                <p className="text-red-600 font-bold mt-2">Price: Rp. {room.actualPrice.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Booking details */}
        <BookingDetails checkin={checkin} checkout={checkout} room={room} adult={adult} />
      </div>
    </div>
  );
}
