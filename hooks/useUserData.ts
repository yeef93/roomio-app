import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface Avatar {
  id: number;
  imageName: string;
  imageUrl: string;
  user: string;
}

export interface UserData {
  success: any;
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  avatar: Avatar;
  avatarId : number;
  birthdate: string | null;
  phonenumber: string | null;
  tenant: boolean;
  method: string | null;
}

export const useUserData = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;  

  const fetchUserData = async () => {
    if (session) {
      try {
        const response = await fetch(`${apiUrl}/users/me`, {
          headers: {
            Authorization: `Bearer ${session.user.token}`,
          },
        });
        const result = await response.json();

        if (response.ok) {
          setUserData(result.data);
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

  useEffect(() => {
    fetchUserData();
  }, [session, apiUrl]);

  const updateUserData = async (updatedData: Partial<UserData>): Promise<UserData> => {
    if (!session) {
      throw new Error("No active session");
    }


    try {
      const response = await fetch(`${apiUrl}/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.user.token}`,
        },
        body: JSON.stringify(updatedData),
      });

      const result = await response.json();

      if (response.ok) {
        setUserData(result.data);
        return result.data;
      } else {
        throw new Error(result.statusMessage || "Failed to update user data");
      }
    } catch (err) {
      setError("Failed to update user data. Please try again.");
      throw err;
    }
  };

  return { userData, loading, error, updateUserData, refetchUserData: fetchUserData };
};

export default useUserData;