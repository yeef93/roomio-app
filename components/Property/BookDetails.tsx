import React from "react";

interface BookingDetailsProps {
  checkin: string | null;
  checkout: string | null;
  room: string | null;
  adult: string | null;
}

const BookingDetails: React.FC<BookingDetailsProps> = ({
  checkin,
  checkout,
  room,
  adult,
}) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl lg:text-3xl font-bold mb-4">Booking Details</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <p>Check-in: {checkin || 'Not specified'}</p>
        <p>Check-out: {checkout || 'Not specified'}</p>
        <p>Rooms: {room || 'Not specified'}</p>
        <p>Adults: {adult || 'Not specified'}</p>
      </div>
    </div>
  );
};

export default BookingDetails;
