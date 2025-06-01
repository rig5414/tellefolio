'use client';

import { useState } from 'react';
import { useRouter, redirect } from 'next/navigation';
// Remove server-side imports from client component
// import { getServerSession } from 'next-auth';
// import { redirect } from 'next/navigation';
// import { authOptions } from '../../api/auth/config';

// This is the client component containing the form and hooks
function NewProjectFormClient() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    tagline: '',
    problemStatement: '',
    role: '',
    processDescription: '',
    solutionOutcome: '',
    liveLink: '',
    githubLink: '',
    mainImageUrl: '',
    videoUrl: '',
    keyLearnings: '',
    technologies: '',
    projectStatus: 'In Progress',
    dateRange: '',
    isFeatured: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        // Attempt to read error message from response
        const errorData = await response.json().catch(() => ({ message: 'Failed to create project.' }));
        throw new Error(errorData.message || 'Failed to create project.');
      }

      // Project created successfully
      const newProject = await response.json();
      console.log('Project created:', newProject);

      // Redirect to a confirmation page or project list
      router.push('/admin'); // Example: Redirect to admin dashboard
      router.refresh(); // Refresh the router to potentially refetch data on the destination page
    } catch (error) {
      console.error('Error creating project:', error);
      // Display a user-friendly error message
      alert(`Error creating project: ${(error as Error).message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Add New Project</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title *
          </label>
          <input
            type="text"
            name="title"
            id="title"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="tagline" className="block text-sm font-medium text-gray-700">
            Tagline
          </label>
          <input
            type="text"
            name="tagline"
            id="tagline"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.tagline}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="problemStatement" className="block text-sm font-medium text-gray-700">
            Problem Statement
          </label>
          <textarea
            name="problemStatement"
            id="problemStatement"
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.problemStatement}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label htmlFor="liveLink" className="block text-sm font-medium text-gray-700">
              Live Link
            </label>
            <input
              type="url"
              name="liveLink"
              id="liveLink"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.liveLink}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="githubLink" className="block text-sm font-medium text-gray-700">
              GitHub Link
            </label>
            <input
              type="url"
              name="githubLink"
              id="githubLink"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={formData.githubLink}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="isFeatured"
            id="isFeatured"
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            checked={formData.isFeatured}
            onChange={handleChange}
          />
          <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-900">
            Feature this project
          </label>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  );
}

// This is the server component that handles authentication
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../api/auth/config';

export default async function NewProjectServerPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin'); // Usage of redirect from the top import
  }

  // Render the client component if authenticated
  return <NewProjectFormClient />;
}
