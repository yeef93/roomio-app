"use client";
import React, { useContext, useEffect, useState, useRef } from "react";
import Image from "next/image";
import MenuContext from "@/context/MenuContext";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Menu from "./Menu";
import LogoutModal from "./LogoutModal";
import {
  ArrowLeftStartOnRectangleIcon,
  ChevronDownIcon,
  ShoppingCartIcon,
  TicketIcon,
  UserIcon,
} from "@heroicons/react/16/solid";
import LoginModal from "./User/LoginModal";
import jwt, { JwtPayload } from "jsonwebtoken";

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
  const [isUser, setIsUser] = useState<boolean>(false);

  useEffect(() => {
    if (session?.user) {
      saveUserToBackend(session.user);
    }
  }, [session]);

  const saveUserToBackend = async (user: any) => {
    try {
      const response = await fetch(`${apiUrl}/auth/google-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          provider: "google",
          isTenant: false,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save user");
      }

      const data = await response.json();
      // Save token to local storage (or cookies for better security in production)
      localStorage.setItem("authToken", data.data.token);

      // Update user data state
      setUserData({
        ...user,
        token: data.data.token, // include the token
        role: data.data.role,
      });

      // // Display a welcome message
      // alert(data.data.message);
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken") || session?.user.token;
    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      const decodedToken = jwt.decode(token) as JwtPayload | null;
      if (decodedToken?.scope?.includes("ROLE_USER")) {
        setIsUser(true);
      } else {
        console.error("User does not have the required role");
      }
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }, [session]);

  useEffect(() => {
    if (session && isUser) {
      fetchUserData();
    }
  }, [session, isUser]);

  const fetchUserData = async () => {
    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch(`${apiUrl}/users/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

    const token = localStorage.getItem("authToken") || session?.user.token;
    if (!token) {
      console.error("No token found for logout");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/auth/logout`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Use localStorage or session token
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
      <nav className="bg-white fixed w-full z-20 top-0 start-0 border-b border-gray-200 shadow-sm">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a href="/" className="flex items-center space-x-3">
            <Image
              src="/assets/logo.png"
              width={32}
              height={32}
              alt="Roomio Logo"
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap text-indigo-800">
              Roomio
            </span>
          </a>
          <div className="flex md:order-2 space-x-3 md:space-x-0 relative">
            {status === "loading" ? (
              <span className="loader" />
            ) : status === "authenticated" && isUser && userData ? (
              <div className="relative group flex items-center justify-center">
                <div
                  className="flex flex-row justify-center items-center"
                  onClick={handleAvatarClick}
                >
                  <Image
                    src={userData.avatar?.imageUrl || "/assets/avatar.png"}
                    width={32}
                    height={32}
                    alt="User Avatar"
                    className="rounded-full border-2 w-8 h-8 cursor-pointer"
                  />
                  <span className="ml-2 text-gray-900">
                    {userData.firstname || userData.name || userData.email}
                  </span>
                  <ChevronDownIcon className="ml-1 h-5 w-5 text-gray-500" />
                </div>
                {isDropdownOpen && (
                  <div
                    ref={dropdownRef}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-20"
                    style={{ top: "40px" }}
                  >
                    <a
                      href={`/user/profile`}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <UserIcon className="h-5 w-5 text-blue-500" />
                      <span>Profile</span>
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
              <>
                <button
                  type="button"
                  className="text-gray-900 font-medium rounded-lg text-sm px-4 py-2 text-center"
                  onClick={handleLoginClick}
                >
                  Log In
                </button>
                <button
                  type="button"
                  className="text-white bg-indigo-800 hover:text-gray-200 focus:ring-4 focus:outline-none focus:ring-purple-800 font-medium rounded-lg text-sm px-4 py-2 text-center"
                  onClick={handleSignUpClick}
                >
                  Register
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
