import { useEffect, useRef, useState } from "react";

const tabs = [
  "Overview",
  "Facilities",
  "Rooms",
  "Location",
  "Ratings and Reviews",
];

export default function PropertyNav() {
  const [activeTab, setActiveTab] = useState("Review");
  const [isSticky, setIsSticky] = useState(false);
  const navRef = useRef<HTMLElement>(null);

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
    <>
      <nav
        ref={navRef}
        className={`flex space-x-4 overflow-x-auto py-4 border-b bg-white ${
          isSticky ? "fixed top-16 left-0 right-0 z-10 px-4 sm:px-6 lg:px-8" : ""
        }`}
      >
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap ${
              activeTab === tab
                ? "bg-blue-100 text-blue-700"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>
      {isSticky && <div className="h-16"></div>} {/* Spacer for sticky nav */}
    </>
  );
}
