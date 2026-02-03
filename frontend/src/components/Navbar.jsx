import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bars3Icon,
  XMarkIcon,
  SunIcon,
  MoonIcon,
  ArrowRightOnRectangleIcon,
  AcademicCapIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, user, logout, isTeacher } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true' || 
                   (localStorage.getItem('darkMode') === null && 
                    window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDarkMode(isDark);
    updateTheme(isDark);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  }, [location.pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const updateTheme = (isDark) => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    updateTheme(newDarkMode);
  };

  // Navigation based on user role
  const navigation = isAuthenticated && isTeacher
    ? [
        { name: 'Home', href: '/' },
        { name: 'Dashboard', href: '/teacher-dashboard' },
      ]
    : [
        { name: 'Home', href: '/' },
        { name: 'Courses', href: '/courses' },
      ];

  const isActivePath = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl shadow-md border-b border-gray-200/50 dark:border-zinc-700/50' 
        : 'bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          
          {/* Logo / Brand */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="h-9 w-9 rounded-lg bg-sky-500 flex items-center justify-center">
              <AcademicCapIcon className="h-5 w-5 text-white" />
          </div>
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              MiniCourses
            </span>
          </Link>

          {/* Right side - Desktop */}
          <div className="hidden md:flex items-center gap-6">
            {/* Navigation Links — active indicator + hover */}
            <div className="flex items-center gap-0.5">
            {navigation.map((item) => {
                const isActive = isActivePath(item.href);
              return (
                  <Link
                  key={item.name}
                    to={item.href}
                    className={`relative px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 ${
                      isActive
                        ? 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-900/30'
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                  {item.name}
                    {isActive && (
                      <span
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-sky-500 dark:bg-sky-400"
                        aria-hidden="true"
                      />
                    )}
                  </Link>
              );
            })}
          </div>

            {/* Divider */}
            <div className="h-5 w-px bg-gray-200 dark:bg-zinc-700" />

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 transition-all duration-200"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            </button>

            {/* Auth Section */}
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                {/* Profile Button */}
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 ${
                    profileDropdownOpen
                      ? 'bg-zinc-100 dark:bg-zinc-800'
                      : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                  aria-expanded={profileDropdownOpen}
                  aria-haspopup="true"
                >
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-medium shrink-0 ${
                    isTeacher ? 'bg-sky-500' : 'bg-cyan-500'
                  }`}>
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-medium text-zinc-900 dark:text-white leading-tight">{user?.name}</p>
                    <p className={`text-xs ${isTeacher ? 'text-sky-600 dark:text-sky-400' : 'text-cyan-600 dark:text-cyan-400'}`}>
                      {isTeacher ? 'Teacher' : 'Student'}
                    </p>
                  </div>
                  <motion.svg
                    className="h-4 w-4 text-zinc-400 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    animate={{ rotate: profileDropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </motion.svg>
                </button>

                {/* Dropdown Menu — smooth scale + opacity */}
                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.96, y: -4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98, y: -4 }}
                      transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-700 py-2 z-50 origin-top-right"
                    >
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-700">
                        <p className="text-sm font-medium text-zinc-900 dark:text-white">{user?.name}</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{user?.email}</p>
                      </div>

                      {/* Menu Items */}
                      <div className="py-1">
                        {isTeacher ? (
                          <Link
                            to="/teacher-dashboard"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700/80 rounded-lg mx-1 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:ring-inset"
                            onClick={() => setProfileDropdownOpen(false)}
                          >
                            <BookOpenIcon className="h-4 w-4 shrink-0" />
                            Dashboard
                          </Link>
                        ) : (
                          <Link
                            to="/my-courses"
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700/80 rounded-lg mx-1 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:ring-inset"
                            onClick={() => setProfileDropdownOpen(false)}
                          >
                            <BookOpenIcon className="h-4 w-4 shrink-0" />
                            My Courses
                          </Link>
                        )}
                      </div>

                      {/* Logout */}
                      <div className="border-t border-zinc-100 dark:border-zinc-700 pt-1 mt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg mx-1 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:ring-inset"
                        >
                          <ArrowRightOnRectangleIcon className="h-4 w-4 shrink-0" />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 rounded-lg"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2.5 text-sm font-medium text-white bg-sky-500 rounded-lg hover:bg-sky-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Controls */}
          <div className="flex md:hidden items-center gap-2">
            {/* Dark Mode Toggle - Mobile */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            </button>
            
            {/* Hamburger Menu */}
            <button
              type="button"
              className="p-2 rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <span className="sr-only">Open menu</span>
              {mobileMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
      {mobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="md:hidden overflow-hidden bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800"
          >
            <div className="px-4 py-3 space-y-1">
              {/* Navigation Links */}
            {navigation.map((item) => {
                const isActive = isActivePath(item.href);
              return (
                  <Link
                  key={item.name}
                    to={item.href}
                    className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                      isActive
                        ? 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-900/20'
                        : 'text-zinc-700 dark:text-zinc-300'
                    }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                  </Link>
              );
            })}
              
              {/* Divider */}
              <div className="border-t border-zinc-100 dark:border-zinc-800 my-2" />
              
              {/* Auth Section - Mobile */}
              {isAuthenticated ? (
                <div className="space-y-1">
                  {/* Profile Info */}
                  <div className="flex items-center gap-3 px-4 py-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-medium ${
                      isTeacher ? 'bg-sky-500' : 'bg-cyan-500'
                    }`}>
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                    <p className="font-medium text-zinc-900 dark:text-white">{user?.name}</p>
                    <p className={`text-sm ${isTeacher ? 'text-sky-600 dark:text-sky-400' : 'text-cyan-600 dark:text-cyan-400'}`}>
                        {isTeacher ? 'Teacher' : 'Student'}
                      </p>
          </div>
        </div>

                  {/* Dashboard/My Courses Link */}
                  {isTeacher ? (
                    <Link
                      to="/teacher-dashboard"
                      className="flex items-center gap-3 px-4 py-3 text-base font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors duration-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <BookOpenIcon className="h-5 w-5" />
                      Dashboard
                    </Link>
                  ) : (
                    <Link
                      to="/my-courses"
                      className="flex items-center gap-3 px-4 py-3 text-base font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors duration-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <BookOpenIcon className="h-5 w-5" />
                      My Courses
                    </Link>
                  )}
                  
                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 text-left text-base font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-2 pt-2">
                  <Link
                    to="/login"
                    className="block px-4 py-3 text-center text-base font-medium text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-4 py-3 text-center text-base font-medium text-white bg-sky-500 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </nav>
  );
}
