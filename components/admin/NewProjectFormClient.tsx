'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
    technologies: '', // Still using string for now
    projectStatus: 'In Progress', // Default to In Progress
    dateRange: '',
    isFeatured: false,
    displayOrder: 0,
  });

  const [activeTab, setActiveTab] = useState('basic-info'); // State for active tab

  const tabs = [
    { id: 'basic-info', label: 'Basic Info' },
    { id: 'descriptions', label: 'Descriptions' },
    { id: 'links-media', label: 'Links & Media' },
    { id: 'metadata', label: 'Metadata' },
    { id: 'technologies', label: 'Technologies' },
  ];

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
        const errorData = await response.json().catch(() => ({ message: 'Failed to create project.' }));
        throw new Error(errorData.message ?? 'Failed to create project.');
      }

      const newProject = await response.json();
      console.log('Project created:', newProject);

      alert('Project created successfully!');
      router.push('/admin');
      router.refresh();
    } catch (error) {
      console.error('Error creating project:', error);
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
    <div className="container mx-auto px-4 py-8 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">Add New Project</h1>
      
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
              }}
              className={
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500'
              }
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Tab Content */}
        {activeTab === 'basic-info' && (
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title *</label>
              <input type="text" name="title" id="title" required className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white sm:text-sm" value={formData.title} onChange={handleChange} />
            </div>

            <div>
              <label htmlFor="tagline" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tagline</label>
              <input type="text" name="tagline" id="tagline" className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white sm:text-sm" value={formData.tagline} onChange={handleChange} />
            </div>

            <div>
              <label htmlFor="projectStatus" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
              <select name="projectStatus" id="projectStatus" className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white sm:text-sm" value={formData.projectStatus} onChange={handleChange}>
                <option value="Planning">Planning</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

             <div className="flex items-center">
              <input type="checkbox" name="isFeatured" id="isFeatured" className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-blue-600 dark:checked:border-transparent" checked={formData.isFeatured} onChange={handleChange} />
              <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">Featured Project</label>
            </div>
          </div>
        )}

        {activeTab === 'descriptions' && (
          <div className="space-y-4">
            <div>
              <label htmlFor="problemStatement" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Problem Statement</label>
              <textarea name="problemStatement" id="problemStatement" rows={4} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white sm:text-sm" value={formData.problemStatement} onChange={handleChange} />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
              <input type="text" name="role" id="role" className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white sm:text-sm" value={formData.role} onChange={handleChange} />
            </div>

            <div>
              <label htmlFor="processDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Process Description</label>
              <textarea name="processDescription" id="processDescription" rows={6} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white sm:text-sm" value={formData.processDescription} onChange={handleChange} />
            </div>

            <div>
              <label htmlFor="solutionOutcome" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Solution Outcome</label>
              <textarea name="solutionOutcome" id="solutionOutcome" rows={4} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white sm:text-sm" value={formData.solutionOutcome} onChange={handleChange} />
            </div>

            <div>
              <label htmlFor="keyLearnings" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Key Learnings</label>
              <textarea name="keyLearnings" id="keyLearnings" rows={4} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white sm:text-sm" value={formData.keyLearnings} onChange={handleChange} />
            </div>
          </div>
        )}

        {activeTab === 'links-media' && (
           <div className="space-y-4">
            <div>
              <label htmlFor="liveLink" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Live Link</label>
              <input type="url" name="liveLink" id="liveLink" className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white sm:text-sm" value={formData.liveLink} onChange={handleChange} />
            </div>

            <div>
              <label htmlFor="githubLink" className="block text-sm font-medium text-gray-700 dark:text-gray-300">GitHub Link</label>
              <input type="url" name="githubLink" id="githubLink" className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white sm:text-sm" value={formData.githubLink} onChange={handleChange} />
            </div>

            <div>
              <label htmlFor="mainImageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Main Image URL</label>
              <input type="url" name="mainImageUrl" id="mainImageUrl" className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white sm:text-sm" value={formData.mainImageUrl} onChange={handleChange} />
            </div>

            <div>
              <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Video URL</label>
              <input type="url" name="videoUrl" id="videoUrl" className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white sm:text-sm" value={formData.videoUrl} onChange={handleChange} />
            </div>
          </div>
        )}

        {activeTab === 'metadata' && (
           <div className="space-y-4">
            <div>
              <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date Range</label>
              <input type="text" name="dateRange" id="dateRange" className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white sm:text-sm" value={formData.dateRange} onChange={handleChange} />
            </div>

             <div>
              <label htmlFor="displayOrder" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Display Order</label>
              <input type="number" name="displayOrder" id="displayOrder" className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white sm:text-sm" value={formData.displayOrder} onChange={handleChange} />
            </div>
           </div>
        )}

        {activeTab === 'technologies' && (
          <div className="space-y-4">
            <div>
              <label htmlFor="technologies" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Technologies (comma-separated)</label>
              <input type="text" name="technologies" id="technologies" className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white sm:text-sm" value={formData.technologies} onChange={handleChange} />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <button type="submit" disabled={isSubmitting} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
            {isSubmitting ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewProjectFormClient; 