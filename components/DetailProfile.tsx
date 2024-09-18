"use client";
import { useState } from "react";
import useUserData from "@/hooks/useUserData"; // Assuming the hook is located here

function DetailProfile() {
  const { userData: user, loading, error } = useUserData();
  const [updatedUser, setUpdatedUser] = useState(user); // Store the updated user information

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (updatedUser) {
      setUpdatedUser({ ...updatedUser, [name]: value });
    }
  };

  // Form submission (add your update logic here)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // console.log("Form submitted:", updatedUser);
    // Send updated data to the API (implement API update logic)
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          First Name
        </label>
        <input
          type="text"
          name="firstname"
          value={user?.firstname || ""}
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
          value={user?.lastname || ""}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          value={user?.email || ""}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          required
          disabled
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Phone Number
        </label>
        <input
          type="text"
          name="phonenumber"
          value={user?.phonenumber || ""}
          onChange={handleChange}
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
          value={user?.birthdate || ""}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Profile Picture
        </label>
        {user?.avatar?.imageUrl && (
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
          onChange={(e) => {
            // Handle file upload logic here
          }}
        />
      </div>

      <button
        type="submit"
        className="w-full px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        Save Changes
      </button>
    </form>
  );
}

export default DetailProfile;
