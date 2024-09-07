"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import LogoutModal from "@/components/LogoutModal";
import { useSession, signOut } from "next-auth/react";
import {
  ArrowLeftStartOnRectangleIcon,
  ShoppingCartIcon,
  TicketIcon,
  UserIcon,
} from "@heroicons/react/16/solid";

function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("/assets/avatar.png"); // Default avatar
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    if (session) {
      const fetchUserData = async () => {
        try {
          const response = await fetch(`${apiUrl}/users/me`, {
            headers: {
              Authorization: `Bearer ${session.user.token}`,
            },
          });
          const data = await response.json();
          if (data.success) {
            setAvatarUrl(data.data.avatar?.imageUrl || "/assets/avatar.png"); // Use default if not available
            setFullName(data.data.firstname || "");
            setEmail(data.data.email|| "");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          window.location.href = "/";
        }
      };

      fetchUserData();
    }
  }, [session, apiUrl]);

  const handleLogoutClick = (e: any) => {
    e.preventDefault();
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = async () => {
    setIsLogoutModalOpen(false);
    try {
      const response = await fetch(`${apiUrl}/auth/logout`, {
        method: "GET", // Assuming POST method for logout
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
        },
        credentials: "include", // Include cookies
      });

      if (response.ok) {
        await signOut(); // Sign out from NextAuth session
        window.location.href = "/"; // Redirect to main page after successful logout
      } else {
        console.error("Failed to logout");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

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
    <div className=" w-96 bg-white h-auto p-6 border rounded-lg shadow-sm">
      <div className="flex flex-row items-center mb-5 gap-2">
        <div>
          <Image
            className="h-12 w-12 rounded-full"
            src={avatarUrl}
            alt={fullName || "User Avatar"}
            width={96}
            height={96}
          />
        </div>
        <div className="mt-2 text-center">
          <h4 className="font-semibold text-lg text-gray-700 capitalize font-poppins tracking-wide">
            {fullName}
          </h4>
          <p>{email}</p>
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
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
      />
    </div>
  );
}

export default Sidebar;
