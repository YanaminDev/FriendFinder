// ─── cn – Utility for combining Tailwind class strings ───────────────────────
// Thin wrapper around clsx; keeps component code clean.
//
//   cn('px-4 py-2', isActive && 'bg-primary', 'rounded-full')

import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(...inputs);
}
