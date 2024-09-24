"use client";
import React, { useState, useEffect } from "react";
import useUserData, { UserData } from "@/hooks/useUserData";
import { useSession } from "next-auth/react";

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
  const { userData: initialUserData, loading, error, updateUserData } = useUserData();
  const [user, setUser] = useState<UserData | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const { data: session } = useSession();
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [isSubmitting, setIsSubmitting] = useState(false); // Track submission state

  useEffect(() => {
    if (initialUserData) {
      setUser({
        ...initialUserData,
        birthdate: formatDate(initialUserData.birthdate || ""), // Convert birthdate
      });
    }
  }, [initialUserData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => prevUser ? { ...prevUser, [name]: value } : null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1 * 1024 * 1024) { // Check if file size exceeds 1MB
        alert("Image size must be less than 1MB.");
        setAvatarFile(null); // Reset file
      } else {
        alert(""); // Clear any previous error message
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
      setIsSubmitting(true); // Disable button upon submit
      let avatarId = user.avatar.id; // Use current avatar ID by default

      // If a new avatar is uploaded, upload the image first
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
          avatarId = uploadData.data.id.toString(); // Get new avatar ID
        } else {
          throw new Error("Failed to upload avatar");
        }
      }

      // Now update the user profile with the new/existing avatar ID
      const updatedUser: Partial<UserData> = {
        firstname: user.firstname,
        lastname: user.lastname,
        phonenumber: user.phonenumber,
        birthdate: user.birthdate,
        avatarId,
      };

      await updateUserData(updatedUser);
      alert("Profile updated successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false); // Re-enable button after submission completes
    }
  };

  if (loading) return <p>Loading...</p>;
  // if (error) return <p>{error}</p>;yy
  if (!user) return <p>No user data available.</p>;

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">First Name</label>
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
        <label className="block text-sm font-medium text-gray-700">Last Name</label>
        <input
          type="text"
          name="lastname"
          value={user.lastname}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          value={user.email}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          required
          disabled
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Phone Number</label>
        <input
          type="text"
          name="phonenumber"
          value={user.phonenumber || ""}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Birthdate</label>
        <input
          type="date"
          name="birthdate"
          value={user.birthdate || ""}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
        {user.avatar?.imageUrl && (
          <img
            src={user.avatar.imageUrl}
            alt="Profile avatar"
            className="w-20 h-20 rounded-full mb-2"
          />
        )}
        <input
          type="file"
          name="avatar"
          className="mt-1 block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          onChange={handleFileChange}
        />
      </div>

      <button
        type="submit"
        className={`w-full px-4 py-2 text-white rounded-md ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
};

export default DetailProfile;