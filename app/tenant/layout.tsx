import Footer from "@/components/Footer";
import Header from "@/components/Tenant/Header";
import SideBar from "@/components/Tenant/SideBar";
import type { Metadata } from "next";

export default function TeamsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="flex flex-col md:flex-row pt-24 pb-8 px-4 h-auto bg-gray-100">
        <SideBar />
        <div className="w-full px-4">{children}</div>
      </div>
      <Footer />
    </>
  );
}
