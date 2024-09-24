"use client";
import React, { useContext, useEffect, useState, useRef } from "react";
import Image from "next/image";
import MenuContext from "@/context/MenuContext";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import jwt, { JwtPayload } from "jsonwebtoken";
import LogoutModal from "@/components/LogoutModal";
import LoginModal from "./LoginModal";
import { ArrowLeftStartOnRectangleIcon, ChartBarIcon, HomeModernIcon, PresentationChartBarIcon, ShoppingCartIcon, StarIcon, TagIcon, TicketIcon, UserIcon } from "@heroicons/react/16/solid";

function Header() {
  const [showing, setShowing] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [userData, setUserData] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isTenant, setIsTenant] = useState<boolean>(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { setShowing: setGlobalMenuShowing } = useContext(MenuContext);
  const { data: session, status } = useSession();
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    if (session?.user?.token) {
      const decodedToken = jwt.decode(session?.user?.token || "") as JwtPayload | null;
      // Check if the token scope includes "tenant"
      if (decodedToken?.scope?.includes("ROLE_TENANT")) {
        setIsTenant(true);
      }
    }
  }, [session]);

  useEffect(() => {
    if (session && isTenant) {
      const fetchUserData = async () => {
        try {
          const response = await fetch(`${apiUrl}/users/me`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${session.user.token}`,
            },
            credentials: "include",
          });

          if (response.ok) {
            const json = await response.json();
            setUserData(json.data); // Store user data
          } else {
            console.error("Failed to fetch user data");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      fetchUserData();
    }
  }, [session, isTenant]);

  const handleClickButton = () => {
    setShowing((prev) => !prev);
    setGlobalMenuShowing();
  };

  const handleSignUpClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleCloseSignupModal = () => {
    setIsLoginModalOpen(false);
  };

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const handleAvatarClick = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleLogoutClick = (e: any) => {
    e.preventDefault();
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = async () => {
    setIsLogoutModalOpen(false);
    try {
      const response = await fetch(`${apiUrl}/auth/logout`, {
        method: "GET", // Assuming GET method for logout
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
        },
        credentials: "include",
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

  const handleOutsideClick = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isDropdownOpen]);

  return (
    <>
      <nav className="bg-white fixed w-full z-20 top-0 start-0 border-b border-gray-200">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a href="/" className="flex items-center space-x-3">
            <Image
              src="/assets/logo.png"
              width={32}
              height={32}
              alt="Roomio Logo"
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap text-indigo-600">
              Roomio
            </span>
          </a>
          <div className="flex md:order-2 space-x-3 md:space-x-0 relative">
            {status === "loading" ? (
              <span className="loader" />
            ) : session && isTenant && userData ? (
              <div className="relative group flex items-center justify-center">
                <Image
                  src={userData.avatar?.imageUrl || "/assets/avatar.png"}
                  width={32}
                  height={32}
                  alt="Tenant Avatar"
                  className="rounded-full border-2 w-8 h-8 cursor-pointer"
                  onClick={handleAvatarClick}
                />
                <span className="ml-2 text-gray-900">
                  {userData.firstname || userData.email}
                </span>
                {isDropdownOpen && (
                  <div
                    ref={dropdownRef}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-20"
                    style={{ top: "40px" }}
                  >
                    <a
                      href={`/tenant/profile`}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <UserIcon className="h-5 w-5 text-blue-500" />
                      <span>Profile</span>
                    </a>
                    <a
                      href="/tenant/dashboard"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <PresentationChartBarIcon className="h-5 w-5 text-blue-500" />
                      <span>Dashboard</span>
                    </a>
                    <a
                      href="/tenant/properties"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <HomeModernIcon className="h-5 w-5 text-blue-500" />
                      <span>Properties</span>
                    </a>
                    <a
                      href="/tenant/review"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <StarIcon className="h-5 w-5 text-blue-500" />
                      <span>Review</span>
                    </a>
                    <a
                      href="/tenant/sales"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <ChartBarIcon className="h-5 w-5 text-blue-500" />
                      <span>Sales</span>
                    </a>
                    <a
                      href="/tenant/category"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <TagIcon className="h-5 w-5 text-blue-500" />
                      <span>Category</span>
                    </a>
                    <a
                      onClick={handleLogoutClick}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <ArrowLeftStartOnRectangleIcon className="h-5 w-5 text-blue-500" />
                      <span>Logout</span>
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div className=" flex gap-2">
                <div className="flex items-center justify-center text-center text-sm h-full w-full">
                  Already a partner?
                </div>
                <button
                  type="button"
                  className="text-white bg-indigo-600 hover:text-gray-200 focus:ring-4 focus:outline-none focus:ring-indigo-600 font-medium rounded-lg text-sm px-4 py-2 text-center text-nowrap"
                  onClick={handleSignUpClick}
                >
                  Log In
                </button>
              </div>
            )}

            <button
              onClick={handleClickButton}
              data-collapse-toggle="navbar-sticky"
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
              aria-controls="navbar-sticky"
              aria-expanded={showing ? "true" : "false"}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
          </div>
          <div
            className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${
              showing ? "" : "hidden"
            }`}
            id="navbar-sticky"
          ></div>
        </div>
      </nav>
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
    </>
  );
}

export default Header;
