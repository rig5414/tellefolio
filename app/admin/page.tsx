// app/admin/page.tsx

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { Session } from 'next-auth';

interface ExtendedSession extends Session {
  user?: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions) as ExtendedSession;

  // If no session, redirect to sign-in page
  if (!session) {
    redirect('/auth/signin');
  }

  // Optional: Verify specific user based on environment variable
  if (session.user?.email !== process.env.ADMIN_USERNAME) {
    redirect('/auth/signin');
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>
      <p className="text-xl text-gray-600">Welcome, {session.user?.name || session.user?.email}!</p>
      <p className="mt-4 text-gray-500">This is your secure area to manage projects.</p>

      {/* Add admin navigation here later */}
      <div className="mt-8">
        <a href="/api/auth/signout" className="text-blue-600 hover:underline">Sign Out</a>
      </div>
    </div>
  );
}