"use client";
import React, { useContext, useEffect, useState, useRef } from "react";
import Image from "next/image";
import Logo from "@/public/assets/logo.png";
import MenuContext from "@/context/MenuContext";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Menu from "./Menu";
import LoginModal from "../User/LoginModal";
import LogoutModal from "./LogoutModal";

function Header() {
  const [showing, setShowing] = useState<boolean>(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [userData, setUserData] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { setShowing: setGlobalMenuShowing } = useContext(MenuContext);
  const { data: session, status } = useSession();
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    if (session) {
      console.log(session);
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
            setUserData(json.data);
          } else {
            console.error("Failed to fetch user data");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      fetchUserData();
    }
  }, [session, apiUrl]);

  const handleClickButton = () => {
    setShowing((prev) => !prev);
    setGlobalMenuShowing();
  };

  const handleSignUpClick = () => {
    setIsLoginModalOpen(true);
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

  const handleLogoutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = async () => {
    setIsLogoutModalOpen(false);
    try {
      const response = await fetch(`${apiUrl}/auth/logout`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
        },
        credentials: "include",
      });

      if (response.ok) {
        await signOut();
        window.location.href = "/";
      } else {
        console.error("Failed to logout");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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
            <Image src={Logo} width={32} alt="Roomio Logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap text-indigo-800">
              Roomio
            </span>
          </a>
          <div className="flex md:order-2 space-x-3 md:space-x-0 relative">
            {status === "loading" ? (
              <span className="loader" />
            ) : status === "authenticated" && userData ? (
              <div className="relative group flex items-center justify-center">
                <Image
                  src={userData.avatar?.imageUrl || "/assets/avatar.png"}
                  width={32}
                  height={32}
                  alt="User Avatar"
                  className="rounded-full border-2 w-8 h-8 cursor-pointer"
                  onClick={handleAvatarClick}
                />
                <span className="ml-2 text-gray-900">{userData.firstname || userData.email}</span>
                {isDropdownOpen && (
                  <div
                    ref={dropdownRef}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-20"
                    style={{ top: "40px" }}
                  >
                    <a
                      href={`/users/${userData.email}/dashboard`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </a>
                    {userData.tenant === true && (
                      <a
                        href={`/organizer/${userData.email}/dashboard`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Organizer
                      </a>
                    )}
                    <button
                      onClick={handleLogoutClick}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  type="button"
                  className="text-gray-900 font-medium rounded-lg text-sm px-4 py-2 text-center"
                  onClick={handleLoginClick}
                >
                  Log in
                </button>
                <button
                  type="button"
                  className="text-white bg-indigo-800 hover:text-gray-200 focus:ring-4 focus:outline-none focus:ring-purple-800 font-medium rounded-lg text-sm px-4 py-2 text-center"
                  onClick={handleSignUpClick}
                >
                  Sign up
                </button>
              </>
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
                  strokeLinecap="round"
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
          >
            <Menu />
          </div>
        </div>
      </nav>
      {isSignupModalOpen && (
        <LoginModal
          onClose={handleCloseLoginModal}
          onSuccess={() => setIsLoginModalOpen(false)}
        />
      )}
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