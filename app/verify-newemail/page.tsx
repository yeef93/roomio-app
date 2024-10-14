"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [validToken, setValidToken] = useState<boolean | null>(null);
  const [oldEmail, setOldEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await fetch(`${apiUrl}/auth/verify-token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const result = await response.json();

        if (result.success) {
          setValidToken(true);
        } else {
          setValidToken(false);
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        setValidToken(false);
      }
    };

    verifyToken();
  }, [token, apiUrl]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const response = await fetch(`${apiUrl}/auth/change-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
        currentEmail: oldEmail,  
        currentPassword: password, 
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        alert("Email successfully verified. You can now log in.");
        router.push("/"); // Redirect to home
      } else {
        console.error(
          "Failed to verify email user:",
          data.statusMessage || "Unknown error"
        );
        setError("Failed to verify email. Please try again.");
      }
    } catch (error) {
      console.error("Verification failed:", error);
      setError("Verification failed.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
        <div className="flex justify-center mb-6">
          <img
            src="/assets/logo.png"
            alt="Roomio Logo"
            className="h-12" // Adjust the height as needed
          />
        </div>
        <h2 className="text-xl font-semibold text-center mb-4">
          Verify your new email address
        </h2>
        <p className="text-center text-slate-700">
          Please enter your old email and current password to verify the change.
        </p>
        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
            {error}
          </div>
        )}
        {validToken === null && <p className=" text-center">Loading...</p>}
        {validToken === false && (
          <div>
            <p className="text-red-700 mb-4 text-center">
              Invalid or expired token, Please try again to change email!
            </p>
            <button
              className="w-full bg-blue-500 text-white py-2 rounded"
              onClick={() => router.push("/")} // Add onClick event to redirect
            >
              Back To Homepage
            </button>
          </div>
        )}

        {validToken === true && (
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Old Email Address"
              value={oldEmail}
              onChange={(e) => setOldEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-4"
              required
            />

            <input
              type="password"
              placeholder="Current Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-4"
              required
            />

            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 rounded"
            >
              Verify
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default VerifyPage;
