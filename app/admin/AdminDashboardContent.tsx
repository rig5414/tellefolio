'use client';

import { signOut } from 'next-auth/react';
import { useState } from 'react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';

interface User {
  name?: string | null;
  email?: string | null;
}

export default function AdminDashboardContent({ user }: { user: User }) {
  const [activeTab, setActiveTab] = useState('projects');

  const handleSignOut = async () => {
    await signOut({ 
      callbackUrl: '/',
      redirect: true 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-light dark:bg-gradient-dark transition-colors duration-300">
      {/* Top Navigation Bar */}
      <nav className="bg-surface dark:bg-dark-surface shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-600 dark:text-gray-300">
                Welcome, {user.name || user.email}
              </span>
              <ThemeToggle />
              <button 
                onClick={handleSignOut}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('projects')}
              className={`${
                activeTab === 'projects'
                  ? 'border-primary-light dark:border-dark-primary-light text-primary-light dark:text-dark-primary-light'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              } whitespace-nowrap pb-4 px-1 border-b-2 font-medium transition-colors duration-200`}
            >
              Projects
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`${
                activeTab === 'settings'
                  ? 'border-primary-light dark:border-dark-primary-light text-primary-light dark:text-dark-primary-light'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              } whitespace-nowrap pb-4 px-1 border-b-2 font-medium transition-colors duration-200`}
            >
              Settings
            </button>
          </nav>
        </div>

        {/* Projects Tab Content */}
        {activeTab === 'projects' && (
          <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Projects
              </h2>
              <Link
                href="/admin/projects/new"
                className="bg-primary hover:bg-primary-dark dark:bg-dark-primary dark:hover:bg-dark-primary-dark
                  text-white px-4 py-2 rounded-md transition-colors duration-200"
              >
                Add New Project
              </Link>
            </div>

            {/* Projects Table */}
            <div className="bg-surface dark:bg-dark-surface rounded-lg shadow-soft dark:shadow-soft-dark">
              <div className="px-4 py-5 sm:p-6">
                <p className="text-gray-500 dark:text-gray-400">Loading projects...</p>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab Content */}
        {activeTab === 'settings' && (
          <div className="bg-surface dark:bg-dark-surface rounded-lg shadow-soft dark:shadow-soft-dark animate-fade-in">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Account Settings
              </h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Additional settings will be added here.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
