"use client";
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

function VerifyPage (){
    const router = useRouter();
    const query = new URLSearchParams(window.location.search);
    const token = query.get('token');
    // console.log(token);
    const [validToken, setValidToken] = useState<boolean | null>(null); // Type explicitly defined as boolean or null
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e:any) => {
        e.preventDefault();
    
        if (password !== confirmPassword) {
          alert('Passwords do not match!');
          return;
        }
    
        try {
          const response = await fetch('http://localhost:3000/verify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              token,
              password,
            }),
          });
    
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
    
          const result = await response.text();
          alert(result);
        } catch (error) {
          console.error('Verification failed:', error);
          alert('Verification failed.');
        }
      };
    
      return (
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
      );
};

export default VerifyPage;
