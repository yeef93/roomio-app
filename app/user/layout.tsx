import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SideBar from "@/components/User/SideBar";

export default function TeamsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="flex flex-col md:flex-row pt-24 pb-8 px-4 md:px-10 lg:px-36 h-auto bg-gray-100">
        <SideBar/>
        <div className="w-full px-4">{children}</div>
      </div>
      <Footer />
    </>
  );
}
