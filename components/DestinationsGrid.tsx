import DestinationCard from "./DestinationCard";


const destinations = [
  {
    title: 'Jakarta',
    accommodations: 644,
    imageUrl: '/assets/images/jakarta.jpg', 
  },
  {
    title: 'Bali',
    accommodations: 8371,
    imageUrl: '/assets/images/bali.jpg',
  },
  {
    title: 'Bandung',
    accommodations: 27449,
    imageUrl: '/assets/images/bandung.jpg',
  },
  {
    title: 'Surabaya',
    accommodations: 15929,
    imageUrl: '/assets/images/surabaya.jpg',
  },
  {
    title: 'Semarang',
    accommodations: 28141,
    imageUrl: '/assets/images/semarang.jpg',
  },
  {
    title: 'Yogyakarta',
    accommodations: 960,
    imageUrl: '/assets/images/yogyakarta.jpg',
  },
];

const DestinationsGrid = () => {
  return (
    <section className="py-10">
      <h2 className="text-3xl font-bold text-center mb-8 text-slate-800">
      Top destinations in Indonesia
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {destinations.map((destination, index) => (
          <DestinationCard
            key={index}
            title={destination.title}
            accommodations={destination.accommodations}
            imageUrl={destination.imageUrl}
          />
        ))}
      </div>
    </section>
  );
};

export default DestinationsGrid;
