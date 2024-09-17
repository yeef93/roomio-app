import { useState } from "react";
import { DateRangePicker } from "react-date-range";
import { format } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";

const SearchBar = () => {
  const [guests, setGuests] = useState(3);
  const [rooms, setRooms] = useState(1);
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [dates, setDates] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const handleSelect = (ranges: any) => {
    setDates([ranges.selection]);
    setShowCalendar(false); // Close the calendar after selecting
  };

  const toggleCalendar = () => {
    // Close guest dropdown if it's open when calendar opens
    if (showGuestDropdown) {
      setShowGuestDropdown(false);
    }
    setShowCalendar(!showCalendar);
  };

  const toggleGuestDropdown = () => {
    // Close calendar if it's open when guest dropdown opens
    if (showCalendar) {
      setShowCalendar(false);
    }
    setShowGuestDropdown(!showGuestDropdown);
  };

  return (
    <div className="relative flex items-center space-x-2 p-4 bg-white shadow rounded-lg max-w-4xl mx-auto z-50">
      {/* Location Input */}
      <div className="flex-grow">
        <input
          type="text"
          placeholder="Search by city, hotel, or neighborhood"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Date Picker */}
      <div
        onClick={toggleCalendar}
        className="flex items-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer"
      >
        <span>
          {format(dates[0].startDate, "EEE, d MMM")} –{" "}
          {format(dates[0].endDate, "EEE, d MMM")}
        </span>
      </div>

      {/* Calendar Date Range Picker */}
      {showCalendar && (
        <div className="absolute top-16 left-0 z-50">
          <DateRangePicker
            ranges={dates}
            onChange={handleSelect}
            moveRangeOnFirstSelection={false}
            months={2}
            direction="horizontal"
            rangeColors={["#ff5a5f"]}
          />
        </div>
      )}

      {/* Room and Guest Selector */}
      <div className="relative">
        <div
          className="flex items-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer"
          onClick={toggleGuestDropdown}
        >
          <span>{`${rooms} Room, ${guests} Guests`}</span>
        </div>

        {showGuestDropdown && (
          <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-50">
            <div className="flex justify-between items-center mb-2">
              <span>Room 1</span>
              <div className="flex items-center">
                <button
                  onClick={() => setGuests(guests > 1 ? guests - 1 : 1)}
                  className="p-1 border rounded text-gray-600"
                >
                  -
                </button>
                <span className="mx-2">{guests}</span>
                <button
                  onClick={() => setGuests(guests + 1)}
                  className="p-1 border rounded text-gray-600"
                >
                  +
                </button>
              </div>
            </div>
            <button
              className="mt-2 py-1 px-4 bg-gray-200 text-gray-500 rounded-lg"
              disabled
            >
              Delete Room
            </button>
            <button
              onClick={() => setRooms(rooms + 1)}
              className="mt-2 py-1 px-4 bg-gray-200 text-green-600 rounded-lg"
            >
              Add Room
            </button>
          </div>
        )}
      </div>

      {/* Search Button */}
      
      <button className="bg-green-500 text-white px-6 py-2 rounded-lg flex items-center">
        <MagnifyingGlassIcon className="h-5 w-5 mr-1" />
        Search
      </button>
    </div>
  );
};

export default SearchBar;
