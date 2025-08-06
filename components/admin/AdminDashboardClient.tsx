"use client";

import { useTheme } from "next-themes";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import CircularLoader from "@/components/admin/CircularLoader";
import { ThemeToggle } from "@/components/admin/ThemeToggle";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";

// Types for project and related entities
type ProjectImage = {
  id: string;
  url: string;
  altText?: string;
};
type ProjectLink = {
  id: string;
  url: string;
  text: string;
};
type ProjectTechnology = {
  id: string;
  name: string;
};
type Project = {
  id: string;
  title: string;
  tagline?: string;
  description?: string;
  projectStatus?: string;
  dateRange?: string;
  problemStatement?: string;
  solutionOutcome?: string;
  role?: string;
  keyLearnings?: string;
  links?: ProjectLink[];
  technologies?: ProjectTechnology[];
  images?: ProjectImage[];
  mainImageId?: string;
  mainImage?: ProjectImage;
  githubRepoUrl?: string;
  productionUrl?: string;
  autoAnalyzed?: boolean;
  displayOrder?: number;
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export default function AdminDashboardClient({ session }: { session: Session }) {
  const { resolvedTheme } = useTheme();
  const [showLogout, setShowLogout] = useState(false);
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Collapsible projects wizard state and handler
  const [showProjectsWizard, setShowProjectsWizard] = useState(false);
  const [expandedProjects, setExpandedProjects] = useState<string[]>([]);
  const handleToggleProject = useCallback((projectId: string) => {
    setExpandedProjects((prev) =>
      prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId]
    );
  }, []);

  // Backgrounds and overlays for each theme
  const bgImage =
    resolvedTheme === "light"
      ? "/images/adminbackground1.jpg"
      : "/images/adminbackground.jpg";
  const overlayColor =
    resolvedTheme === "light"
      ? "bg-blue-100/80"
      : "bg-[#232b3b]/80";
  const cardBg =
    resolvedTheme === "light"
      ? "bg-blue-50/90 border border-blue-200"
      : "bg-[#232b3b]/90 border border-[#444]";
  const textColor = resolvedTheme === "light" ? "text-blue-900" : "text-gray-200";

  // Logout handler
  const handleLogout = async () => {
    setShowLogout(false);
    await signOut({ redirect: false });
    router.push("/");
  };

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoadingProjects(true);
        setError(null);
        const response = await fetch("/api/projects");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Ensure we always set an array
        setProjects(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch projects");
        setProjects([]); // Ensure we always have an array
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Themed blurred background */}
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
      {/* Themed overlay */}
      <div className={`absolute inset-0 ${overlayColor} z-0 transition-all duration-700`} />
      {/* Theme toggle and logout icon */}
      <div className="absolute top-6 right-8 z-20 flex items-center gap-4">
        <ThemeToggle />
        <button
          onClick={() => setShowLogout(true)}
          className="p-2 rounded-lg bg-transparent hover:bg-red-100 dark:hover:bg-red-900 transition-colors duration-200 text-red-600 dark:text-red-400"
          aria-label="Log out"
        >
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H9m4 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" />
          </svg>
        </button>
      </div>
      {/* Logout confirmation modal */}
      {showLogout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-[#232b3b] rounded-xl shadow-2xl p-8 max-w-sm w-full flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Confirm Logout</h2>
            <p className="mb-6 text-gray-700 dark:text-gray-300 text-center">Are you sure you want to log out?</p>
            <div className="flex gap-4 w-full">
              <button
                onClick={() => setShowLogout(false)}
                className="flex-1 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Centered loader and dashboard content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
        <CircularLoader loading={loadingProjects}>
          <div className={`flex flex-col items-center justify-center w-full max-w-xl gap-6 ${cardBg} rounded-2xl p-10 shadow-2xl transition-all duration-700`}>
            <h1
              className={`text-4xl font-extrabold mb-2 text-center drop-shadow ${resolvedTheme === "light" ? "text-blue-700" : "text-yellow-400"}`}
            >
              Admin Dashboard
            </h1>
            <p className={`text-lg mb-4 text-center ${textColor}`}>
              Welcome, <span className={resolvedTheme === "light" ? "text-blue-700 font-semibold" : "text-yellow-400 font-semibold"}>{session.user?.name || session.user?.email}</span>!<br />
              Manage your portfolio projects here.
            </p>
            <div className="w-full flex flex-col items-center gap-4">
            {error && (
              <div className="w-full p-4 mb-4 text-red-700 bg-red-100 rounded-lg dark:bg-red-900 dark:text-red-300">
                <p className="text-center">{error}</p>
              </div>
            )}
            <a
              href="/admin/projects/new"
              className={`block w-full text-center py-3 rounded-lg font-bold text-lg shadow-md ${resolvedTheme === "light" ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-yellow-400 hover:bg-yellow-500 text-gray-900"}`}
            >
              + Add New Project
            </a>
            <button
              className={`block w-full text-center py-3 rounded-lg font-bold text-lg shadow-md mt-2 ${resolvedTheme === "light" ? "bg-white border border-blue-300 text-blue-700 hover:bg-blue-50" : "bg-[#232b3b] border border-yellow-400 text-yellow-300 hover:bg-yellow-900"}`}
              onClick={() => setShowProjectsWizard(true)}
            >
              See Your Projects
            </button>
            {/* Collapsible Projects Wizard Modal */}
            {showProjectsWizard && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className={`bg-white dark:bg-[#232b3b] rounded-2xl shadow-2xl p-8 max-w-2xl w-full flex flex-col gap-6 relative`}>
                  <button
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold"
                    onClick={() => setShowProjectsWizard(false)}
                    aria-label="Close"
                  >
                    ×
                  </button>
                  <h2 className="text-2xl font-bold mb-4 text-center">Your Projects</h2>
                  <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto">
                    {projects.length === 0 && !loadingProjects && (
                      <div className="text-center text-gray-500">No projects found.</div>
                    )}
                    {projects.map((project) => (
                      <div key={project.id}>
                        <div
                          className={`flex items-center gap-4 cursor-pointer rounded-lg p-3 border transition-all duration-200 ${expandedProjects.includes(project.id) ? (resolvedTheme === 'light' ? 'bg-blue-50 border-blue-300' : 'bg-[#232b3b] border-yellow-400') : (resolvedTheme === 'light' ? 'bg-white border-blue-200' : 'bg-[#232b3b] border-[#444]')}`}
                          onClick={() => handleToggleProject(project.id)}
                        >
                          {project.mainImage?.url && (
                            <Image src={project.mainImage.url} alt="Main" width={64} height={48} className="w-16 h-12 object-cover rounded border" />
                          )}
                          <div className="flex-1">
                            <div className="font-bold text-lg">{project.title}</div>
                          </div>
                          <svg className={`w-6 h-6 transition-transform duration-200 ${expandedProjects.includes(project.id) ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                        </div>
                        {/* Collapsible details */}
                        {expandedProjects.includes(project.id) && (
                          <div className={`mt-2 ml-8 p-4 rounded-lg border-l-4 ${resolvedTheme === 'light' ? 'bg-blue-100 border-blue-400' : 'bg-[#232b3b] border-yellow-400'}`}> 
                            <div className="mb-2"><span className="font-semibold">Tagline:</span> {project.tagline}</div>
                            <div className="mb-2"><span className="font-semibold">Description:</span> {project.description || <span className="text-gray-400">N/A</span>}</div>
                            <div className="mb-2"><span className="font-semibold">Status:</span> {project.projectStatus}</div>
                            <div className="mb-2"><span className="font-semibold">Date Range:</span> {project.dateRange}</div>
                            <div className="mb-2"><span className="font-semibold">Problem:</span> {project.problemStatement}</div>
                            <div className="mb-2"><span className="font-semibold">Solution:</span> {project.solutionOutcome}</div>
                            <div className="mb-2"><span className="font-semibold">Role:</span> {project.role}</div>
                            <div className="mb-2"><span className="font-semibold">Key Learnings:</span> {project.keyLearnings}</div>
                            <div className="mb-2"><span className="font-semibold">Links:</span> {project.links?.length ? project.links.map((link) => (<a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-yellow-400 underline ml-2">{link.text}</a>)) : <span className="text-gray-400 ml-2">N/A</span>}</div>
                            <div className="mb-2"><span className="font-semibold">Technologies:</span> {project.technologies?.length ? project.technologies.map((tech) => (<span key={tech.id} className="px-2 py-1 rounded-full bg-blue-100 dark:bg-yellow-900 text-blue-700 dark:text-yellow-300 text-xs font-semibold ml-1">{tech.name}</span>)) : <span className="text-gray-400 ml-2">N/A</span>}</div>
                            <div className="mb-2"><span className="font-semibold">Images:</span> {project.images?.length ? (
                              <div className="flex flex-wrap gap-2 mt-1">{project.images.map((img, imgIdx) => (
                                <Image key={img.id} src={img.url} alt={img.altText || `Screenshot ${imgIdx + 1}`} width={80} height={56} className={`w-20 h-14 object-cover rounded border-2 ${project.mainImageId === img.id ? 'border-blue-500' : 'border-gray-300'}`} />
                              ))}</div>
                            ) : <span className="text-gray-400 ml-2">No images</span>}</div>
                            <div className="mb-2"><span className="font-semibold">GitHub Repo:</span> {project.githubRepoUrl ? <a href={project.githubRepoUrl} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">{project.githubRepoUrl}</a> : <span className="text-gray-400">N/A</span>}</div>
                            <div className="mb-2"><span className="font-semibold">Production URL:</span> {project.productionUrl ? <a href={project.productionUrl} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">{project.productionUrl}</a> : <span className="text-gray-400">N/A</span>}</div>
                            <div className="mb-2"><span className="font-semibold">Auto Analyzed:</span> {project.autoAnalyzed ? 'Yes' : 'No'}</div>
                            <div className="mb-2"><span className="font-semibold">Display Order:</span> {project.displayOrder}</div>
                            <div className="mb-2"><span className="font-semibold">Featured:</span> {project.isFeatured ? 'Yes' : 'No'}</div>
                            <div className="mb-2"><span className="font-semibold">Created:</span> {project.createdAt ? new Date(project.createdAt).toLocaleString() : ''}</div>
                            <div className="mb-2"><span className="font-semibold">Updated:</span> {project.updatedAt ? new Date(project.updatedAt).toLocaleString() : ''}</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {/* End Collapsible Projects Wizard Modal */}
            </div>
          </div>
        </CircularLoader>
        {/* Project Wizard Modal removed in favor of collapsible modal */}
      </div>
    </div>
  );
}