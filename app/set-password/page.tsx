"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SetPassword() {
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { token } = router.query;

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/set-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      });

      if (response.ok) {
        alert('Password set successfully');
        router.push('/login');
      } else {
        console.error('Password setup error:', response.statusText);
      }
    } catch (error) {
      console.error('Password setup error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter new password"
        required
      />
      <button type="submit">Set Password</button>
    </form>
  );
}
