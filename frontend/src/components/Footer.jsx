import React from 'react';
import { Link } from 'react-router-dom';
import {
  AcademicCapIcon,
  HomeIcon,
  BookOpenIcon,
  CodeBracketIcon,
  BuildingLibraryIcon,
} from '@heroicons/react/24/outline';

const GITHUB_URL = 'https://github.com/divyanshsingh07';
const LINKEDIN_URL = 'https://linkedin.com/in/divyanshsingharsh';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-solid relative z-10 bg-zinc-800 dark:bg-zinc-950 border-t border-zinc-700 dark:border-zinc-800 mt-auto text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="h-9 w-9 rounded-lg bg-sky-500 flex items-center justify-center">
                <AcademicCapIcon className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-white dark:text-white">
                MiniCourses
              </span>
            </Link>
            <p className="text-sm text-gray-300 dark:text-gray-400 max-w-xs">
              Learn new skills, advance your career. Quality courses at your fingertips.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 text-sm text-gray-300 dark:text-gray-400 hover:text-sky-400 dark:hover:text-sky-400 transition-colors"
                >
                  <HomeIcon className="h-4 w-4" />
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/courses"
                  className="inline-flex items-center gap-2 text-sm text-gray-300 dark:text-gray-400 hover:text-sky-400 dark:hover:text-sky-400 transition-colors"
                >
                  <BookOpenIcon className="h-4 w-4" />
                  Courses
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-sm text-gray-300 dark:text-gray-400 hover:text-sky-400 dark:hover:text-sky-400 transition-colors"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 text-sm text-gray-300 dark:text-gray-400 hover:text-sky-400 dark:hover:text-sky-400 transition-colors"
                >
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Connect
            </h3>
            <div className="flex flex-col gap-3">
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-gray-300 dark:text-gray-400 hover:text-sky-400 dark:hover:text-sky-400 transition-colors"
              >
                <CodeBracketIcon className="h-5 w-5" />
                GitHub
              </a>
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-gray-300 dark:text-gray-400 hover:text-sky-400 dark:hover:text-sky-400 transition-colors"
              >
                <BuildingLibraryIcon className="h-5 w-5" />
                LinkedIn
              </a>
            </div>
          </div>

          {/* Promo */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Black Friday
            </h3>
            <p className="text-sm text-gray-300 dark:text-gray-400 mb-3">
              Use code <code className="px-2 py-0.5 bg-amber-500/20 dark:bg-amber-500/30 text-amber-300 dark:text-amber-300 rounded font-mono font-bold">BFSALE25</code> for 50% off paid courses.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-zinc-700 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400 dark:text-gray-500">
            © {currentYear} MiniCourses. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 dark:text-gray-500 hover:text-sky-400 dark:hover:text-sky-400 transition-colors"
              aria-label="GitHub"
            >
              <CodeBracketIcon className="h-5 w-5" />
            </a>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 dark:text-gray-500 hover:text-sky-400 dark:hover:text-sky-400 transition-colors"
              aria-label="LinkedIn"
            >
              <BuildingLibraryIcon className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
