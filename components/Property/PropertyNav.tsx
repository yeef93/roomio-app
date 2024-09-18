import { ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from "@heroicons/react/16/solid"
import { useEffect, useRef, useState } from "react"

const tabs = [
    'Info Umum',
    'Review',
    'Fasilitas Populer',
    'Lokasi',
    'Kebijakan Akomodasi',
    'Tentang',
    'Kamar'
  ]

  export default function PropertyNav() {
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
            tes
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
            tes
          </div>
          <button className="mt-4 text-blue-600 hover:underline">Lihat semua</button>
        </section>
  
        <section ref={facilitiesRefs} className="mt-12 pt-12">
          <h2 className="text-2xl font-bold mb-4">Fasilitas Populer</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            tes
          </div>
          <button className="mt-4 text-blue-600 hover:underline">Lihat semua</button>
        </section>
  
        <section ref={facilitiesReff} className="mt-12 pt-12">
          <h2 className="text-2xl font-bold mb-4">Fasilitas Populer</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            tes
          </div>
          <button className="mt-4 text-blue-600 hover:underline">Lihat semua</button>
        </section>
      </div>
    )
  }