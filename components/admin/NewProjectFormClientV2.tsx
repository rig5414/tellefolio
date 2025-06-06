"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import CircularLoader from "@/components/admin/CircularLoader";
import { ThemeToggle } from "@/components/admin/ThemeToggle";

export default function NewProjectFormClientV2() {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
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
    isFeatured: false,
    displayOrder: 0,
  });
  const [step, setStep] = useState(0);
  const steps = [
    'basic-info',
    'descriptions',
    'links-media',
    'metadata',
    'technologies',
  ];

  // Theme-based colors
  const bgColor = resolvedTheme === 'light' ? 'bg-blue-100' : 'bg-[#232b3b]';
  const cardBg = resolvedTheme === 'light' ? 'bg-white/90 border border-blue-200' : 'bg-[#232b3b]/90 border border-[#444]';
  const accent = resolvedTheme === 'light' ? '#2563eb' : '#FFC300';
  const textColor = resolvedTheme === 'light' ? 'text-blue-900' : 'text-gray-200';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to create project.' }));
        throw new Error(errorData.message ?? 'Failed to create project.');
      }
      await response.json();
      router.push('/admin');
      router.refresh();
    } catch (error) {
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

  // Step content
  const renderStep = () => {
    switch (steps[step]) {
      case 'basic-info':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className={`block text-sm font-medium ${textColor}`}>Title *</label>
              <input type="text" name="title" id="title" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[${accent}] focus:border-[${accent}] bg-white dark:bg-gray-800 sm:text-sm" value={formData.title} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="tagline" className={`block text-sm font-medium ${textColor}`}>Tagline</label>
              <input type="text" name="tagline" id="tagline" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[${accent}] focus:border-[${accent}] bg-white dark:bg-gray-800 sm:text-sm" value={formData.tagline} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="projectStatus" className={`block text-sm font-medium ${textColor}`}>Status</label>
              <select name="projectStatus" id="projectStatus" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[${accent}] focus:border-[${accent}] bg-white dark:bg-gray-800 sm:text-sm" value={formData.projectStatus} onChange={handleChange}>
                <option value="Planning">Planning</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div className="flex items-center">
              <input type="checkbox" name="isFeatured" id="isFeatured" className="h-4 w-4 text-[${accent}] border-gray-300 rounded focus:ring-2 focus:ring-[${accent}] bg-white dark:bg-gray-800 dark:border-gray-700 dark:checked:bg-[${accent}] dark:checked:border-transparent" checked={formData.isFeatured} onChange={handleChange} />
              <label htmlFor="isFeatured" className={`ml-2 block text-sm ${textColor}`}>Featured Project</label>
            </div>
          </div>
        );
      case 'descriptions':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-4">
              <div>
                <label htmlFor="problemStatement" className={`block text-sm font-medium ${textColor}`}>Problem Statement</label>
                <textarea name="problemStatement" id="problemStatement" rows={4} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[${accent}] focus:border-[${accent}] bg-white dark:bg-gray-800 sm:text-sm" value={formData.problemStatement} onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="role" className={`block text-sm font-medium ${textColor}`}>Role</label>
                <input type="text" name="role" id="role" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[${accent}] focus:border-[${accent}] bg-white dark:bg-gray-800 sm:text-sm" value={formData.role} onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="keyLearnings" className={`block text-sm font-medium ${textColor}`}>Key Learnings</label>
                <textarea name="keyLearnings" id="keyLearnings" rows={4} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[${accent}] focus:border-[${accent}] bg-white dark:bg-gray-800 sm:text-sm" value={formData.keyLearnings} onChange={handleChange} />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label htmlFor="processDescription" className={`block text-sm font-medium ${textColor}`}>Process Description</label>
                <textarea name="processDescription" id="processDescription" rows={6} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[${accent}] focus:border-[${accent}] bg-white dark:bg-gray-800 sm:text-sm" value={formData.processDescription} onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="solutionOutcome" className={`block text-sm font-medium ${textColor}`}>Solution Outcome</label>
                <textarea name="solutionOutcome" id="solutionOutcome" rows={4} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[${accent}] focus:border-[${accent}] bg-white dark:bg-gray-800 sm:text-sm" value={formData.solutionOutcome} onChange={handleChange} />
              </div>
            </div>
          </div>
        );
      case 'links-media':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="liveLink" className={`block text-sm font-medium ${textColor}`}>Live Link</label>
              <input type="url" name="liveLink" id="liveLink" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[${accent}] focus:border-[${accent}] bg-white dark:bg-gray-800 sm:text-sm" value={formData.liveLink} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="githubLink" className={`block text-sm font-medium ${textColor}`}>GitHub Link</label>
              <input type="url" name="githubLink" id="githubLink" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[${accent}] focus:border-[${accent}] bg-white dark:bg-gray-800 sm:text-sm" value={formData.githubLink} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="mainImageUrl" className={`block text-sm font-medium ${textColor}`}>Main Image URL</label>
              <input type="url" name="mainImageUrl" id="mainImageUrl" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[${accent}] focus:border-[${accent}] bg-white dark:bg-gray-800 sm:text-sm" value={formData.mainImageUrl} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="videoUrl" className={`block text-sm font-medium ${textColor}`}>Video URL</label>
              <input type="url" name="videoUrl" id="videoUrl" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[${accent}] focus:border-[${accent}] bg-white dark:bg-gray-800 sm:text-sm" value={formData.videoUrl} onChange={handleChange} />
            </div>
          </div>
        );
      case 'metadata':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="dateRange" className={`block text-sm font-medium ${textColor}`}>Date Range</label>
              <input type="text" name="dateRange" id="dateRange" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[${accent}] focus:border-[${accent}] bg-white dark:bg-gray-800 sm:text-sm" value={formData.dateRange} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="displayOrder" className={`block text-sm font-medium ${textColor}`}>Display Order</label>
              <input type="number" name="displayOrder" id="displayOrder" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[${accent}] focus:border-[${accent}] bg-white dark:bg-gray-800 sm:text-sm" value={formData.displayOrder} onChange={handleChange} />
            </div>
          </div>
        );
      case 'technologies':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="technologies" className={`block text-sm font-medium ${textColor}`}>Technologies (comma-separated)</label>
              <input type="text" name="technologies" id="technologies" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[${accent}] focus:border-[${accent}] bg-white dark:bg-gray-800 sm:text-sm" value={formData.technologies} onChange={handleChange} />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Navigation buttons
  const isLastStep = step === steps.length - 1;
  const isFirstStep = step === 0;

  return (
    <div className={`relative min-h-screen flex items-center justify-center ${bgColor} transition-all duration-700`}>
      {/* Theme toggle */}
      <div className="absolute top-6 right-8 z-20">
        <ThemeToggle />
      </div>
      <div className="absolute inset-0 w-full h-full z-0" />
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
        <CircularLoader loading={isSubmitting}>
          <div className={`flex flex-col items-center justify-center w-full max-w-xl gap-6 ${cardBg} rounded-2xl p-10 shadow-2xl transition-all duration-700`}>
            <h1 className={`text-3xl font-bold mb-6 text-center ${textColor}`}>Add New Project</h1>
            <form onSubmit={isLastStep ? handleSubmit : (e) => { e.preventDefault(); setStep(step + 1); }} className="space-y-6 w-full">
              {renderStep()}
              <div className="flex justify-between mt-8">
                {!isFirstStep && (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="inline-flex justify-center items-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[${accent}]"
                    disabled={isSubmitting}
                  >
                    Previous
                  </button>
                )}
                <div className="flex-1" />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white"
                  style={{ background: accent, opacity: isSubmitting ? 0.7 : 1 }}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" /><path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" /></svg>
                      {isLastStep ? 'Creating...' : 'Next'}
                    </span>
                  ) : (
                    isLastStep ? 'Create Project' : 'Next'
                  )}
                </button>
              </div>
            </form>
          </div>
        </CircularLoader>
      </div>
    </div>
  );
} 