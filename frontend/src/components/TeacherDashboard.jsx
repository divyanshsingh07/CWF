import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  AcademicCapIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  PlusIcon,
  CalendarIcon,
  TagIcon,
  Cog6ToothIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { coursesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatPriceINR } from '../lib/utils';

const TRANSITION = { duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] };

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const data = await coursesAPI.getDashboard();
      setDashboard(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="min-h-screen pt-20 flex items-center justify-center bg-white dark:bg-zinc-800">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-2 border-sky-500 border-t-transparent"></div>
          <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">Loading dashboard...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen pt-20 pb-12 bg-white dark:bg-zinc-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={TRANSITION}
          className="pt-8 pb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white mb-2 tracking-tight">
                Welcome, {user?.name}!
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base">
                Manage your courses and track student enrollments
              </p>
            </div>
            <Link to="/add-course" className="self-start sm:self-auto">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={TRANSITION}
                className="inline-flex items-center gap-2 px-5 py-3 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-xl shadow-lg shadow-sky-500/25 dark:shadow-sky-500/20 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-800 transition-all duration-200"
              >
                <PlusIcon className="h-5 w-5" />
                Create Course
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm"
          >
            {error}
          </motion.div>
        )}

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, ...TRANSITION }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {/* Total Courses */}
          <div className="bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl p-5 hover:border-sky-300 dark:hover:border-sky-600 transition-colors duration-200">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-sky-100 dark:bg-sky-900/30 rounded-lg">
                <AcademicCapIcon className="h-6 w-6 text-sky-500 dark:text-sky-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-0.5">
                  Total Courses
                </p>
                <p className="text-2xl font-bold text-zinc-900 dark:text-white tabular-nums">
                  {dashboard?.overview?.totalCourses || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Total Students */}
          <div className="bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl p-5 hover:border-sky-300 dark:hover:border-sky-600 transition-colors duration-200">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-sky-100 dark:bg-sky-900/30 rounded-lg">
                <UserGroupIcon className="h-6 w-6 text-sky-500 dark:text-sky-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-0.5">
                  Total Students
                </p>
                <p className="text-2xl font-bold text-zinc-900 dark:text-white tabular-nums">
                  {dashboard?.overview?.totalStudents || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Subscriptions */}
          <div className="bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl p-5 hover:border-sky-300 dark:hover:border-sky-600 transition-colors duration-200">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-sky-100 dark:bg-sky-900/30 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-sky-500 dark:text-sky-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-0.5">
                  Subscriptions
                </p>
                <p className="text-2xl font-bold text-zinc-900 dark:text-white tabular-nums">
                  {dashboard?.overview?.totalSubscriptions || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl p-5 hover:border-sky-300 dark:hover:border-sky-600 transition-colors duration-200">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-sky-100 dark:bg-sky-900/30 rounded-lg">
                <CurrencyDollarIcon className="h-6 w-6 text-sky-500 dark:text-sky-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-0.5">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold text-zinc-900 dark:text-white tabular-nums">
                  {formatPriceINR(dashboard?.overview?.totalRevenue ?? 0)}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Courses List */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, ...TRANSITION }}
            className="lg:col-span-2"
          >
            <div className="bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden">
              <div className="p-5 sm:p-6 border-b border-zinc-200 dark:border-zinc-700">
                <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white">
                  Your Courses
                </h2>
              </div>

              {!dashboard?.courseStats?.length ? (
                <div className="p-12 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sky-100 dark:bg-sky-900/30 mb-4">
                    <AcademicCapIcon className="h-8 w-8 text-sky-500 dark:text-sky-400" />
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-400 mb-4 text-sm">No courses yet</p>
                  <Link
                    to="/add-course"
                    className="inline-flex items-center gap-1.5 text-sky-500 dark:text-sky-400 hover:text-sky-600 dark:hover:text-sky-300 font-medium text-sm transition-colors"
                  >
                    Create your first course
                    <ArrowRightIcon className="h-4 w-4" />
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-zinc-200 dark:divide-zinc-700">
                  {dashboard.courseStats.map((course, index) => (
                    <motion.div
                      key={course._id}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + index * 0.03, ...TRANSITION }}
                      className={`p-4 sm:p-5 hover:bg-white dark:hover:bg-zinc-800 cursor-pointer transition-colors duration-200 ${
                        selectedCourse?._id === course._id
                          ? 'bg-white dark:bg-zinc-800 border-l-4 border-sky-500'
                          : ''
                      }`}
                      onClick={() => setSelectedCourse(course)}
                    >
                      <div className="flex items-start sm:items-center gap-4">
                        <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-lg bg-sky-500 flex items-center justify-center shrink-0 overflow-hidden">
                          {course.thumbnail ? (
                            <img
                              src={course.thumbnail}
                              alt={course.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <AcademicCapIcon className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-zinc-900 dark:text-white mb-1.5 line-clamp-1 text-sm sm:text-base">
                            {course.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
                            <span className="font-medium">
                              {course.price > 0 ? formatPriceINR(course.price) : 'Free'}
                            </span>
                            <span>•</span>
                            <span>{course.totalSubscriptions || 0} students</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right hidden sm:block">
                            <p className="font-semibold text-sky-500 dark:text-sky-400 text-sm sm:text-base">
                              {formatPriceINR(course.revenue ?? 0)}
                            </p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">revenue</p>
                          </div>
                          <Link
                            to={`/course-manage/${course._id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 rounded-lg bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 hover:bg-sky-200 dark:hover:bg-sky-900/50 transition-colors duration-200"
                            title="Manage Course"
                          >
                            <Cog6ToothIcon className="h-5 w-5" />
                          </Link>
                        </div>
                      </div>
                      {/* Mobile revenue */}
                      <div className="mt-3 sm:hidden pt-3 border-t border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">Revenue</span>
                        <span className="font-semibold text-sky-500 dark:text-sky-400">
                          {formatPriceINR(course.revenue ?? 0)}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Recent Enrollments / Course Students */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, ...TRANSITION }}
          >
            <div className="bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden">
              <div className="p-5 sm:p-6 border-b border-zinc-200 dark:border-zinc-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white">
                    {selectedCourse ? 'Course Students' : 'Recent Enrollments'}
                  </h2>
                  {selectedCourse && (
                    <button
                      onClick={() => setSelectedCourse(null)}
                      className="text-xs sm:text-sm text-sky-500 dark:text-sky-400 hover:text-sky-600 dark:hover:text-sky-300 font-medium transition-colors"
                    >
                      View all
                    </button>
                  )}
                </div>
              </div>

              {selectedCourse ? (
                // Selected Course Students
                <div className="p-4 sm:p-5">
                  <div className="mb-4 pb-4 border-b border-zinc-200 dark:border-zinc-700">
                    <h3 className="font-medium text-zinc-900 dark:text-white text-sm line-clamp-2">
                      {selectedCourse.title}
                    </h3>
                  </div>

                  {!selectedCourse.students?.length ? (
                    <div className="text-center py-8">
                      <UserGroupIcon className="h-10 w-10 mx-auto text-zinc-300 dark:text-zinc-600 mb-2" />
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">No students enrolled yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-128 overflow-y-auto scrollbar-thin">
                      {selectedCourse.students?.map((student) => (
                        <div
                          key={student._id}
                          className="p-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:border-sky-300 dark:hover:border-sky-600 transition-colors duration-200"
                        >
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-zinc-900 dark:text-white text-sm truncate">
                                {student.studentName}
                              </p>
                              <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                                {student.studentEmail}
                              </p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="font-semibold text-sky-500 dark:text-sky-400 text-sm">
                                {formatPriceINR(student.pricePaid ?? 0)}
                              </p>
                              {student.promoCodeUsed && (
                                <div className="flex items-center gap-1 mt-1">
                                  <TagIcon className="h-3 w-3 text-sky-400" />
                                  <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                                    {student.promoCodeUsed}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500">
                            <CalendarIcon className="h-3 w-3" />
                            <span>{new Date(student.subscribedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                // Recent Enrollments
                <div className="p-4 sm:p-5">
                  {!dashboard?.recentSubscriptions?.length ? (
                    <div className="text-center py-8">
                      <ChartBarIcon className="h-10 w-10 mx-auto text-zinc-300 dark:text-zinc-600 mb-2" />
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">No enrollments yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-128 overflow-y-auto scrollbar-thin">
                      {dashboard.recentSubscriptions.map((sub) => (
                        <div
                          key={sub._id}
                          className="p-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:border-sky-300 dark:hover:border-sky-600 transition-colors duration-200"
                        >
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-zinc-900 dark:text-white text-sm truncate">
                                {sub.studentName}
                              </p>
                              <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 mt-0.5">
                                enrolled in <span className="font-medium">{sub.courseTitle}</span>
                              </p>
                            </div>
                            <p className="font-semibold text-sky-500 dark:text-sky-400 text-sm shrink-0">
                              {formatPriceINR(sub.pricePaid ?? 0)}
                            </p>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500">
                            <CalendarIcon className="h-3 w-3" />
                            <span>{new Date(sub.subscribedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
