import React from "react";
import Image from "next/image";

interface DestinationCardProps {
  title: string;
  accommodations: number | string;
  imageUrl: string;
  onClick: () => void; // Add onClick prop
}

const DestinationCard: React.FC<DestinationCardProps> = ({
  title,
  accommodations,
  imageUrl,
  onClick, // Destructure onClick
}) => {
  return (
    <div
      onClick={onClick} // Add click handler
      className="cursor-pointer bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
    >
      <div className="relative rounded-lg overflow-hidden shadow-lg">
      <Image
        src={imageUrl}
        alt={title}
        layout="responsive"
        width={300}
        height={200}
        objectFit="cover"
        className="w-full h-full"
      />
      <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-end p-4">
        <h3 className="text-white text-2xl font-semibold">{title}</h3>
        <p className="text-white text-sm">{accommodations} properties</p>
      </div>
    </div>
    </div>
  );
};

export default DestinationCard;