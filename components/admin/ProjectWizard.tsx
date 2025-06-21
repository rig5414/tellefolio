"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useSession } from "next-auth/react";
import Image from "next/image";

// Extend the Session type to include githubAccessToken
declare module "next-auth" {
  interface Session {
    githubAccessToken?: string;
  }
}
import CircularLoader from "@/components/admin/CircularLoader";
import { ThemeToggle } from "@/components/admin/ThemeToggle";

// Define a minimal GitHub repo type
interface GitHubRepo {
  id: number;
  name: string;
  description?: string;
}

export default function ProjectWizard() {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const { data: session, status } = useSession();
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
  const [importType, setImportType] = useState<"manual" | "github" | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[] | null>(null);
  const [reposLoading, setReposLoading] = useState(false);
  const [reposError, setReposError] = useState<string | null>(null);
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null);
  const [productionUrl, setProductionUrl] = useState("");
  const [screenshots, setScreenshots] = useState<File[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState<number | null>(null);
  // AI analysis state
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiTriggered, setAiTriggered] = useState(false);
  const steps = [
    'basic-info',
    'descriptions',
    'links-media',
    'metadata',
    'technologies',
  ];

  // Theme-based colors and styles
  const bgColor = resolvedTheme === 'light' ? 'bg-blue-100' : 'bg-[#232b3b]';
  const cardBg = resolvedTheme === 'light' ? 'bg-white/90 border border-blue-200' : 'bg-[#232b3b]/90 border border-[#444]';
  const inputClass = `mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 sm:text-sm ${
    resolvedTheme === 'light'
      ? 'bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500'
      : 'bg-[#232b3b] border-[#444] focus:ring-[#FFC300] focus:border-[#FFC300]'
  }`;
  const headingColor = resolvedTheme === "light" ? "text-blue-700" : "text-yellow-400";

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

  // Fetch repos if authenticated and on GitHub import step
  useEffect(() => {
    if (importType === "github" && step === 1 && session?.githubAccessToken) {
      setReposLoading(true);
      fetch("/api/github/repos")
        .then((res) => res.json())
        .then((data) => {
          setRepos(data);
          setReposLoading(false);
        })
        .catch(() => {
          setReposError("Failed to fetch repositories");
          setReposLoading(false);
        });
    }
  }, [importType, step, session]);

  // Always call useEffect at the top level
  useEffect(() => {
    if (
      step === 3 &&
      importType === "github" &&
      selectedRepo &&
      productionUrl &&
      !formData.title &&
      !aiLoading &&
      !aiError &&
      !aiTriggered
    ) {
      setAiLoading(true);
      setAiTriggered(true);
      fetch("/api/ai/analyze-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productionUrl, repo: selectedRepo }),
      })
        .then((res) => res.json())
        .then((data) => {
          setFormData((prev) => ({
            ...prev,
            title: data.title || "",
            tagline: data.tagline || "",
            problemStatement: data.description || "",
            technologies: data.technologies || "",
          }));
          setAiLoading(false);
        })
        .catch(() => {
          setAiError("AI analysis failed. Please try again.");
          setAiLoading(false);
        });
    }
  }, [step, importType, selectedRepo, productionUrl, formData.title, aiLoading, aiError, aiTriggered]);

  // Step content
  const renderStep = () => {
    switch (steps[step]) {
      case 'basic-info':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className={`block text-sm font-medium ${resolvedTheme === 'light' ? 'text-blue-900' : 'text-gray-200'}`}>Project Title *</label>
              <input type="text" name="title" id="title" required className={inputClass} value={formData.title} onChange={handleChange} placeholder="e.g. Tellefolio" />
            </div>
            <div>
              <label htmlFor="tagline" className={`block text-sm font-medium ${resolvedTheme === 'light' ? 'text-blue-900' : 'text-gray-200'}`}>Short Tagline</label>
              <input type="text" name="tagline" id="tagline" className={inputClass} value={formData.tagline} onChange={handleChange} placeholder="e.g. AI-powered portfolio builder" />
            </div>
            <div>
              <label htmlFor="dateRange" className={`block text-sm font-medium ${resolvedTheme === 'light' ? 'text-blue-900' : 'text-gray-200'}`}>Date Range</label>
              <input type="text" name="dateRange" id="dateRange" className={inputClass} value={formData.dateRange} onChange={handleChange} placeholder="e.g. Oct 2024 - April 2025" />
            </div>
            <div>
              <label htmlFor="projectStatus" className={`block text-sm font-medium ${resolvedTheme === 'light' ? 'text-blue-900' : 'text-gray-200'}`}>Status</label>
              <select name="projectStatus" id="projectStatus" className={inputClass} value={formData.projectStatus} onChange={handleChange}>
                <option value="Planning">Planning</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div className="flex items-center">
              <input type="checkbox" name="isFeatured" id="isFeatured" className={`h-4 w-4 rounded focus:ring-2 ${resolvedTheme === 'light' ? 'bg-white border-gray-300 text-blue-500 focus:ring-blue-500' : 'bg-[#232b3b] border-[#444] text-[#FFC300] focus:ring-[#FFC300]'}`} checked={formData.isFeatured} onChange={handleChange} />
              <label htmlFor="isFeatured" className={`ml-2 block text-sm ${resolvedTheme === 'light' ? 'text-blue-900' : 'text-gray-200'}`}>Featured Project</label>
            </div>
            <div>
              <label htmlFor="displayOrder" className={`block text-sm font-medium ${resolvedTheme === 'light' ? 'text-blue-900' : 'text-gray-200'}`}>Display Order</label>
              <input type="number" name="displayOrder" id="displayOrder" className={inputClass} value={formData.displayOrder} onChange={handleChange} min={0} />
            </div>
          </div>
        );
      case 'descriptions':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="problemStatement" className={`block text-sm font-medium ${resolvedTheme === 'light' ? 'text-blue-900' : 'text-gray-200'}`}>Problem Statement</label>
              <textarea name="problemStatement" id="problemStatement" rows={3} className={inputClass} value={formData.problemStatement} onChange={handleChange} placeholder="What problem does this project solve?" />
            </div>
            <div>
              <label htmlFor="processDescription" className={`block text-sm font-medium ${resolvedTheme === 'light' ? 'text-blue-900' : 'text-gray-200'}`}>Process Description</label>
              <textarea name="processDescription" id="processDescription" rows={3} className={inputClass} value={formData.processDescription} onChange={handleChange} placeholder="How did you approach the project?" />
            </div>
            <div>
              <label htmlFor="solutionOutcome" className={`block text-sm font-medium ${resolvedTheme === 'light' ? 'text-blue-900' : 'text-gray-200'}`}>Solution Outcome</label>
              <textarea name="solutionOutcome" id="solutionOutcome" rows={3} className={inputClass} value={formData.solutionOutcome} onChange={handleChange} placeholder="What was the result or impact?" />
            </div>
            <div>
              <label htmlFor="role" className={`block text-sm font-medium ${resolvedTheme === 'light' ? 'text-blue-900' : 'text-gray-200'}`}>Your Role</label>
              <input type="text" name="role" id="role" className={inputClass} value={formData.role} onChange={handleChange} placeholder="e.g. Lead Developer, Designer" />
            </div>
            <div>
              <label htmlFor="keyLearnings" className={`block text-sm font-medium ${resolvedTheme === 'light' ? 'text-blue-900' : 'text-gray-200'}`}>Key Learnings</label>
              <textarea name="keyLearnings" id="keyLearnings" rows={2} className={inputClass} value={formData.keyLearnings} onChange={handleChange} placeholder="What did you learn? (optional)" />
            </div>
          </div>
        );
      case 'links-media':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="liveLink" className={`block text-sm font-medium ${resolvedTheme === 'light' ? 'text-blue-900' : 'text-gray-200'}`}>Live Link</label>
              <input type="url" name="liveLink" id="liveLink" className={inputClass} value={formData.liveLink} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="githubLink" className={`block text-sm font-medium ${resolvedTheme === 'light' ? 'text-blue-900' : 'text-gray-200'}`}>GitHub Link</label>
              <input type="url" name="githubLink" id="githubLink" className={inputClass} value={formData.githubLink} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="mainImageUrl" className={`block text-sm font-medium ${resolvedTheme === 'light' ? 'text-blue-900' : 'text-gray-200'}`}>Main Image URL</label>
              <input type="url" name="mainImageUrl" id="mainImageUrl" className={inputClass} value={formData.mainImageUrl} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="videoUrl" className={`block text-sm font-medium ${resolvedTheme === 'light' ? 'text-blue-900' : 'text-gray-200'}`}>Video URL</label>
              <input type="url" name="videoUrl" id="videoUrl" className={inputClass} value={formData.videoUrl} onChange={handleChange} />
            </div>
          </div>
        );
      case 'metadata':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="dateRange" className={`block text-sm font-medium ${resolvedTheme === 'light' ? 'text-blue-900' : 'text-gray-200'}`}>Date Range</label>
              <input type="text" name="dateRange" id="dateRange" className={inputClass} value={formData.dateRange} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="displayOrder" className={`block text-sm font-medium ${resolvedTheme === 'light' ? 'text-blue-900' : 'text-gray-200'}`}>Display Order</label>
              <input type="number" name="displayOrder" id="displayOrder" className={inputClass} value={formData.displayOrder} onChange={handleChange} />
            </div>
          </div>
        );
      case 'technologies':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="technologies" className={`block text-sm font-medium ${resolvedTheme === 'light' ? 'text-blue-900' : 'text-gray-200'}`}>Technologies (comma-separated)</label>
              <input type="text" name="technologies" id="technologies" className={inputClass} value={formData.technologies} onChange={handleChange} />
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

  // Step 1: Choose import type
  if (step === 0) {
    // Theme and accent logic (copied from AdminDashboardClient)
    const bgImage = resolvedTheme === "light" ? "/images/adminbackground1.jpg" : "/images/adminbackground.jpg";
    const overlayColor = resolvedTheme === "light" ? "bg-blue-100/80" : "bg-[#232b3b]/80";
    const cardBg = resolvedTheme === "light" ? "bg-blue-50/90 border border-blue-200" : "bg-[#232b3b]/90 border border-[#444]";
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Blurred background image */}
        <div className="absolute inset-0 w-full h-full z-0 transition-all duration-700">
          <Image
            src={bgImage}
            alt="Admin Background"
            fill
            priority
            className={
              `object-cover blur-md scale-105 transition-all duration-700 ` +
              (resolvedTheme === "light" ? "brightness-105" : "brightness-70")
            }
          />
        </div>
        {/* Overlay */}
        <div className={`absolute inset-0 ${overlayColor} z-0 transition-all duration-700`} />
        {/* Theme toggle */}
        <div className="absolute top-6 right-8 z-20">
          <ThemeToggle />
        </div>
        {/* Centered card with loader wrapper */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
          <CircularLoader loading={isSubmitting}>
            <div className={`flex flex-col items-center justify-center w-full max-w-md gap-8 ${cardBg} rounded-2xl p-10 shadow-2xl transition-all duration-700`}>
              <h2 className={`text-4xl font-extrabold mb-2 text-center drop-shadow ${headingColor}`}>Add New Project</h2>
              <div className="flex flex-col gap-4 w-full">
                <button
                  className="flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold shadow-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300"
                  onClick={() => { setImportType('manual'); setStep(1); }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                  Enter Manually
                </button>
                <button
                  className="flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-gray-800 hover:bg-gray-900 text-white text-lg font-semibold shadow-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-gray-400"
                  onClick={() => { setImportType('github'); setStep(1); }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 8a6 6 0 01-12 0C4 5.79 5.79 4 8 4s4 1.79 4 4a6 6 0 01-12 0" /></svg>
                  Import from GitHub
                </button>
              </div>
            </div>
          </CircularLoader>
        </div>
      </div>
    );
  }

  // Step 2: GitHub import logic
  if (step === 1 && importType === "github") {
    if (status === "loading") {
      return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div className={`flex flex-col items-center justify-center w-full max-w-md gap-8 ${cardBg} rounded-2xl p-10 shadow-2xl transition-all duration-700 mt-12`}>
            <span className="text-lg text-gray-500">Checking authentication...</span>
          </div>
        </div>
      );
    }
    if (!session || !session.githubAccessToken) {
      return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div className={`flex flex-col items-center justify-center w-full max-w-md gap-8 ${cardBg} rounded-2xl p-10 shadow-2xl transition-all duration-700 mt-12`}>
            <h2 className={`text-3xl font-extrabold text-center mb-4 drop-shadow ${headingColor}`}>Connect your GitHub</h2>
            <button
              className="px-8 py-4 rounded-lg bg-green-600 hover:bg-green-700 text-white text-lg font-semibold shadow-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-300"
              onClick={() => {
                window.location.href = "/api/auth/signin/github?callbackUrl=/admin/projects/new";
              }}
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.186 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.339-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.987 1.029-2.686-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.203 2.397.1 2.65.64.699 1.028 1.593 1.028 2.686 0 3.847-2.338 4.695-4.566 4.944.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.744 0 .267.18.577.688.479C19.138 20.203 22 16.447 22 12.021 22 6.484 17.523 2 12 2z" /></svg>
              Connect GitHub
            </span>
            </button>
          </div>
        </div>
      );
    }
    if (reposLoading) {
      return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div className={`flex flex-col items-center justify-center w-full max-w-md gap-8 ${cardBg} rounded-2xl p-10 shadow-2xl transition-all duration-700 mt-12`}>
            <span className="text-lg text-gray-500">Loading repositories...</span>
          </div>
        </div>
      );
    }
    if (reposError) {
      return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div className={`flex flex-col items-center justify-center w-full max-w-md gap-8 ${cardBg} rounded-2xl p-10 shadow-2xl transition-all duration-700 mt-12`}>
            <span className="text-lg text-red-500">{reposError}</span>
          </div>
        </div>
      );
    }
    if (repos && repos.length > 0) {
      return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div className={`flex flex-col items-center justify-center w-full max-w-md gap-8 ${cardBg} rounded-2xl p-10 shadow-2xl transition-all duration-700 mt-12`}>
            <h2 className={`text-3xl font-extrabold text-center mb-4 drop-shadow ${headingColor}`}>Select a Repository</h2>
            <ul className="w-full max-w-md divide-y divide-gray-200 dark:divide-gray-700">
              {repos.map((repo) => (
                <li key={repo.id} className="py-3 cursor-pointer hover:bg-blue-100 dark:hover:bg-gray-800 px-4 rounded transition"
                    onClick={() => {
                      setSelectedRepo(repo);
                      setStep(2);
                    }}>
                  <div className="font-semibold text-blue-900 dark:text-yellow-400">{repo.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-300">{repo.description}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    }
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className={`flex flex-col items-center justify-center w-full max-w-md gap-8 ${cardBg} rounded-2xl p-10 shadow-2xl transition-all duration-700 mt-12`}>
          <span className="text-lg text-gray-500">No repositories found.</span>
        </div>
      </div>
    );
  }

  // Step 3: Enter production URL after selecting repo
  if (step === 2 && importType === "github" && selectedRepo) {
    return (
      <div className="flex flex-col items-center gap-6 p-8">
        <h2 className="text-2xl font-bold">Enter Production URL</h2>
        <div className="mb-4 w-full max-w-md">
          <div className="mb-2 font-semibold">Selected Repository:</div>
          <div className="p-2 bg-gray-100 rounded border mb-2">
            <div className="font-semibold">{selectedRepo.name}</div>
          </div>
        </div>
        <input
          type="url"
          className="w-full max-w-md px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://your-production-url.com"
          value={productionUrl}
          onChange={e => setProductionUrl(e.target.value)}
        />
        <button
          className="mt-4 px-6 py-3 rounded bg-blue-600 text-white font-semibold"
          disabled={!productionUrl}
          onClick={() => setStep(3)}
        >
          Next
        </button>
      </div>
    );
  }

  // Step 4: AI analysis after production URL
  if (step === 3 && importType === "github" && selectedRepo && productionUrl) {
    if (aiLoading) {
      return <div className="p-8 text-center">Analyzing your project with AI...</div>;
    }
    if (aiError) {
      return <div className="p-8 text-center text-red-500">{aiError}</div>;
    }
    // Show editable form pre-filled with AI data
    return (
      <div className="flex flex-col items-center gap-6 p-8">
        <h2 className="text-2xl font-bold">Review & Edit Project Details</h2>
        <form className="space-y-4 w-full max-w-md">
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input type="text" className="w-full px-3 py-2 border rounded" placeholder="Project Title" value={formData.title} onChange={e => setFormData(f => ({ ...f, title: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium">Tagline</label>
            <input type="text" className="w-full px-3 py-2 border rounded" placeholder="Short tagline" value={formData.tagline} onChange={e => setFormData(f => ({ ...f, tagline: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea className="w-full px-3 py-2 border rounded" placeholder="Project description" value={formData.problemStatement} onChange={e => setFormData(f => ({ ...f, problemStatement: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium">Technologies</label>
            <input type="text" className="w-full px-3 py-2 border rounded" placeholder="Technologies used" value={formData.technologies} onChange={e => setFormData(f => ({ ...f, technologies: e.target.value }))} />
          </div>
          <button
            type="button"
            className="mt-4 px-6 py-3 rounded bg-blue-600 text-white font-semibold"
            onClick={() => setStep(4)}
          >
            Next
          </button>
        </form>
      </div>
    );
  }

  // Step 5: Screenshot upload and main image selection
  if (step === 4) {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) return;
      const filesArray = Array.from(e.target.files);
      // Only allow up to 5 images
      setScreenshots((prev) => [...prev, ...filesArray].slice(0, 5));
    };
    const handleRemove = (idx: number) => {
      setScreenshots((prev) => prev.filter((_, i) => i !== idx));
      if (mainImageIndex === idx) setMainImageIndex(null);
    };
    return (
      <div className="flex flex-col items-center gap-6 p-8">
        <h2 className="text-2xl font-bold">Upload Screenshots</h2>
        <label className="block text-sm font-medium mb-2" htmlFor="screenshots-input">Select up to 5 images</label>
        <input
          id="screenshots-input"
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          disabled={screenshots.length >= 5}
        />
        <div className="flex flex-wrap gap-4 mt-4">
          {screenshots.map((file, idx) => {
            const url = URL.createObjectURL(file);
            return (
              <div key={idx} className="relative border rounded p-2">
                <Image
                  src={url}
                  alt={`Screenshot ${idx + 1}`}
                  width={128}
                  height={80}
                  className={`w-32 h-20 object-cover rounded cursor-pointer border-4 ${mainImageIndex === idx ? 'border-blue-500' : 'border-transparent'}`}
                  onClick={() => setMainImageIndex(idx)}
                />
                <button
                  type="button"
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full px-2 py-0.5 text-xs"
                  onClick={() => handleRemove(idx)}
                >
                  ×
                </button>
                {mainImageIndex === idx && (
                  <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-2 py-0.5 rounded">Main</div>
                )}
              </div>
            );
          })}
        </div>
        <button
          className="mt-4 px-6 py-3 rounded bg-blue-600 text-white font-semibold"
          disabled={screenshots.length === 0 || mainImageIndex === null}
          onClick={() => setStep(5)}
        >
          Next
        </button>
      </div>
    );
  }

  // Cloudinary upload helper
  async function uploadScreenshotsToCloudinary(files: File[]): Promise<string[]> {
    const urls: string[] = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/cloudinary/upload', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Failed to upload image');
      const data = await res.json();
      urls.push(data.url);
    }
    return urls;
  }

  // Step 6: Final review and submit
  if (step === 5) {
    const handleFinalSubmit = async () => {
      setIsSubmitting(true);
      try {
        // 1. Upload screenshots to Cloudinary
        const uploadedUrls = await uploadScreenshotsToCloudinary(screenshots);
        // 2. Set main image URL
        const mainImageUrl = mainImageIndex !== null ? uploadedUrls[mainImageIndex] : '';
        // 3. Submit project data
        const response = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            mainImageUrl,
            screenshots: uploadedUrls,
            githubLink: selectedRepo ? `https://github.com/${selectedRepo.name}` : formData.githubLink,
            liveLink: productionUrl || formData.liveLink,
          }),
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
    return (
      <div className="flex flex-col items-center gap-6 p-8">
        <h2 className="text-2xl font-bold">Review & Submit</h2>
        <div className="w-full max-w-md space-y-4">
          <div>
            <div className="font-semibold">Title:</div>
            <div>{formData.title}</div>
          </div>
          <div>
            <div className="font-semibold">Tagline:</div>
            <div>{formData.tagline}</div>
          </div>
          <div>
            <div className="font-semibold">Description:</div>
            <div>{formData.problemStatement}</div>
          </div>
          <div>
            <div className="font-semibold">Technologies:</div>
            <div>{formData.technologies}</div>
          </div>
          <div>
            <div className="font-semibold">Production URL:</div>
            <div>{productionUrl}</div>
          </div>
          <div>
            <div className="font-semibold">Selected Repository:</div>
            <div>{selectedRepo?.name}</div>
          </div>
          <div>
            <div className="font-semibold mb-2">Screenshots:</div>
            <div className="flex flex-wrap gap-2">
              {screenshots.map((file, idx) => {
                const url = URL.createObjectURL(file);
                return (
                  <div key={idx} className="relative">
                    <Image
                      src={url}
                      alt={`Screenshot ${idx + 1}`}
                      width={64}
                      height={40}
                      className={`rounded border-2 ${mainImageIndex === idx ? 'border-blue-500' : 'border-gray-300'}`}
                    />
                    {mainImageIndex === idx && (
                      <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-2 py-0.5 rounded">Main</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <button
          className="mt-6 px-8 py-3 rounded bg-green-600 text-white font-semibold"
          onClick={handleFinalSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Project'}
        </button>
      </div>
    );
  }

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
            <h2 className="text-4xl font-extrabold mb-2 text-center drop-shadow">
              <span className={resolvedTheme === "light" ? "text-blue-700" : "text-yellow-400"}>Add New Project</span>
            </h2>
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
                  disabled={isSubmitting}                  className={`inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                    resolvedTheme === 'light'
                      ? 'bg-blue-500 hover:bg-blue-600'
                      : 'bg-[#FFC300] hover:bg-[#ffcd2c]'
                  } ${isSubmitting ? 'opacity-70' : ''}`}
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