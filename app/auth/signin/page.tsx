// app/auth/signin/page.tsx

'use client'; // This component needs to be a client component

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function SignInPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false, // Don't redirect automatically
        username,
        password,
      });

      if (result?.error) {
        setError('Invalid credentials');
        console.error('Sign-in error:', result.error);
      } else if (result?.ok) {
        router.push('/admin'); // Redirect to the admin panel on success
        router.refresh(); // Refresh to update session state
      }
    } catch (err) {
      console.error('Sign-in exception:', err);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-light dark:bg-gradient-dark">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 relative">
          {/* Glass Card Effect */}
          <div className="glass dark:glass-dark rounded-xl p-8 animate-fade-in shadow-soft dark:shadow-soft-dark">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Admin Access
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Sign in to manage your portfolio
              </p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label htmlFor="username" className="sr-only">
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="appearance-none rounded-t-md relative block w-full px-3 py-2
                      dark:bg-dark-surface border dark:border-gray-700
                      placeholder-gray-500 dark:placeholder-gray-400
                      text-gray-900 dark:text-gray-100
                      focus:outline-none focus:ring-primary-light dark:focus:ring-dark-primary-light
                      focus:border-primary-light dark:focus:border-dark-primary-light
                      focus:z-10 sm:text-sm"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="appearance-none rounded-b-md relative block w-full px-3 py-2
                      dark:bg-dark-surface border dark:border-gray-700
                      placeholder-gray-500 dark:placeholder-gray-400
                      text-gray-900 dark:text-gray-100
                      focus:outline-none focus:ring-primary-light dark:focus:ring-dark-primary-light
                      focus:border-primary-light dark:focus:border-dark-primary-light
                      focus:z-10 sm:text-sm"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-md bg-red-50 dark:bg-red-900/30 p-4 animate-fade-in">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                        Error signing in
                      </h3>
                      <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                        <p>{error}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent
                    text-sm font-medium rounded-md text-white
                    bg-primary hover:bg-primary-dark
                    dark:bg-dark-primary dark:hover:bg-dark-primary-dark
                    focus:outline-none focus:ring-2 focus:ring-offset-2
                    focus:ring-primary dark:focus:ring-dark-primary
                    transition-colors duration-200
                    disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}