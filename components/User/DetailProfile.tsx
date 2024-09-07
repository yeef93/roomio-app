"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface User {
  firstname: string;
  lastname: string | null;
  email: string;
  avatarUrl: string;
  birthdate: string | null;
  phonenumber: string | null;
}

function DetailProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Fetch user data on component mount
  useEffect(() => {
    if (session) {
      const fetchUserData = async () => {
        try {
          const response = await fetch(`${apiUrl}/users/me`, {
            headers: {
              Authorization: `Bearer ${session.user.token}`,
            },
          });
          const data = await response.json();

          if (data.success) {
            const userData = data.data;
            setUser({
              firstname: userData.firstname,
              lastname: userData.lastname,
              email: userData.email,
              avatarUrl: userData.avatar?.imageUrl || "",
              birthdate: userData.birthdate,
              phonenumber: userData.phonenumber,
            });
          } else {
            setError("Failed to fetch user data.");
          }
        } catch (err) {
          setError("An error occurred while fetching data.");
        } finally {
          setLoading(false);
        }
      };
      fetchUserData();
    }
  }, []);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (user) {
      setUser({ ...user, [name]: value });
    }
  };

  // Form submission (add your update logic here)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", user);
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
        {user?.avatarUrl && (
          <img
            src={user.avatarUrl}
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
