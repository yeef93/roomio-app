import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

const useUserData = () => {
  const { data: session } = useSession();
  const [avatarUrl, setAvatarUrl] = useState("/assets/avatar.png");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true); // Loading state
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    if (session) {
      const fetchUserData = async () => {
        setLoading(true); // Start loading
        try {
          const response = await fetch(`${apiUrl}/users/me`, {
            headers: {
              Authorization: `Bearer ${session.user.token}`,
            },
          });
          const data = await response.json();
          if (data.success) {
            setAvatarUrl(data.data.avatar?.imageUrl || "/assets/avatar.png");
            setFullName(data.data.firstname || "");
            setEmail(data.data.email || "");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          window.location.href = "/";
        } finally {
          setLoading(false); // Stop loading
        }
      };

      fetchUserData();
    }
  }, [session, apiUrl]);

  return { avatarUrl, fullName, email, loading };
};

export default useUserData;
