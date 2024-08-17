"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import jwt, { JwtPayload } from "jsonwebtoken";

function Menu() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const decodedToken = jwt.decode(
    session?.user?.token || ""
  ) as JwtPayload | null;

  const menuItems = [
    { name: "Events", path: "/events" },    
    // { name: "Create Event", path: `/organizer/${decodedToken?.scope.sub}/events` },
    { name: "FAQ", path: "/faq" },
  ];

  return (
    <ul
      className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 
           md:flex-row md:mt-0 md:border-0 md:bg-white"
    >
      {menuItems.map((item) => (
        <li key={item.path}>
          <Link
            href={item.path}
            className={`block py-2 px-3 text-gray-900 hover:bg-gray-100 md:hover:bg-transparent
              md:hover:text-purple-800 md:p-0 ${
                pathname === item.path ? " border-b border-purple-600" : ""
              }`}
          >
            {item.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default Menu;
