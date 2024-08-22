"use client";
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      // Redirect to your desired page after successful login
      router.push('/protected'); // Replace with your desired route
    }
  }, [status, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6">
          Start using <span className="text-gray-800">YourApp</span>
        </h1>
        <p className="text-center text-gray-600 mb-6">
          for yourself or your team
        </p>
        <button
          onClick={() => signIn('google')}
          className="w-full flex items-center justify-center bg-white text-gray-800 border border-gray-300 rounded-md py-2 mb-4 shadow-sm hover:bg-gray-50"
        >
          <img
            src="https://img.icons8.com/color/48/google-logo.png" 
            alt="Google Logo"
            className="w-5 h-5 mr-2"
          />
          Continue with Google
        </button>
        <div className="relative text-center mb-4">
          <span className="text-gray-500">OR</span>
        </div>
        <button
          onClick={() => signIn('facebook')}
          className="w-full flex items-center justify-center bg-blue-600 text-white rounded-md py-2 mb-4 shadow-sm hover:bg-blue-700"
        >
          <img
            src="https://img.icons8.com/color/48/facebook-new.png"
            alt="Facebook Logo"
            className="w-5 h-5 mr-2"
          />
          Continue with Facebook
        </button>
      </div>
    </div>
  );
}
