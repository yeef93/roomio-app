"use client";
import React, { useState, useEffect } from "react";
import useUserData, { UserData } from "@/hooks/useUserData";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import ChangeEmailForm from "./ChangeEmailForm";
import SuccessModal from "./SuccessModal";

// Utility function for formatting date
const formatDate = (dateString: string | null) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const DetailProfile: React.FC = () => {
  const { userData: initialUserData, loading, updateUserData } = useUserData();
  const [user, setUser] = useState<UserData | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const { data: session } = useSession();
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (initialUserData) {
      setUser({
        ...initialUserData,
        birthdate: formatDate(initialUserData.birthdate || ""),
      });
    }
  }, [initialUserData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => (prevUser ? { ...prevUser, [name]: value } : null));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
      ];
      const maxSize = 1 * 1024 * 1024; // 1MB

      if (!allowedTypes.includes(file.type)) {
        alert("Only JPG, JPEG, PNG, and GIF files are allowed.");
        e.target.value = ""; // Reset file input
        setAvatarFile(null);
      } else if (file.size > maxSize) {
        alert("Image size must be less than 1MB.");
        e.target.value = ""; // Reset file input
        setAvatarFile(null);
      } else {
        setAvatarFile(file);
        if (user) {
          setUser({
            ...user,
            avatar: {
              ...user.avatar,
              imageUrl: URL.createObjectURL(file),
            },
          });
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || isSubmitting) return;

    try {
      setIsSubmitting(true);
      let avatarId = user.avatar.id;

      if (avatarFile) {
        const formData = new FormData();
        formData.append("fileName", avatarFile.name);
        formData.append("file", avatarFile);

        const uploadResponse = await fetch(`${apiUrl}/users/me/image/upload`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session?.user.token}`,
          },
          body: formData,
        });
        const uploadData = await uploadResponse.json();

        if (uploadData.success) {
          avatarId = uploadData.data.id.toString();
        } else {
          throw new Error("Failed to upload avatar");
        }
      }

      const updatedUser: Partial<UserData> = {
        firstname: user.firstname,
        lastname: user.lastname,
        phonenumber: user.phonenumber,
        birthdate: user.birthdate,
        avatarId,
      };

      await updateUserData(updatedUser);
      // alert("Profile updated successfully!");
      setShowSuccessModal(true);
      setTimeout(async () => {}, 2000);
      window.location.reload();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleChangeEmail = async (
    currentPassword: string,
    newEmail: string
  ) => {
    try {
      const response = await fetch(`${apiUrl}/users/me/change-email`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.user.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newEmail,
        }),
      });
      const data = await response.json();
      if (data.success) {
        alert(
          "Request Change Email successfully, please check your new email to continue change email!"
        );
        setIsModalOpen(false);
        // Delay logout by 2 seconds to display the success message
        setTimeout(async () => {
          await signOut({ callbackUrl: "/" });
        }, 2000);
      } else {
        alert(data.statusMessage);
      }
    } catch (error) {
      console.error("Error changing email:", error);
      alert("Failed to change email. Please try again.");
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const numericValue = value.replace(/\D/g, '');
    setUser((prevUser) => (prevUser ? { ...prevUser, phonenumber: numericValue } : null));
  };

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>No user data available.</p>;

  return (
    <>
      <div className=" border-b-2">
        <h1 className=" text-xl">Public Profile</h1>
      </div>
      <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto pb-10">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            First Name
          </label>
          <input
            type="text"
            name="firstname"
            value={user.firstname}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Last Name
          </label>
          <input
            type="text"
            name="lastname"
            value={user.lastname}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="text"
            name="phonenumber"
            value={user.phonenumber || ""}
            onChange={handlePhoneChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Birthdate
          </label>
          <input
            type="date"
            name="birthdate"
            value={user.birthdate || ""}
            onChange={handleChange}
            max={new Date().toISOString().split("T")[0]}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Profile Picture
          </label>
          {user.avatar?.imageUrl && (
            <Image
              src={user.avatar?.imageUrl || "/assets/avatar.png"}
              alt="Profile avatar"
              className="w-20 h-20 rounded-full mb-2"
              width={200}
              height={200}
            />
          )}
          <input
            type="file"
            name="avatar"
            accept=".jpg,.jpeg,.png,.gif,image/jpeg,image/png,image/gif"
            className="mt-1 block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            onChange={handleFileChange}
          />
        </div>

        <button
          type="submit"
          className={`w-full px-4 py-2 text-white rounded-md ${
            isSubmitting ? "bg-gray-500" : "bg-blue-500 hover:bg-blue-600"
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Updating..." : "Update Profile"}
        </button>
      </form>

      <div className=" border-b-2">
        <h1 className=" text-xl">Account</h1>
      </div>
      <div className=" p-4 max-w-md mx-auto">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <div className="flex justify-between items-center">
            <input
              type="email"
              name="email"
              value={user.email}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
              disabled
            />
            {/* Conditionally render the "Change Email" button */}
            {user.method === "email" ? (
              <button
                onClick={handleOpenModal}
                className="text-blue-600 hover:underline"
              >
                Change Email
              </button>
            ) : (
              <p className="text-red-500 mt-4"></p>
            )}
          </div>
        </div>
        {/* Pass modal control to ChangeEmailForm */}
        {isModalOpen && (
          <ChangeEmailForm
            onSubmit={handleChangeEmail}
            onClose={handleCloseModal} // Pass the close modal function
          />
        )}

        {/* Render Success Modal */}
        {showSuccessModal && (
          <SuccessModal
            message="Profile updated successfully!"
            onClose={() => setShowSuccessModal(false)}
          />
        )}
      </div>
    </>
  );
};

export default DetailProfile;
