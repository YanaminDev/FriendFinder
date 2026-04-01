// ─── FriendFinder Theme ────────────────────────────────────────────────────────

export const colors = {
  // ── Brand ──────────────────────────────────────────────────────────────────
  primary:      '#F47B7B',   // ชมพูหลัก
  primaryDark:  '#E05555',   // ชมพูเข้ม (pressed)
  primaryLight: '#FDEAEA',   // ชมพูอ่อน (background)

  // ── Semantic ───────────────────────────────────────────────────────────────
  success:      '#22c55e',   // เขียว  (online, success)
  warning:      '#f59e0b',   // เหลือง (warning)
  danger:       '#ef4444',   // แดง    (error, delete)
  dangerLight:  '#fef2f2',   // แดงอ่อน

  // ── Neutral ────────────────────────────────────────────────────────────────
  white:        '#ffffff',
  gray50:       '#f9fafb',
  gray100:      '#f3f4f6',
  gray200:      '#e5e7eb',
  gray300:      '#d1d5db',
  gray400:      '#9ca3af',
  gray500:      '#6b7280',
  gray700:      '#374151',
  gray900:      '#111827',
  black:        '#000000',
} as const;

// ── Typography ────────────────────────────────────────────────────────────────
export const fontSize = {
  '2xs': 10,
  xs:    12,
  sm:    14,
  base:  16,
  lg:    18,
  xl:    20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
} as const;

// ── Spacing ───────────────────────────────────────────────────────────────────
export const spacing = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
  '2xl': 48,
} as const;

// ── Border radius ─────────────────────────────────────────────────────────────
export const radius = {
  sm:   8,
  md:   12,
  lg:   16,
  xl:   20,
  full: 9999,
} as const;
