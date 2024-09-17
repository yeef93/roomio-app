'use client'

import React, { useEffect, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import Image from "next/image"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

interface Room {
  id: number
  name: string
  description: string
  capacity: number
  size: number
  bedType: string
  totalBed: number
  qty: number
  basePrice: number
  totalBathroom: number
  isActive: boolean
  currentPrice: number | null
  actualPrice: number
}

interface PropertyDetails {
  id: number
  name: string
  description: string
  location: string
  city: string
  category: string
  tenant: {
    id: number
    email: string
    firstname: string
    lastname: string
    avatar: string
    createdAt: string
  }
  images: { id: number; imageUrl: string }[]
  rooms: Room[]
}

export default function PropertyDetail() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [property, setProperty] = useState<PropertyDetails | null>(null)
  const [loading, setLoading] = useState(true)


  const fullSlug = pathname.split("/").pop() || ""
  const id = fullSlug.split("-")[0]
  const checkin = searchParams.get('checkin')
  const checkout = searchParams.get('checkout')
  const room = searchParams.get('room')
  const adult = searchParams.get('adult')
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        console.log("Fetching property with ID:", id)
        const response = await fetch(`${apiUrl}/property/${id}`)
        const data = await response.json()
        if (data.success) {
          setProperty(data.data)
        } else {
          console.error("API returned unsuccessful response:", data)
        }
        setLoading(false)
      } catch (error) {
        console.error("Error fetching property details:", error)
        setLoading(false)
      }
    }

    if (id) {
      fetchPropertyDetails()
    }
  }, [id, apiUrl])

  if (loading) {
    return <div className="text-center py-10">Loading property details...</div>
  }

  if (!property) {
    return <div className="text-center py-10 text-red-600">Property not found</div>
  }

  return (
    <>
     <Header />
    <div className="max-w-4xl mx-auto py-20 p-4">
      <h1 className="text-3xl font-bold mb-4">{property.name}</h1>
      <p className="text-gray-600 mb-2">{property.description}</p>
      <p className="text-gray-600 mb-2">{property.location}, {property.city}</p>
      <p className="text-gray-600 mb-4">Category: {property.category}</p>
      
      <div className="flex items-center mb-6">
        <Image
          src={property.tenant.avatar}
          alt={property.tenant.firstname}
          width={50}
          height={50}
          className="rounded-full mr-4"
        />
        <p className="text-lg">Hosted by {property.tenant.firstname} {property.tenant.lastname}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {property.images.map((image) => (
          <Image
            key={image.id}
            src={image.imageUrl}
            alt={`Property image ${image.id}`}
            width={600}
            height={400}
            className="rounded-md"
          />
        ))}
      </div>

      <h2 className="text-2xl font-bold mb-4">Available Rooms</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {property.rooms.map((room) => (
          <div key={room.id} className="border p-4 rounded-md">
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

      <h2 className="text-2xl font-bold mt-8 mb-4">Booking Details</h2>
      <div className="grid grid-cols-2 gap-4">
        <p>Check-in: {checkin || 'Not specified'}</p>
        <p>Check-out: {checkout || 'Not specified'}</p>
        <p>Rooms: {room || 'Not specified'}</p>
        <p>Adults: {adult || 'Not specified'}</p>
      </div>
    </div>
    <Footer/>
    </>    
  )
}