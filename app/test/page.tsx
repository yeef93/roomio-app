'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon, StarIcon } from '@heroicons/react/16/solid'

const tabs = [
  'Info Umum',
  'Review',
  'Fasilitas Populer',
  'Lokasi',
  'Kebijakan Akomodasi',
  'Tentang',
  'Kamar'
]

const reviews = [
  { id: 1, author: 'Haris Bashori', rating: 5, date: '6 Jul 2023', comment: 'Nice', image: '/placeholder.svg?height=100&width=100' },
  { id: 2, author: 'Ilham Rizky Satria', rating: 5, date: '29 Des 2022', comment: '' },
  { id: 3, author: 'Ahmad Vesuvio', rating: 5, date: '5 Jul 2022', comment: '', tripType: 'Trip Pasangan' }
]

const facilities = [
  { name: 'Kolam Renang', icon: '🏊‍♂️' },
  { name: 'WiFi', icon: '📶' },
  { name: 'Resepsionis 24 Jam', icon: '🏢' },
  { name: 'Mingguan/Bulanan', icon: '📅' },
  { name: 'TV', icon: '📺' },
  { name: 'Pengering Rambut', icon: '💨' },
  { name: 'Teras atau Balkon', icon: '🏠' },
  { name: 'Pembuat Kopi & Teh', icon: '☕' },
  { name: 'Kulkas', icon: '🧊' }
]

export default function PropertyDetails() {
  const [activeTab, setActiveTab] = useState('Review')
  const [isSticky, setIsSticky] = useState(false)
  const facilitiesRef = useRef<HTMLElement>(null)
  const facilitiesRefs = useRef<HTMLElement>(null)
  const facilitiesReff = useRef<HTMLElement>(null)
  const review = useRef<HTMLElement>(null)
  const navRef = useRef<HTMLElement>(null)

  const scrollToFacilities = () => {
    facilitiesRef.current?.scrollIntoView({ behavior: 'smooth' })
    setActiveTab('Fasilitas Populer')
  }

  useEffect(() => {
    if (activeTab === 'Fasilitas Populer') {
      scrollToFacilities()
    }
  }, [activeTab])

  useEffect(() => {
    const handleScroll = () => {
      if (navRef.current) {
        const navTop = navRef.current.getBoundingClientRect().top
        setIsSticky(navTop <= 0)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <nav 
        ref={navRef}
        className={`flex space-x-4 overflow-x-auto py-4 border-b bg-white ${
          isSticky ? 'fixed top-0 left-0 right-0 z-10 px-4 sm:px-6 lg:px-8' : ''
        }`}
      >
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap ${
              activeTab === tab
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>
      {isSticky && <div className="h-16"></div>} {/* Spacer for sticky nav */}

      <section  ref={review}  className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Review</h2>
          <a href="#" className="text-blue-600 hover:underline">Lihat semua</a>
        </div>
        <div className="flex items-baseline mb-4">
          <span className="text-4xl font-bold mr-2">4,4</span>
          <span className="text-xl text-gray-500">/5</span>
          <span className="ml-2 text-xl">Bagus</span>
          <span className="ml-2 text-gray-500">Dari 56 review</span>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <div key={review.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`h-5 w-5 ${
                        i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-gray-600">{review.rating}/5</span>
                </div>
                <span className="text-gray-500">{review.date}</span>
              </div>
              <p className="font-medium">{review.author}</p>
              {review.tripType && (
                <p className="text-gray-500 text-sm">{review.tripType}</p>
              )}
              {review.comment && <p className="mt-2">{review.comment}</p>}
              {review.image && (
                <div className="mt-2 relative">
                  <Image
                    src={review.image}
                    alt="Review image"
                    width={100}
                    height={100}
                    className="rounded-lg"
                  />
                  <span className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                    1 Foto
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-4">
          <button className="p-2 rounded-full bg-gray-100 mr-2">
            <ChevronDoubleLeftIcon className="h-5 w-5 text-gray-600" />
          </button>
          <button className="p-2 rounded-full bg-gray-100">
            <ChevronDoubleRightIcon className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </section>

      <section ref={facilitiesRef} className="mt-12 pt-12">
        <h2 className="text-2xl font-bold mb-4">Fasilitas Populer</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {facilities.map((facility) => (
            <div key={facility.name} className="flex items-center">
              <span className="text-2xl mr-2">{facility.icon}</span>
              <span>{facility.name}</span>
            </div>
          ))}
        </div>
        <button className="mt-4 text-blue-600 hover:underline">Lihat semua</button>
      </section>

      <section ref={facilitiesRefs} className="mt-12 pt-12">
        <h2 className="text-2xl font-bold mb-4">Fasilitas Populer</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {facilities.map((facility) => (
            <div key={facility.name} className="flex items-center">
              <span className="text-2xl mr-2">{facility.icon}</span>
              <span>{facility.name}</span>
            </div>
          ))}
        </div>
        <button className="mt-4 text-blue-600 hover:underline">Lihat semua</button>
      </section>

      <section ref={facilitiesReff} className="mt-12 pt-12">
        <h2 className="text-2xl font-bold mb-4">Fasilitas Populer</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {facilities.map((facility) => (
            <div key={facility.name} className="flex items-center">
              <span className="text-2xl mr-2">{facility.icon}</span>
              <span>{facility.name}</span>
            </div>
          ))}
        </div>
        <button className="mt-4 text-blue-600 hover:underline">Lihat semua</button>
      </section>
    </div>
  )
}