'use client';

import { signOut } from 'next-auth/react';

interface User {
  name?: string | null;
  email?: string | null;
}

export default function AdminDashboardContent({ user }: { user: User }) {
  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>
      <p className="text-xl text-gray-600">Welcome, {user.name || user.email}!</p>
      <p className="mt-4 text-gray-500">This is your secure area to manage projects.</p>

      <div className="mt-8">
        <button 
          onClick={handleSignOut}
          className="text-blue-600 hover:underline"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
