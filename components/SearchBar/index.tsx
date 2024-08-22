"use client";
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { Popover, Transition } from '@headlessui/react';
import { CalendarIcon, UserIcon, MapPinIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import "react-datepicker/dist/react-datepicker.css";

const locations = ['New York', 'London', 'Paris', 'Tokyo', 'Sydney'];

function SearchBar () {
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [pets, setPets] = useState(0);

  const handleSearch = () => {
    console.log('Searching for:', { destination, checkIn, checkOut, adults, children, infants, pets });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center bg-white rounded-full shadow-lg">
        <Popover className="flex-1 relative">
          <Popover.Button className="w-full text-left p-4">
            <div className="flex items-center">
              <MapPinIcon className="h-5 w-5 text-gray-400 mr-2" />
              <div>
                <div className="font-medium">Where</div>
                <div className="text-sm text-gray-500">{destination || 'Search destinations'}</div>
              </div>
            </div>
          </Popover.Button>
          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Popover.Panel className="absolute z-10 w-full mt-2 bg-white shadow-lg rounded-md">
              <div className="p-2">
                {locations.map((location) => (
                  <div
                    key={location}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setDestination(location);
                    }}
                  >
                    {location}
                  </div>
                ))}
              </div>
            </Popover.Panel>
          </Transition>
        </Popover>

        <div className="flex-1 p-4 border-l border-gray-200">
          <div className="font-medium">Check in</div>
          <DatePicker
            selected={checkIn || undefined} // Convert null to undefined
            onChange={(date) => setCheckIn(date)}
            selectsStart
            startDate={checkIn || undefined}
            endDate={checkOut || undefined}
            placeholderText="Add dates"
            className="w-full border-0 focus:ring-0"
          />
        </div>

        <div className="flex-1 p-4 border-l border-gray-200">
          <div className="font-medium">Check out</div>
          <DatePicker
            selected={checkOut || undefined} // Convert null to undefined
            onChange={(date) => setCheckOut(date)}
            selectsEnd
            startDate={checkIn || undefined}
            endDate={checkOut || undefined}
            minDate={checkIn || undefined}
            placeholderText="Add dates"
            className="w-full border-0 focus:ring-0"
          />
        </div>

        <Popover className="flex-1 relative">
          <Popover.Button className="w-full text-left p-4 border-l border-gray-200">
            <div className="flex items-center">
              <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
              <div>
                <div className="font-medium">Who</div>
                <div className="text-sm text-gray-500">Add guests</div>
              </div>
            </div>
          </Popover.Button>
          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Popover.Panel className="absolute z-10 w-72 right-0 mt-2 bg-white shadow-lg rounded-md">
              <div className="p-4">
                <GuestSelector label="Adults" value={adults} onChange={setAdults} />
                <GuestSelector label="Children" value={children} onChange={setChildren} />
                <GuestSelector label="Infants" value={infants} onChange={setInfants} />
                <GuestSelector label="Pets" value={pets} onChange={setPets} />
              </div>
            </Popover.Panel>
          </Transition>
        </Popover>

        <div className="p-4">
          <button
            onClick={handleSearch}
            className="bg-indigo-500 text-white px-4 py-2 rounded-full hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-opacity-50 flex items-center"
          >
            <MagnifyingGlassIcon className="h-5 w-5 mr-1" />
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

interface GuestSelectorProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

const GuestSelector: React.FC<GuestSelectorProps> = ({ label, value, onChange }) => {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <div className="font-medium">{label}</div>
        <div className="text-sm text-gray-500">{label === 'Infants' ? 'Under 2' : label === 'Children' ? 'Ages 2-12' : 'Ages 13 or above'}</div>
      </div>
      <div className="flex items-center">
        <button
          onClick={() => onChange(Math.max(0, value - 1))}
          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
        >
          -
        </button>
        <span className="mx-2">{value}</span>
        <button
          onClick={() => onChange(value + 1)}
          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
