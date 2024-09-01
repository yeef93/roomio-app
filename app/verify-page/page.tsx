"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

function VerifyPage() {
  const router = useRouter();
  const query = new URLSearchParams(window.location.search);
  const token = query.get("token");
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
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/auth/verify`, {
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
        alert("Email successfully verified. User able to login.");
        router.push("/"); // Redirect to home
      } else {
        console.error(
          "Failed to verify email user:",
          data.statusMessage || "Unknown error"
        );
        alert("Failed to verify email. Please try again.");
      }
    } catch (error) {
      console.error("Verification failed:", error);
      alert("Verification failed.");
    }
  };

  const resendVerificationToken = async () => {
    try {
      const response = await fetch(`${apiUrl}/auth/resend-verification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Failed to resend verification email");
      }

      alert("Verification email resent. Please check your inbox.");
    } catch (error) {
      console.error("Error resending verification email:", error);
      alert("An error occurred while resending the verification email.");
    }
  };

  return (
    <div>
      {validToken === null && <p>Loading...</p>}
      {validToken === false && (
        <div>
          <p>Invalid or expired token.</p>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button onClick={resendVerificationToken}>
            Resend Verification Email
          </button>
        </div>
      )}
      {validToken === true && (
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit">Verify</button>
        </form>
      )}
    </div>
  );
}

export default VerifyPage;
