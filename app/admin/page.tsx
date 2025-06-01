import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../api/auth/config';

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  // TODO: Fetch and display list of projects
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <p>Welcome to the admin dashboard. Project list will be displayed here.</p>
      {/* Link to add new project */}
      <div className="mt-4">
        <a href="/admin/projects/new" className="text-blue-600 hover:underline">Add New Project</a>
      </div>
    </div>
  );
} 