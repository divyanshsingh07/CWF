import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRightIcon,
  CheckCircleIcon,
  XMarkIcon,
  AcademicCapIcon,
  PlayIcon,
  ClipboardDocumentIcon,
  ClipboardDocumentCheckIcon,
  TagIcon,
  BookOpenIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { coursesAPI } from '../services/api';

const TRANSITION = { duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] };

function useCountUp(end, duration = 1500, startOn = true) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    if (!startOn || end === 0) {
      setValue(end);
      return;
    }
    const el = ref.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (started.current) return;
        if (entries[0].isIntersecting) {
          started.current = true;
          const startTime = performance.now();
          const step = (now) => {
            const elapsed = now - startTime;
            const t = Math.min(elapsed / duration, 1);
            const eased = 1 - (1 - t) ** 2;
            setValue(Math.round(eased * end));
            if (t < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.2 }
    );
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration, startOn]);

  return [value, ref];
}

function formatStat(display, compactThousands) {
  if (compactThousands && display >= 1000) {
    const k = display / 1000;
    return (Math.round(k * 10) / 10).toFixed(k >= 10 ? 0 : 1) + 'k';
  }
  return String(display);
}

function StatItem({ value, label, icon: Icon, suffix = '', compactThousands }) {
  const [display, ref] = useCountUp(value, 1400);
  const text = formatStat(display, compactThousands) + suffix;
  return (
    <div ref={ref} className="flex flex-col items-center justify-center min-w-0 flex-1">
      <div className="flex items-center justify-center gap-1.5 text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white tabular-nums">
        {Icon && <Icon className="h-6 w-6 sm:h-7 sm:w-7 text-sky-500 dark:text-sky-400 opacity-90 shrink-0" />}
        <span className="truncate">{text}</span>
      </div>
      <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mt-0.5">
        {label}
      </div>
    </div>
  );
}

export default function Hero() {
  const location = useLocation();
  const { user, isAuthenticated, isTeacher } = useAuth();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [copied, setCopied] = useState(false);

  const copyPromoCode = async () => {
    try {
      await navigator.clipboard.writeText('BFSALE25');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  useEffect(() => {
    if (location.state?.loginSuccess) {
      setShowSuccessMessage(true);
      const timer = setTimeout(() => setShowSuccessMessage(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await coursesAPI.getAll();
        setFeaturedCourses((data.data || []).slice(0, 3));
      } catch (err) {
        console.error('Error fetching courses:', err);
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <section className="hero-grid-bg relative min-h-screen bg-white dark:bg-zinc-900 overflow-x-hidden">
      {/* Success toast */}
      <AnimatePresence>
        {showSuccessMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={TRANSITION}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="bg-green-600 dark:bg-green-500 text-white rounded-xl shadow-xl px-4 py-3 flex items-center gap-3">
              <CheckCircleIcon className="h-5 w-5 shrink-0" />
              <span className="text-sm font-medium">Welcome back, {user?.name || 'there'}!</span>
              <button
                onClick={() => setShowSuccessMessage(false)}
                className="p-1 rounded hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200"
                aria-label="Dismiss"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
          </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 sm:pt-40 pb-28 w-full min-w-0">
        {/* Hero block */}
        <div className="text-center max-w-3xl mx-auto">
          {/* Promo badge + coupon — highly visible and prominent */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, ...TRANSITION }}
            className="mb-10"
          >
            <div className="inline-flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <span className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-900 dark:text-amber-100 text-base font-semibold border-2 border-amber-300 dark:border-amber-500/40 shadow-lg shadow-amber-500/20 dark:shadow-amber-500/10">
                <TagIcon className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />
                Black Friday — 50% off
                <span className="text-amber-700 dark:text-amber-200 text-sm font-bold ml-1">
                  · Limited time
                </span>
              </span>
              <motion.button
                onClick={copyPromoCode}
                whileHover={{ scale: 1.05, boxShadow: '0 10px 30px -8px rgba(14, 165, 233, 0.4)' }}
                whileTap={{ scale: 0.98 }}
                transition={TRANSITION}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-sky-500 hover:bg-sky-600 text-white text-base font-bold font-mono shadow-xl shadow-sky-500/30 dark:shadow-sky-500/20 border-2 border-sky-400 dark:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 transition-all duration-200"
                aria-label={copied ? 'Copied' : 'Copy code BFSALE25'}
              >
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.span
                      key="copied"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={TRANSITION}
                      className="inline-flex items-center gap-2 text-white font-semibold"
                    >
                      <ClipboardDocumentCheckIcon className="h-5 w-5" />
                      Copied!
                    </motion.span>
                  ) : (
                    <motion.span
                      key="code"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={TRANSITION}
                      className="inline-flex items-center gap-2.5"
                    >
                      <span className="text-lg tracking-wider">BFSALE25</span>
                      <ClipboardDocumentIcon className="h-5 w-5 text-white/80" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </motion.div>

          {/* Headline — bold hierarchy, gradient accent */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, ...TRANSITION }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-[1.08] mb-6"
          >
            Learn new skills,
            <br />
            <span className="bg-linear-to-r from-sky-500 via-sky-400 to-cyan-400 dark:from-sky-400 dark:via-sky-300 dark:to-cyan-300 bg-clip-text text-transparent">
              advance your career
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, ...TRANSITION }}
            className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 mb-12 max-w-xl mx-auto leading-relaxed font-normal"
          >
            Access premium courses from industry experts. Start learning today and transform your future.
          </motion.p>

          {/* CTAs — role-based: Teachers see Dashboard, Students see Browse courses */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, ...TRANSITION }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-16"
          >
            {isAuthenticated && isTeacher ? (
              <>
                <Link to="/teacher-dashboard" className="w-full sm:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: '0 20px 40px -12px rgba(14, 165, 233, 0.35)' }}
                    whileTap={{ scale: 0.98 }}
                    transition={TRANSITION}
                    className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-semibold text-base shadow-lg shadow-sky-500/25 dark:shadow-sky-500/20 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 transition-all duration-200"
                  >
                    Dashboard
                    <motion.span
                      className="inline-block"
                      initial={false}
                      animate={{ x: 0 }}
                      whileHover={{ x: 4 }}
                      transition={TRANSITION}
                    >
                      <ArrowRightIcon className="h-5 w-5" />
                    </motion.span>
                  </motion.button>
                </Link>
                <Link to="/courses" className="w-full sm:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    transition={TRANSITION}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-zinc-600 dark:text-zinc-300 font-medium text-sm border border-zinc-200 dark:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 transition-all duration-200"
                  >
                    Browse courses
                  </motion.button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/courses" className="w-full sm:w-auto">
                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: '0 20px 40px -12px rgba(14, 165, 233, 0.35)' }}
                    whileTap={{ scale: 0.98 }}
                    transition={TRANSITION}
                    className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-semibold text-base shadow-lg shadow-sky-500/25 dark:shadow-sky-500/20 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 transition-all duration-200"
                  >
                    Browse courses
                    <motion.span
                      className="inline-block"
                      initial={false}
                      animate={{ x: 0 }}
                      whileHover={{ x: 4 }}
                      transition={TRANSITION}
                    >
                      <ArrowRightIcon className="h-5 w-5" />
                    </motion.span>
                  </motion.button>
                </Link>
                {isAuthenticated && (
                  <Link to="/my-courses" className="w-full sm:w-auto">
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      transition={TRANSITION}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-zinc-600 dark:text-zinc-300 font-medium text-sm border border-zinc-200 dark:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 transition-all duration-200"
                    >
                      <PlayIcon className="h-4 w-4" />
                      My courses
                    </motion.button>
                  </Link>
                )}
              </>
            )}
          </motion.div>

          {/* Stats — icons, emphasis, count-up; responsive and aligned */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            transition={{ delay: 0.3, ...TRANSITION }}
            className="w-full max-w-md mx-auto flex items-stretch justify-center gap-4 sm:gap-6 py-5 px-4 sm:px-6 rounded-2xl bg-zinc-50/80 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60 backdrop-blur-sm"
          >
            <StatItem value={20} label="Courses" icon={BookOpenIcon} suffix="+" />
            <div className="w-px self-center h-10 sm:h-12 bg-zinc-200 dark:bg-zinc-600 shrink-0" aria-hidden="true" />
            <StatItem value={1500} label="Students" icon={UserGroupIcon} suffix="+" compactThousands />
            <div className="w-px self-center h-10 sm:h-12 bg-zinc-200 dark:bg-zinc-600 shrink-0" aria-hidden="true" />
            <div className="flex flex-col items-center justify-center min-w-0 flex-1">
              <div className="flex items-center justify-center gap-1.5 text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white tabular-nums">
                <StarSolid className="h-6 w-6 sm:h-7 sm:w-7 text-amber-400 shrink-0" />
                <span>4.8</span>
              </div>
              <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mt-0.5">
                Rating
                  </div>
                </div>
              </motion.div>
        </div>

        {/* Featured courses — section description, view all, card hover/zoom/CTA */}
            <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, ...TRANSITION }}
          className="mt-28 sm:mt-32"
        >
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
                Featured courses
              </h2>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400 text-sm max-w-xl">
                Hand-picked courses to get you started. New content added regularly.
              </p>
            </div>
            <Link
              to="/courses"
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-sky-500 dark:text-sky-400 hover:text-sky-600 dark:hover:text-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 rounded-lg py-2 pr-1 transition-all duration-200 self-start sm:self-auto"
            >
              View all
              <motion.span
                className="inline-block"
                initial={false}
                whileHover={{ x: 4 }}
                transition={TRANSITION}
              >
                <ArrowRightIcon className="h-4 w-4" />
              </motion.span>
            </Link>
                    </div>

          {loadingCourses ? (
            <div className="flex justify-center py-20" aria-label="Loading courses">
              <div
                className="h-9 w-9 rounded-full border-2 border-sky-500 border-t-transparent animate-spin"
                role="status"
                      />
                    </div>
          ) : featuredCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCourses.map((course, index) => (
                <motion.div
                  key={course._id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 + index * 0.06, ...TRANSITION }}
                >
                  <Link to={`/courses/${course._id}`} className="block h-full group/card">
                    <article className="h-full rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/80 overflow-hidden hover:-translate-y-1 hover:border-sky-300/80 dark:hover:border-sky-600/80 hover:shadow-xl hover:shadow-sky-500/5 dark:hover:shadow-sky-500/10 transition-all duration-300 focus-within:ring-2 focus-within:ring-sky-500/50 focus-within:ring-offset-2 dark:focus-within:ring-offset-zinc-900">
                      <div className="aspect-4/3 relative overflow-hidden bg-zinc-100 dark:bg-zinc-700">
                        {course.thumbnail && !course.thumbnail.startsWith('data:') ? (
                          <motion.img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-full h-full object-cover"
                            whileHover={{ scale: 1.06 }}
                            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-sky-500 to-cyan-500">
                            <AcademicCapIcon className="h-14 w-14 text-white/40" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
                        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover/card:opacity-100 translate-y-2 group-hover/card:translate-y-0 transition-all duration-200">
                          <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/95 dark:bg-zinc-800/95 text-zinc-900 dark:text-white text-sm font-medium shadow-lg">
                            View course
                            <ArrowRightIcon className="h-4 w-4" />
                          </span>
                        </div>
                        <div className="absolute top-3 right-3">
                          {course.price === 0 ? (
                            <span className="px-2.5 py-1.5 rounded-lg bg-green-500 text-white text-xs font-semibold shadow">
                              Free
                            </span>
                          ) : (
                            <span className="px-2.5 py-1.5 rounded-lg bg-white/95 dark:bg-zinc-800/95 text-zinc-900 dark:text-white text-xs font-semibold shadow">
                              ${(course.price / 2).toFixed(0)}
                              <span className="text-zinc-400 dark:text-zinc-500 line-through ml-1">
                                ${course.price}
                              </span>
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="font-semibold text-zinc-900 dark:text-white group-hover/card:text-sky-600 dark:group-hover/card:text-sky-400 transition-colors duration-200 line-clamp-1 mb-1">
                          {course.title}
                        </h3>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-4">
                          {course.description}
                        </p>
                        {course.instructor && (
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-sky-500 flex items-center justify-center text-white text-xs font-medium shrink-0">
                              {course.instructor.name?.charAt(0).toUpperCase() || 'I'}
                            </div>
                            <span className="text-sm text-zinc-500 dark:text-zinc-400 truncate">
                              {course.instructor.name || 'Instructor'}
                            </span>
                          </div>
                        )}
                    </div>
                    </article>
                  </Link>
                </motion.div>
              ))}
                  </div>
          ) : (
            <div className="text-center py-20 text-zinc-500 dark:text-zinc-400 text-sm">
              No courses yet.
                </div>
          )}
        </motion.div>

        {/* Trust */}
                <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, ...TRANSITION }}
          className="mt-24 flex flex-wrap items-center justify-center gap-8 sm:gap-12 text-sm text-zinc-500 dark:text-zinc-400"
        >
          <span className="inline-flex items-center gap-2">
            <CheckCircleIcon className="h-5 w-5 text-green-500 dark:text-green-400 shrink-0" aria-hidden />
            Lifetime access
          </span>
          <span className="inline-flex items-center gap-2">
            <CheckCircleIcon className="h-5 w-5 text-green-500 dark:text-green-400 shrink-0" aria-hidden />
            Certificate
          </span>
          <span className="inline-flex items-center gap-2">
            <CheckCircleIcon className="h-5 w-5 text-green-500 dark:text-green-400 shrink-0" aria-hidden />
            30-day guarantee
          </span>
            </motion.div>
          </div>
    </section>
  );
}
