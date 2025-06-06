import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../api/auth/config';
import AdminDashboardClient from '@/components/admin/AdminDashboardClient';
import { Session } from 'next-auth';

export default async function AdminDashboardPage() {
  const session: Session | null = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  return <AdminDashboardClient session={session} />;
} 