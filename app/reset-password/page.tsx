"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [validToken, setValidToken] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
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
  }, [token]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Error! Confirm Password Not Match");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
          confirmPassword,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        alert("Password successfully verified. User able to login.");
        router.push("/"); // Redirect to home
      } else {
        console.error(
          "Failed to reset password:",
          data.statusMessage || "Unknown error"
        );
        setError("Failed to reset password. Please try again.");
      }
    } catch (error) {
      console.error("Verification failed:", error);
      setError("Verification failed.");
    }
  };

  const resendForgotPassword = async () => {
    try {
      const response = await fetch(`${apiUrl}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Failed to send forgot password email");
      }

      alert("Forgot Password email resent. Please check your inbox.");
    } catch (error) {
      console.error("Error resending forgot password email:", error);
      alert("An error occurred while sending the forgot password email.");
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
        Reset Password Request.
        </h2>
        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
            {error}
          </div>
        )}
        {validToken === null && <p>Loading...</p>}
        {validToken === false && (
          <div>
            <p className="text-red-700 mb-4">Invalid or expired token.</p>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-4"
              required
            />
            <button
              onClick={resendForgotPassword}
              className="w-full bg-blue-500 text-white py-2 rounded"
            >
              Resend Verification Email
            </button>
          </div>
        )}
        {validToken === true && (
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-4"
              required
            />
            <input
              type="password"
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-4"
              required
            />
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 rounded"
            >
              Save
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;
