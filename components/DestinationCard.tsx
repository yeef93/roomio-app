import Image from 'next/image';

interface DestinationCardProps {
  title: string;
  accommodations: number;
  imageUrl: string;
}


const DestinationCard = ({ title, accommodations, imageUrl }:DestinationCardProps) => {
  return (
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
        <p className="text-white text-sm">{accommodations} accommodations</p>
      </div>
    </div>
  );
};

export default DestinationCard;
