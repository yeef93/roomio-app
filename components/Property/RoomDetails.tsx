import React, { useState } from "react";
import { FaTv, FaCoffee, FaBed, FaWifi, FaHotel, FaToilet, FaRestroom, FaBath } from "react-icons/fa";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { FaHouse, FaPeopleGroup } from "react-icons/fa6";

interface RoomImage {
  id: number;
  imageUrl: string;
}

interface Room {
  id: number;
  name: string;
  description: string;
  capacity: number;
  size: number;
  bedType: string;
  totalBed: number;
  qty: number;
  basePrice: number;
  totalBathroom: number;
  isActive: boolean;
  currentPrice: number | null;
  actualPrice: number;
  images: RoomImage[];
}

interface RoomDetailsProps {
  rooms: Room[];
}

function RoomDetails ({ rooms }:RoomDetailsProps)  {
  return (
    <div className="grid grid-cols-1 gap-6">
      {rooms.map((room) => (
        <RoomCard key={room.id} room={room} />
      ))}
    </div>
  );
};

const RoomCard: React.FC<{ room: Room }> = ({ room }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === room.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? room.images.length - 1 : prevIndex - 1
    );
  };

  const formatPrice = (price:number) => {
    let formattedPrice = price.toFixed(2).replace('.', ',');
    formattedPrice = formattedPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ".");  
    return 'Rp ' + formattedPrice;
  };


  return (
    <div className="border rounded-lg shadow-md overflow-hidden relative bg-white p-4">     
      <div className="p-4 flex justify-between">
        <div className="flex flex-col justify-between w-3/4">
          <div className="pb-4 border-b-2">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center pb-4">
              {room.name}
            </h3>
            <div className=" flex space-x-4"><FaHouse/><p className="text-gray-600 mb-2">{room.size} sqft</p></div>
            <div className=" flex space-x-4"><FaPeopleGroup/><p className="text-gray-600 mb-2">{room.capacity} People</p></div>
            <div className=" flex space-x-4"><FaBed/><p className="text-gray-600 mb-2">{room.totalBed} {room.bedType}</p></div>
            <div className=" flex space-x-4"><FaRestroom/><p className="text-gray-600 mb-2">{room.totalBathroom} Bathroom</p></div>
          </div>

          <div className="mt-4">
            <p className="text-red-600 text-2xl font-bold">
            {formatPrice(room.actualPrice)}
            </p>
            {room.currentPrice && (
              <p className="text-gray-500 line-through">
                {formatPrice(room.currentPrice)}
              </p>
            )}
            <p className="text-gray-500 text-sm">
            </p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 right-4">
        {room.images && room.images.length > 0 && (
          <div className="relative w-full h-48">
            <img
              src={room.images[currentImageIndex].imageUrl}
              alt={room.name}
              className="object-cover w-56 h-full rounded-lg"
            />

            {room.images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white opacity-80 text-indigo-600 p-2 rounded-full"
                >
                  <FaArrowLeft />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white opacity-80 text-indigo-600 p-2 rounded-full"
                >
                  <FaArrowRight />
                </button>
              </>
            )}
          </div>
        )}
        <button className="bg-orange-500 text-white font-semibold px-6 py-2 rounded-md flex items-center space-x-2">
          <span>Choose</span>
        </button>
      </div>
    </div>
  );
};

export default RoomDetails;