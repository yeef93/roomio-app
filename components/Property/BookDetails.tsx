'use client'

import { useState, useEffect } from 'react'

interface BookingDetailsProps {
  checkin: string | null;
  checkout: string | null;
  room: string | null;
  adult: string | null;
}

export default function BookingForm({ checkin, checkout, room, adult }: BookingDetailsProps) {
  const today = new Date().toISOString().split('T')[0]
  const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0]

  const [checkinState, setCheckin] = useState(checkin || today)
  const [checkoutState, setCheckout] = useState(checkout || tomorrow)
  const [roomState, setRoom] = useState(room ? parseInt(room) : 1)
  const [adultState, setAdult] = useState(adult ? parseInt(adult) : 1)

  useEffect(() => {
    const checkoutDate = new Date(checkoutState)
    const checkinDate = new Date(checkinState)
    if (checkoutDate <= checkinDate) {
      const newCheckoutDate = new Date(checkinDate)
      newCheckoutDate.setDate(newCheckoutDate.getDate() + 1)
      setCheckout(newCheckoutDate.toISOString().split('T')[0])
    }
  }, [checkinState, checkoutState])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log({ checkin: checkinState, checkout: checkoutState, room: roomState, adult: adultState })
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-orange-500 border-b border-gray-200">
        <h2 className="text-2xl lg:text-3xl font-bold text-white">Booking Details</h2>
      </div>
      <form onSubmit={handleSubmit} className="px-6 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="checkin" className="block text-sm font-medium text-gray-700">Check-in</label>
            <input
              id="checkin"
              type="date"
              value={checkinState}
              onChange={(e) => setCheckin(e.target.value)}
              min={today}
              required
              className=" px-1 mt-1 block w-full rounded-md border-gray-400 border-2 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="checkout" className="block text-sm font-medium text-gray-700">Check-out</label>
            <input
              id="checkout"
              type="date"
              value={checkoutState}
              onChange={(e) => setCheckout(e.target.value)}
              min={new Date(checkinState).toISOString().split('T')[0]}
              required
              className=" px-1 mt-1 block w-full rounded-md border-gray-400 border-2 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="room" className="block text-sm font-medium text-gray-700">Rooms</label>
            <input
              id="room"
              type="number"
              value={roomState}
              onChange={(e) => setRoom(Math.max(1, parseInt(e.target.value)))}
              min={1}
              required
              className=" px-1 mt-1 block w-full rounded-md border-gray-400 border-2 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="adult" className="block text-sm font-medium text-gray-700">Adults</label>
            <input
              id="adult"
              type="number"
              value={adultState}
              onChange={(e) => setAdult(Math.max(1, parseInt(e.target.value)))}
              min={1}
              required
              className=" px-1 mt-1 block w-full rounded-md border-gray-400 border-2 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
        </div>
        <div className="mt-6">
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Update Booking
          </button>
        </div>
      </form>
    </div>
  )
}