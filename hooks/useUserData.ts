import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface Avatar {
  id: number;
  imageName: string;
  imageUrl: string;
  user: string;
}

interface UserData {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  avatar: Avatar;
  birthdate: string | null;
  phonenumber: string | null;
  tenant: boolean;
}

export const useUserData = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchUserData = async () => {
      if (session) {
        try {
          const response = await fetch(`${apiUrl}/users/me`, {
            headers: {
              Authorization: `Bearer ${session.user.token}`, // Assuming you are storing the token in session
            },
          });
          const result = await response.json();

          if (response.ok) {
            setUserData(result.data); // Assuming the API response structure is correct
          } else {
            setError(result.statusMessage || "Failed to fetch user data");
          }
        } catch (err) {
          setError("Something went wrong. Please try again.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, [session, apiUrl]);

  return { userData, loading, error };
};


export default useUserData;
