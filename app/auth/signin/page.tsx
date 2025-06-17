// app/auth/signin/page.tsx

'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import CircularLoader from '@/components/admin/CircularLoader';
import { ThemeToggle } from '@/components/admin/ThemeToggle';
import Image from 'next/image';

export default function SignInPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { resolvedTheme } = useTheme();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const result = await signIn('credentials', {
        redirect: false,
        username,
        password,
      });
      if (result?.error) {
        setError(result.error);
      } else if (result?.ok) {
        router.push('/admin');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
      console.error('Sign-in error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Blurred Next.js optimized background */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Image
          src="/images/adminbackground.jpg"
          alt="Admin Background"
          fill
          priority          className={`object-cover blur-md scale-105 ${
            resolvedTheme === 'dark' ? 'brightness-[0.7]' : 'brightness-[1.1]'
          }`}
        />
      </div>      {/* Theme toggle */}
      <div className="absolute top-6 right-8 z-20">
        <ThemeToggle />
      </div>
      {/* Dark overlay */}
      <div className={`absolute inset-0 ${resolvedTheme === 'dark' ? 'bg-[#232b3b]/80' : 'bg-blue-100/50'} z-0 transition-colors`} />
      {/* Centered loader and form, grouped visually */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
        <CircularLoader loading={isLoading}>
          <form
            onSubmit={handleSubmit}
            className={`flex flex-col gap-6 items-center rounded-2xl p-8 w-full transition-colors ${
              resolvedTheme === 'dark' 
                ? 'bg-[#232b3b]/80 shadow-[0_0_40px_0_#ffc30044]' 
                : 'bg-white/90 shadow-lg'
            }`}
          >            <h2 className={`text-3xl font-bold mb-2 text-center ${
              resolvedTheme === 'dark' ? 'text-[#FFC300]' : 'text-blue-600'
            }`}>Login</h2>
            <div className="w-full flex flex-col gap-4">
              <div className="relative">
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  className={`w-full rounded-md px-4 py-3 text-base pr-10 focus:outline-none focus:ring-2 ${
                    resolvedTheme === 'dark'
                      ? 'bg-[#232b3b] border-[#444] text-white placeholder-gray-400 focus:ring-[#FFC300]'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500'
                  }`}
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6zm2 0v.01L12 13l8-6.99V6H4zm16 2.236-7.447 6.51a2 2 0 0 1-2.106 0L4 8.236V18h16V8.236z"/></svg>
                </span>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className={`w-full rounded-md px-4 py-3 text-base pr-10 focus:outline-none focus:ring-2 ${
                    resolvedTheme === 'dark'
                      ? 'bg-[#232b3b] border-[#444] text-white placeholder-gray-400 focus:ring-[#FFC300]'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500'
                  }`}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm6-2a6 6 0 1 1-12 0 6 6 0 0 1 12 0zm-6-8a8 8 0 1 0 0 16 8 8 0 0 0 0-16z"/></svg>
                </span>
              </div>
            </div>
            {error && (
              <p className="text-center text-sm text-red-400">{error}</p>
            )}
            <button
              type="submit"
              disabled={isLoading}              className={`w-full py-3 rounded-md bg-[#FFC300] text-[#232b3b] font-bold text-lg shadow-md transition-all duration-200 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-[#FFC300] focus:ring-offset-2 disabled:opacity-60 ${isLoading ? 'shadow-[0_0_20px_0_#FFC300]' : ''}`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-[#232b3b]" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="#232b3b" strokeWidth="4" fill="none" /><path className="opacity-75" fill="#232b3b" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" /></svg>
                  Logging in...
                </span>
              ) : (
                'LOGIN'
              )}
            </button>
          </form>
        </CircularLoader>
      </div>
    </div>
  );
}