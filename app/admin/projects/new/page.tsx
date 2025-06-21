// app/admin/projects/new/page.tsx

// Server Component for Authentication
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../../../api/auth/config';

// Import the Client Component
import ProjectWizard from '@/components/admin/ProjectWizard';

// Export the Server Component as the default export for the page
export default async function NewProjectPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  // Render the Client Component
  return <ProjectWizard />;
}