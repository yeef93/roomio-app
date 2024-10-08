"use client";
import LogoutModal from "@/components/LogoutModal";
import React, { useState } from "react";
import LoginModal from "./LoginModal";

const RegistrationBanner = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleSignUpClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const handleLogoutConfirm = async () => {
    // Add your logout logic here.
  };

  return (
    <div className="flex flex-col lg:flex-row justify-between items-center bg-blue-800 px-8 lg:px-40 pt-40 pb-6 lg:py-24 text-white">
      {/* Left Section: Text */}
      <div className="flex-1 mb-8 lg:mb-0 pr-0 lg:pr-8 text-center lg:text-left">
        <h1 className="text-3xl lg:text-4xl font-bold">
          List your <br /> <span className="text-blue-400">apartment</span>
          <br /> on Roomio
        </h1>
        <p className="mt-4 text-base lg:text-lg">
          Whether hosting is your side passion or full-time job, <br className="hidden lg:block" />
          list your home today and quickly start earning more income.
        </p>
      </div>

      {/* Right Section: Registration Box */}
      <div className="bg-white text-black rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl lg:text-2xl font-bold mb-4">Register for free</h2>
        <ul className="list-inside list-disc mb-6 space-y-2 text-sm lg:text-base">
          <li>45% of hosts get their first booking within a week</li>
          <li>Choose between instant bookings and booking requests</li>
          <li>We handle payments for you</li>
        </ul>
        <button
          className="bg-blue-600 text-white font-bold py-2 px-4 rounded w-full hover:bg-blue-700 transition"
          onClick={handleSignUpClick}
        >
          Get started now →
        </button>
      </div>

      {/* Modals */}
      {isLoginModalOpen && (
        <LoginModal
          onClose={handleCloseLoginModal}
          onSuccess={() => setIsLoginModalOpen(false)}
        />
      )}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
      />
    </div>
  );
};

export default RegistrationBanner;