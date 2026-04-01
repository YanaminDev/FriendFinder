// ─── Button ────────────────────────────────────────────────────────────────────

import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { cn } from '../../utils/cn';

export type ButtonVariant = 'filled' | 'outline' | 'light';
export type ButtonSize    = 'sm' | 'md' | 'lg';
export type ButtonColor   = 'primary' | 'danger' | 'gray';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?:  ButtonVariant;
  size?:     ButtonSize;
  color?:    ButtonColor;
  disabled?: boolean;
  loading?:  boolean;
  className?: string;
}

// ── size map ──────────────────────────────────────────────────────────────────
const SIZE_BTN: Record<ButtonSize, string> = {
  sm: 'h-10  px-4  rounded-full',
  md: 'h-13  px-6  rounded-full',
  lg: 'h-14  px-8  rounded-full',
};
const SIZE_TEXT: Record<ButtonSize, string> = {
  sm: 'text-sm  font-medium',
  md: 'text-base font-semibold tracking-wide',
  lg: 'text-lg  font-semibold tracking-wide',
};

// ── variant × color map ───────────────────────────────────────────────────────
type StyleKey = `${ButtonVariant}-${ButtonColor}`;

const BTN_BG: Record<StyleKey, string> = {
  'filled-primary':  'bg-primary',
  'filled-danger':   'bg-danger',
  'filled-gray':     'bg-gray-200',
  'outline-primary': 'border border-primary',
  'outline-danger':  'border border-danger',
  'outline-gray':    'border border-gray-300',
  'light-primary':   'bg-primary-light',
  'light-danger':    'bg-danger-light',
  'light-gray':      'bg-gray-100',
};

const TEXT_COLOR: Record<StyleKey, string> = {
  'filled-primary':  'text-white',
  'filled-danger':   'text-white',
  'filled-gray':     'text-gray-700',
  'outline-primary': 'text-primary',
  'outline-danger':  'text-danger',
  'outline-gray':    'text-gray-700',
  'light-primary':   'text-primary',
  'light-danger':    'text-danger',
  'light-gray':      'text-gray-700',
};

const SPINNER_COLOR: Record<StyleKey, string> = {
  'filled-primary':  '#fff',
  'filled-danger':   '#fff',
  'filled-gray':     '#374151',
  'outline-primary': '#F47B7B',
  'outline-danger':  '#ef4444',
  'outline-gray':    '#374151',
  'light-primary':   '#F47B7B',
  'light-danger':    '#ef4444',
  'light-gray':      '#374151',
};

// ── component ─────────────────────────────────────────────────────────────────
const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant  = 'filled',
  size     = 'md',
  color    = 'primary',
  disabled = false,
  loading  = false,
  className,
}) => {
  const key = `${variant}-${color}` as StyleKey;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      className={cn(
        'items-center justify-center flex-row',
        SIZE_BTN[size],
        BTN_BG[key],
        (disabled || loading) && 'opacity-50',
        className,
      )}
    >
      {loading ? (
        <ActivityIndicator color={SPINNER_COLOR[key]} />
      ) : (
        <Text className={cn(SIZE_TEXT[size], TEXT_COLOR[key])}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;
