// pages/protected.tsx
"use client";
import { useSession, signIn } from 'next-auth/react';
import { useEffect } from 'react';

export default function ProtectedPage() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      signIn(); // Redirect to login page
    }
  }, [status]);

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Protected Page</h1>
      <p>Welcome, {session?.user?.email}</p>
    </div>
  );
}
