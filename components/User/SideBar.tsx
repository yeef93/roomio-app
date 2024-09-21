"use client";
import React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import LogoutModal from "@/components/LogoutModal";
import { useSession } from "next-auth/react";
import {
  ArrowLeftStartOnRectangleIcon,
  ShoppingCartIcon,
  TicketIcon,
  UserIcon,
} from "@heroicons/react/16/solid";
import {useUserData} from "@/hooks/useUserData";
import useLogout from "@/hooks/useLogout";

function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  // Ensure apiUrl is defined, or handle error
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiUrl) {
    throw new Error("API base URL is not defined in environment variables");
  }

  // Handle case where session is null or token is undefined
  const token = session?.user?.token || ""; // Fallback to empty string if no token
  const { userData, loading: userLoading } = useUserData();

  // Handle logout logic using the hook
  const {
    isLogoutModalOpen,
    handleLogoutClick,
    handleLogoutConfirm,
    setIsLogoutModalOpen,
    loading: logoutLoading,
  } = useLogout(apiUrl, token);

  const menuItems = [
    {
      href: `/user/profile`,
      label: "Profile",
      icon: UserIcon,
    },
    {
      href: `/user/purchase`,
      label: "Purchase List",
      icon: ShoppingCartIcon,
    },
    {
      href: `/user/booking`,
      label: "My Booking",
      icon: TicketIcon,
    },
  ];

  return (
    <div className="w-96 bg-white h-auto p-6 border rounded-lg shadow-sm md:w-1/4 mb-8 md:mb-0 ">
      <div className="flex items-center justify-center">
        <Image
          className=" h-14 w-14 rounded-full border"
          src={userData?.avatar?.imageUrl || "/assets/avatar.png"}
          alt={userData?.firstname || "User Avatar"}
          width={96}
          height={96}
        />
      </div>
      <div className="flex flex-row items-center mb-5 gap-2">
        <div className="mt-2 text-center">
          <h4 className="font-semibold text-lg text-gray-700 capitalize font-poppins tracking-wide">
            {userData?.firstname}
          </h4>
          <p>{userData?.email}</p>
        </div>
      </div>
      <ul className="space-y-2 text-sm border-t pt-4">
        {menuItems.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              className={`flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-3 text-gray-700 p-2 rounded-md font-medium ${
                pathname === item.href ? "bg-gray-200" : "hover:bg-gray-200"
              }`}
            >
              <span className="text-gray-600">
                <item.icon className="w-5 h-5 mr-1 text-blue-500" />
              </span>
              <span className="text-center sm:text-left">{item.label}</span>
            </a>
          </li>
        ))}
        <li>
          <button
            onClick={handleLogoutClick}
            className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-3 text-gray-700 p-2 rounded-md font-medium w-full text-left hover:bg-gray-200"
          >
            <span className="text-gray-600">
              <ArrowLeftStartOnRectangleIcon className="w-5 h-5 mr-1 text-blue-500" />
            </span>
            <span className="text-center sm:text-left">Logout</span>
          </button>
        </li>
      </ul>

      {/* Show loading indicator during logout */}
      {logoutLoading && (
        <p className="text-center text-sm text-gray-500">Logging out...</p>
      )}

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
      />
    </div>
  );
}

export default Sidebar;
