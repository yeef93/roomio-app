import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SideBar from "@/components/User/SideBar";
import Sidebar from "@/components/User/SideBar";
import type { Metadata } from "next";

export default function TeamsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className=" flex flex-row pt-24 pb-8 px-36 h-auto bg-gray-100">
        <SideBar />
        <div className="px-4 w-full">{children}</div>
      </div>
      <Footer />
    </>
  );
}
