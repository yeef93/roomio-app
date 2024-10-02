"use client"
import Tab from "@/components/Tab";
import PropertyDetail from "@/components/Tenant/PropertyDetail";
import { useRouter } from "next/navigation";

const DetailProperty = () => {
    const router = useRouter();


    const tabs = [
        { id: "detail", label: "Detail" },
        { id: "images", label: "Property Image" },
        { id: "facility", label: "Facility" },
        { id: "room", label: "Room" },
      ];
    
      const tabContent = [
        { id: "detail", content: <PropertyDetail/> },
        // { id: "security", content: <ChangePassword/> },
      ];
    
      return (
        <div className=" bg-white border rounded-lg shadow-sm p-4">
          <h1 className=" text-xl tracking-widest font-semibold">Property Detail</h1>
          <button
        onClick={() => router.push("/tenant/properties")}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Back to Properties
      </button>
          <Tab tabs={tabs} tabContent={tabContent} />
        </div>
      );
};

export default DetailProperty;