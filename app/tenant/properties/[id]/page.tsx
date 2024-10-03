"use client";
import Tab from "@/components/Tab";
import PropertyDetail from "@/components/Tenant/PropertyDetail";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/16/solid";

const DetailProperty = () => {
  const router = useRouter();

  const tabs = [
    { id: "detail", label: "Detail" },
    { id: "images", label: "Property Image" },
    { id: "facility", label: "Facility" },
    { id: "room", label: "Room" },
  ];

  const tabContent = [
    { id: "detail", content: <PropertyDetail /> },
    // { id: "security", content: <ChangePassword/> },
  ];

  return (
    <div className=" bg-white border rounded-lg shadow-sm p-4">
      <div className=" flex justify-between">
      <h1 className=" text-xl tracking-widest font-semibold">
        Property Detail
      </h1>
      <button
        onClick={() => router.push("/tenant/properties")}
        className="px-4 py-2 text-blue-500 flex"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-1" />
        Back
      </button>
      </div>      
      <Tab tabs={tabs} tabContent={tabContent} />
    </div>
  );
};

export default DetailProperty;
