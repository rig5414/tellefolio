import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/config';
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

export default async function AdminProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions) as ExtendedSession;

  if (!session || session.user?.email !== process.env.ADMIN_USERNAME) {
    redirect('/auth/signin');
  }

  return <>{children}</>;
}
