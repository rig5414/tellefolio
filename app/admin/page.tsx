// app/admin/page.tsx

import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/config';
import { redirect } from 'next/navigation';
import { Session } from 'next-auth';
import AdminDashboardContent from './AdminDashboardContent';

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

  // At this point, session.user should be defined due to previous checks
  if (!session.user) {
    // Optionally, handle this edge case (should not occur)
    redirect('/auth/signin');
  }

  return <AdminDashboardContent user={session.user!} />;
}