import React, { useState } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  CreditCardIcon,
  CheckCircleIcon,
  AcademicCapIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';
import { subscriptionAPI } from '../services/api';
import { formatPriceINR, getInstructorDisplayName } from '../lib/utils';

export default function Checkout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { course, promoCode, originalPrice, finalPrice, discount } = location.state || {};
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  if (!course || finalPrice === undefined) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-white dark:bg-zinc-900">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Missing checkout details.</p>
          <Link to={`/courses/${id}`} className="text-sky-500 hover:underline">
            Back to course
          </Link>
        </div>
      </div>
    );
  }

  const handleConfirmPayment = async () => {
    try {
      setProcessing(true);
      setError('');
      await subscriptionAPI.subscribe(id, course.price > 0 ? promoCode : undefined);
      navigate(`/courses/${id}`, { state: { paymentSuccess: true } });
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 pt-20 pb-12">
      <div className="max-w-lg mx-auto px-4 sm:px-6">
        <Link
          to={`/courses/${id}`}
          className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-sky-500 mb-8"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to course
        </Link>

        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg border border-gray-200 dark:border-zinc-700 overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100 dark:border-zinc-700">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              Complete payment
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Secure dummy checkout — no real charge
            </p>
          </div>

          {/* Course summary */}
          <div className="p-6 border-b border-gray-100 dark:border-zinc-700">
            <div className="flex gap-4">
              <div className="w-20 h-20 rounded-xl bg-gray-100 dark:bg-zinc-700 shrink-0 overflow-hidden">
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <AcademicCapIcon className="h-8 w-8 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <h2 className="font-semibold text-gray-900 dark:text-white truncate">
                  {course.title}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  {getInstructorDisplayName(course.instructor?.name, 0)}
                </p>
              </div>
            </div>
          </div>

          {/* Order summary */}
          <div className="p-6 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Original price</span>
              <span className="text-gray-900 dark:text-white line-through">
                {formatPriceINR(originalPrice)}
              </span>
            </div>
            {discount && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Discount</span>
                <span className="text-green-500">-{discount}</span>
              </div>
            )}
            <div className="flex justify-between pt-3 border-t border-gray-100 dark:border-zinc-700">
              <span className="font-medium text-gray-900 dark:text-white">Total</span>
              <span className="text-xl font-bold text-sky-500">
                {formatPriceINR(finalPrice)}
              </span>
            </div>
          </div>

          {/* Dummy payment note */}
          <div className="px-6 pb-4">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
              <LockClosedIcon className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />
              <p className="text-sm text-amber-800 dark:text-amber-200">
                This is a demo. Click &quot;Confirm payment&quot; to enroll — no real payment is processed.
              </p>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mx-6 mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Confirm button */}
          <div className="p-6 pt-0">
            <button
              onClick={handleConfirmPayment}
              disabled={processing}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing…
                </>
              ) : (
                <>
                  <CreditCardIcon className="h-5 w-5" />
                  Confirm payment — {formatPriceINR(finalPrice)}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
