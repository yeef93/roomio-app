import { useState } from "react";
import { signOut } from "next-auth/react";

const useLogout = (apiUrl: string, token: string) => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state for logout

  const handleLogoutClick = (e: any) => {
    e.preventDefault();
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = async () => {
    setIsLogoutModalOpen(false);
    setLoading(true); // Start loading
    try {
      const response = await fetch(`${apiUrl}/auth/logout`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include", // Include cookies
      });

      if (response.ok) {
        await signOut(); // Sign out from NextAuth session
        window.location.href = "/"; // Redirect after successful logout
      } else {
        console.error("Failed to logout");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return { isLogoutModalOpen, handleLogoutClick, handleLogoutConfirm, setIsLogoutModalOpen, loading };
};

export default useLogout;
