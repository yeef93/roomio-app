import Tab from "@/components/Tab";
import ChangePasswordForm from "@/components/User/ChangePasssword";
import DetailProfile from "@/components/User/DetailProfile";

function Profile() {
  const tabs = [
    { id: "detail", label: "Detail" },
    { id: "security", label: "Password & Security" },
  ];

  const tabContent = [
    { id: "detail", content: <DetailProfile/> },
    { id: "security", content: <ChangePasswordForm/> },
  ];

  return (
    <div className=" bg-white border rounded-lg shadow-sm">
      <h1 className=" text-xl p-4 tracking-widest font-semibold">Profile</h1>
      <Tab tabs={tabs} tabContent={tabContent} />
    </div>
  );
}

export default Profile;
