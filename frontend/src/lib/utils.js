import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatPriceINR(amount) {
  const n = Number(amount);
  if (n === 0 || Number.isNaN(n)) return 'FREE';
  return `₹${n.toLocaleString('en-IN', { maximumFractionDigits: 0, minimumFractionDigits: 0 })}`;
}

const INDIAN_INSTRUCTOR_NAMES = [
  'Divyansh Singh',
  'Rohit Sharma',
  'Aditya Verma',
  'Priya Patel',
  'Arjun Nair',
  'Kavya Reddy',
];

/** Display name for instructor; use Indian name for generic/demo names. */
export function getInstructorDisplayName(name, index = 0) {
  if (!name || typeof name !== 'string') return 'Instructor';
  const trimmed = name.trim();
  if (/professor\s+smith/i.test(trimmed) || trimmed === 'Professor Smith') {
    return INDIAN_INSTRUCTOR_NAMES[index % INDIAN_INSTRUCTOR_NAMES.length];
  }
  return trimmed;
}

