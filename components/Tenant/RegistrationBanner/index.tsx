"use client";
import LogoutModal from "@/components/common/LogoutModal";
import LoginModal from "@/components/User/LoginModal";
import React, { useState } from "react";

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
    // setIsLogoutModalOpen(false);
    // try {
    //   const response = await fetch(`${apiUrl}/auth/logout`, {
    //     method: "GET", // Assuming POST method for logout
    //     headers: {
    //       Authorization: `Bearer ${session?.user.token}`,
    //     },
    //     credentials: "include", // Include cookies
    //   });

    //   if (response.ok) {
    //     await signOut(); // Sign out from NextAuth session
    //     window.location.href = "/"; // Redirect to main page after successful logout
    //   } else {
    //     console.error("Failed to logout");
    //   }
    // } catch (error) {
    //   console.error("Error logging out:", error);
    // }
  };

  return (
    <div className="flex justify-between items-center bg-blue-800 px-40 py-24 text-white">
      {/* Left Section: Text */}
      <div className="flex-1 pr-8">
        <h1 className="text-4xl font-bold">
          List your <br /> <span className="text-blue-400">apartment</span>
          <br /> on Roomio
        </h1>
        <p className="mt-4 text-lg">
          Whether hosting is your side passion or full-time job, <br/>list your home
          today and quickly start earning more income.
        </p>
      </div>

      {/* Right Section: Registration Box */}
      <div className="bg-white text-black rounded-lg shadow-lg p-6 max-w-md">
        <h2 className="text-2xl font-bold mb-4">Register for free</h2>
        <ul className="list-inside list-disc mb-6 space-y-2">
          <li>45% of hosts get their first booking within a week</li>
          <li>Choose between instant bookings and booking requests</li>
          <li>We handle payments for you</li>
        </ul>
        <button
          className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition"
          onClick={handleSignUpClick}
        >
          Get started now →
        </button>
      </div>
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
