import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AcademicCapIcon,
  CurrencyDollarIcon,
  SparklesIcon,
  CheckCircleIcon,
  TagIcon,
  ArrowLeftIcon,
  UserIcon,
  CalendarIcon,
  XMarkIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  PencilSquareIcon,
  LinkIcon,
  PlayCircleIcon,
  LockClosedIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';
import { coursesAPI, subscriptionAPI, contentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatPriceINR, getInstructorDisplayName } from '../lib/utils';

const contentTypeIcons = {
  video: VideoCameraIcon,
  document: DocumentTextIcon,
  note: PencilSquareIcon,
  link: LinkIcon,
};

const contentTypeColors = {
  video: 'text-red-500 bg-red-100 dark:bg-red-900/30',
  document: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30',
  note: 'text-green-500 bg-green-100 dark:bg-green-900/30',
  link: 'text-purple-500 bg-purple-100 dark:bg-purple-900/30',
};

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isTeacher } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isOwnCourse, setIsOwnCourse] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoValidation, setPromoValidation] = useState(null);
  const [showPromoInput, setShowPromoInput] = useState(false);
  const [subscriptionSuccess, setSubscriptionSuccess] = useState(null);
  const [courseContent, setCourseContent] = useState([]);

  useEffect(() => {
    fetchCourseAndCheckSubscription();
  }, [id]);

  useEffect(() => {
    if (isSubscribed || isOwnCourse) {
      fetchCourseContent();
    }
  }, [isSubscribed, isOwnCourse]);

  const fetchCourseAndCheckSubscription = async () => {
    try {
      setLoading(true);
      const [courseData, subData] = await Promise.all([
        coursesAPI.getById(id),
        subscriptionAPI.checkSubscription(id).catch(() => ({ isSubscribed: false })),
      ]);
      setCourse(courseData.data);
      setIsSubscribed(subData.isSubscribed);
      const instructorId = courseData.data?.instructor?._id || courseData.data?.instructor;
      setIsOwnCourse(user?._id === instructorId);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseContent = async () => {
    try {
      const data = await contentAPI.getCourseContent(id);
      setCourseContent(data.data || []);
    } catch (err) {
      console.error('Error fetching content:', err);
    }
  };

  const validatePromoCode = async () => {
    if (!promoCode.trim()) return;
    try {
      const data = await subscriptionAPI.validatePromo(promoCode);
      setPromoValidation({ valid: true, ...data.data });
    } catch (err) {
      setPromoValidation({ valid: false, message: err.message });
    }
  };

  const calculateDiscountedPrice = () => {
    if (!course || course.price === 0) return 0;
    if (promoValidation?.valid) {
      const discountVal = parseFloat(promoValidation.discount) / 100;
      return course.price * (1 - discountVal);
    }
    return course.price;
  };

  const handleSubscribeClick = () => {
    if (course?.price === 0) {
      handleFreeEnroll();
    } else if (promoValidation?.valid) {
      navigate(`/courses/${id}/checkout`, {
        state: {
          course,
          promoCode,
          originalPrice: course.price,
          finalPrice: calculateDiscountedPrice(),
          discount: promoValidation.discount,
        },
      });
    }
  };

  const handleFreeEnroll = async () => {
    try {
      setSubscribing(true);
      setError('');
      const data = await subscriptionAPI.subscribe(id, undefined);
      setSubscriptionSuccess(data.data);
      setIsSubscribed(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubscribing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-white dark:bg-zinc-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-2 border-sky-500 border-t-transparent" />
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Loading course…</p>
        </div>
      </div>
    );
  }

  if (error && !course) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-white dark:bg-zinc-900">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={() => navigate('/courses')} className="text-sky-500 hover:underline text-sm">
            Back to courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 pt-20 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/courses"
          className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-sky-500 mb-8"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to courses
        </Link>

        <AnimatePresence>
          {subscriptionSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium text-green-800 dark:text-green-200">
                  Enrolled successfully.
                </span>
              </div>
              <button onClick={() => setSubscriptionSuccess(null)}>
                <XMarkIcon className="h-5 w-5 text-green-600" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left: Image + meta */}
          <div className="lg:col-span-1">
            <div className="aspect-video lg:aspect-4/5 rounded-2xl bg-gray-100 dark:bg-zinc-800 overflow-hidden">
              {course?.thumbnail ? (
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <AcademicCapIcon className="h-16 w-16 text-gray-400" />
                </div>
              )}
            </div>
            <div className="mt-4 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              {course?.instructor && (
                <span className="flex items-center gap-1.5">
                  <UserIcon className="h-4 w-4" />
                  {getInstructorDisplayName(course.instructor.name, 0)}
                </span>
              )}
              {course?.createdAt && (
                <span className="flex items-center gap-1.5">
                  <CalendarIcon className="h-4 w-4" />
                  {new Date(course.createdAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>

          {/* Right: Content */}
          <div className="lg:col-span-2">
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                {course?.title}
              </h1>
              {course?.price === 0 ? (
                <span className="px-3 py-1 rounded-full bg-green-500 text-white text-sm font-medium shrink-0">
                  Free
                </span>
              ) : (
                <span className="text-xl font-bold text-gray-900 dark:text-white shrink-0">
                  {formatPriceINR(course?.price)}
                </span>
              )}
            </div>

            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
              {course?.description}
            </p>

            {/* Subscription / CTA */}
            {!user ? (
              <div className="p-5 rounded-2xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700">
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">Login to enroll</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Sign in or create an account to subscribe to this course.
                </p>
                <div className="flex gap-3">
                  <Link
                    to="/login"
                    state={{ from: `/courses/${id}` }}
                    className="flex-1 py-2.5 text-center text-sm font-medium text-white bg-sky-500 rounded-lg hover:bg-sky-600"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    state={{ from: `/courses/${id}` }}
                    className="flex-1 py-2.5 text-center text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-zinc-600 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700"
                  >
                    Sign up
                  </Link>
                </div>
              </div>
            ) : isOwnCourse ? (
              <div className="p-5 rounded-2xl bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800">
                <p className="text-sm font-medium text-sky-800 dark:text-sky-200">Your course</p>
                <p className="text-sm text-sky-600 dark:text-sky-400 mt-0.5">
                  Manage it from your dashboard.
                </p>
              </div>
            ) : isTeacher ? (
              <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                <p className="text-sm font-medium text-amber-800 dark:text-amber-200">Teacher account</p>
                <p className="text-sm text-amber-600 dark:text-amber-400 mt-0.5">
                  You can&apos;t enroll. Create your own courses instead.
                </p>
              </div>
            ) : isSubscribed ? (
              <div className="p-5 rounded-2xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-3">
                  You&apos;re enrolled. Full access to all content.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    to={`/course/${id}/content`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg"
                  >
                    <PlayCircleIcon className="h-4 w-4" />
                    Explore course
                  </Link>
                  <Link
                    to="/my-courses"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-medium rounded-lg border border-green-300 dark:border-green-700 hover:bg-green-100 dark:hover:bg-green-900/50"
                  >
                    View in My Courses
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {error && (
                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                    {error}
                  </div>
                )}

                {course?.price > 0 && (
                  <div className="rounded-2xl border border-gray-200 dark:border-zinc-700 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setShowPromoInput(!showPromoInput)}
                      className="w-full flex items-center justify-between px-5 py-4 text-left bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
                    >
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        Have a promo code?
                      </span>
                      {showPromoInput ? (
                        <ChevronUpIcon className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                    <AnimatePresence>
                      {showPromoInput && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden border-t border-gray-200 dark:border-zinc-700"
                        >
                          <div className="p-5 space-y-4">
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={promoCode}
                                onChange={(e) => {
                                  setPromoCode(e.target.value.toUpperCase());
                                  setPromoValidation(null);
                                }}
                                placeholder="e.g. BFSALE25"
                                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white text-sm"
                              />
                              <button
                                type="button"
                                onClick={validatePromoCode}
                                className="px-4 py-2.5 bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium rounded-lg"
                              >
                                Apply
                              </button>
                            </div>
                            {promoValidation && (
                              <div
                                className={`p-3 rounded-lg text-sm ${
                                  promoValidation.valid
                                    ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                                    : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                                }`}
                              >
                                {promoValidation.valid ? (
                                  <span className="flex items-center gap-2">
                                    <CheckCircleIcon className="h-4 w-4" />
                                    {promoValidation.description} — {promoValidation.discount} off
                                  </span>
                                ) : (
                                  promoValidation.message
                                )}
                              </div>
                            )}
                            {promoValidation?.valid && (
                              <div className="pt-3 border-t border-gray-200 dark:border-zinc-700 space-y-2 text-sm">
                                <div className="flex justify-between text-gray-500 dark:text-gray-400">
                                  <span>Original price</span>
                                  <span className="line-through">{formatPriceINR(course.price)}</span>
                                </div>
                                <div className="flex justify-between text-gray-500 dark:text-gray-400">
                                  <span>Discount</span>
                                  <span className="text-green-500">-{promoValidation.discount}</span>
                                </div>
                                <div className="flex justify-between font-semibold text-gray-900 dark:text-white pt-2">
                                  <span>Final price</span>
                                  <span className="text-sky-500">{formatPriceINR(calculateDiscountedPrice())}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleSubscribeClick}
                  disabled={
                    subscribing ||
                    (course?.price > 0 && !promoValidation?.valid)
                  }
                  className={`w-full py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
                    course?.price === 0
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : promoValidation?.valid
                      ? 'bg-sky-500 hover:bg-sky-600 text-white'
                      : 'bg-gray-200 dark:bg-zinc-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {subscribing ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Enrolling…
                    </>
                  ) : course?.price === 0 ? (
                    <>
                      <SparklesIcon className="h-5 w-5" />
                      Enroll for free
                    </>
                  ) : promoValidation?.valid ? (
                    <>
                      Subscribe for {formatPriceINR(calculateDiscountedPrice())}
                    </>
                  ) : (
                    <>
                      <TagIcon className="h-5 w-5" />
                      Add promo code to subscribe
                    </>
                  )}
                </button>
                {course?.price > 0 && !promoValidation?.valid && (
                  <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                    Try code <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-zinc-700 rounded">BFSALE25</code> for 50% off
                  </p>
                )}
              </div>
            )}

            {/* Course content list */}
            {(isSubscribed || isOwnCourse) && courseContent.length > 0 && (
              <div className="mt-10 pt-8 border-t border-gray-200 dark:border-zinc-700">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Course content ({courseContent.length})
                  </h2>
                  <Link
                    to={`/course/${id}/content`}
                    className="text-sm font-medium text-sky-500 hover:text-sky-600"
                  >
                    Start learning →
                  </Link>
                </div>
                <ul className="space-y-2">
                  {courseContent.map((content, index) => {
                    const Icon = contentTypeIcons[content.type];
                    return (
                      <Link
                        key={content._id}
                        to={`/course/${id}/content/${content._id}`}
                        className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-zinc-700 hover:border-sky-300 dark:hover:border-sky-600 hover:bg-sky-50/50 dark:hover:bg-sky-900/10 transition-colors"
                      >
                        <span className="text-xs font-medium text-gray-400 w-6">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <div className={`p-1.5 rounded-lg ${contentTypeColors[content.type]}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="flex-1 text-sm font-medium text-gray-900 dark:text-white truncate">
                          {content.title}
                        </span>
                        <PlayCircleIcon className="h-4 w-4 text-sky-500" />
                      </Link>
                    );
                  })}
                </ul>
              </div>
            )}

            {!isSubscribed && !isOwnCourse && (
              <div className="mt-10 pt-8 border-t border-gray-200 dark:border-zinc-700">
                <div className="p-8 rounded-2xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-center">
                  <LockClosedIcon className="h-10 w-10 mx-auto text-gray-400 mb-3" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Enroll to access all lessons and materials.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
