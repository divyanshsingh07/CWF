import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  AcademicCapIcon,
  CheckBadgeIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ArrowRightIcon,
  PlayCircleIcon,
  EyeIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { subscriptionAPI } from '../services/api';

export default function MyCourses() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    fetchMySubscriptions();
  }, []);

  const fetchMySubscriptions = async () => {
    try {
      setLoading(true);
      const data = await subscriptionAPI.getMyCourses();
      setSubscriptions(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSubscription = async (subscriptionId, isFree) => {
    if (!isFree) return;
    try {
      setRemovingId(subscriptionId);
      setError('');
      await subscriptionAPI.removeSubscription(subscriptionId);
      setSubscriptions((prev) => prev.filter((s) => s._id !== subscriptionId));
    } catch (err) {
      setError(err.message);
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-white dark:bg-zinc-800">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your courses...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen pt-20 pb-12 bg-white dark:bg-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 pt-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400">
            <CheckBadgeIcon className="h-5 w-5" />
            <span className="text-sm font-medium">Enrolled Courses</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            My Courses
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Track your enrolled courses and continue learning
          </p>
        </motion.div>

        {/* Error Message */}
        {error && (
          <div className="text-center mb-8 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Subscriptions List */}
        {subscriptions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <AcademicCapIcon className="h-20 w-20 mx-auto text-gray-300 dark:text-gray-600 mb-6" />
            <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-3">
              No courses yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
              You haven't enrolled in any courses yet. Explore our collection and start learning today!
            </p>
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-sky-500 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
            >
              Browse Courses
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {subscriptions.map((subscription, index) => (
              <motion.div
                key={subscription._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="group bg-white dark:bg-zinc-900 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-zinc-700">
                  <div className="flex flex-col sm:flex-row">
                    {/* Thumbnail */}
                    <div className="sm:w-48 md:w-64 h-40 sm:h-auto bg-linear-to-br from-sky-500 to-cyan-500 relative shrink-0">
                      {subscription.courseId?.thumbnail ? (
                        <img
                          src={subscription.courseId.thumbnail}
                          alt={subscription.courseId?.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <AcademicCapIcon className="h-12 w-12 text-white/50" />
                        </div>
                      )}
                      {/* Enrolled Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                          <CheckBadgeIcon className="h-3 w-3" />
                          Enrolled
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-5 sm:p-6">
                      <div className="flex flex-col h-full justify-between">
                        <div>
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
                            {subscription.courseId?.title || 'Course'}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                            {subscription.courseId?.description || 'No description available'}
                          </p>
                        </div>

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="h-4 w-4" />
                            <span>
                              Enrolled: {new Date(subscription.subscribedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <CurrencyDollarIcon className="h-4 w-4" />
                            <span>
                              Paid: ${subscription.pricePaid}
                              {subscription.promoCodeUsed && (
                                <span className="text-green-500 ml-1">
                                  ({subscription.promoCodeUsed})
                                </span>
                              )}
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center gap-3">
                          <Link
                            to={`/course/${subscription.courseId?._id}/content`}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-sky-500 to-cyan-500 text-white text-sm font-semibold rounded-lg hover:shadow-lg hover:shadow-sky-500/30 transition-all"
                          >
                            <PlayCircleIcon className="h-4 w-4" />
                            Continue Learning
                          </Link>
                          <Link
                            to={`/courses/${subscription.courseId?._id}`}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-gray-200 text-sm font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-600 transition-all"
                          >
                            <EyeIcon className="h-4 w-4" />
                            View Details
                          </Link>
                          {/* Remove option - only for free course subscriptions */}
                          {(subscription.pricePaid === 0 || subscription.courseId?.price === 0) && (
                            <button
                              type="button"
                              onClick={() => handleRemoveSubscription(subscription._id, true)}
                              disabled={removingId === subscription._id}
                              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-all disabled:opacity-50"
                            >
                              {removingId === subscription._id ? (
                                <>
                                  <span className="inline-block w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                                  Removing…
                                </>
                              ) : (
                                <>
                                  <TrashIcon className="h-4 w-4" />
                                  Remove from My Courses
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Stats Section */}
        {subscriptions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 text-center shadow-lg border border-gray-200 dark:border-zinc-700">
              <div className="text-3xl font-bold text-sky-500 mb-2">
                {subscriptions.length}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Total Courses</div>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 text-center shadow-lg border border-gray-200 dark:border-zinc-700">
              <div className="text-3xl font-bold text-green-500 mb-2">
                ${subscriptions.reduce((sum, s) => sum + (s.pricePaid || 0), 0).toFixed(2)}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Total Invested</div>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 text-center shadow-lg border border-gray-200 dark:border-zinc-700">
              <div className="text-3xl font-bold text-cyan-500 mb-2">
                {subscriptions.filter((s) => s.promoCodeUsed).length}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Promos Used</div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
