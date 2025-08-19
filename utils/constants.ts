import { Mood, Key } from '../types';

// UI Constants
export const UI_CONSTANTS = {
  MAX_WIDTHS: {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  },
  BUTTON_VARIANTS: {
    primary: 'bg-purple-600 hover:bg-purple-500 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-500 text-white',
    success: 'bg-green-600 hover:bg-green-500 text-white',
    danger: 'bg-red-600 hover:bg-red-500 text-white',
    ghost: 'bg-transparent hover:bg-gray-700 text-gray-300 border border-gray-600',
  },
  BUTTON_SIZES: {
    sm: 'py-1.5 px-3 text-sm',
    md: 'py-2 px-4 text-sm',
    lg: 'py-3 px-6 text-base',
  },
  SPINNER_SIZES: {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-5xl',
  },
} as const;

// Filter Options
export const FILTER_OPTIONS = {
  MOOD: Object.values(Mood),
  KEY: Object.values(Key),
} as const;

// Animation and Transition Classes
export const ANIMATIONS = {
  fadeIn: 'animate-fadeIn',
  spinSlow: 'animate-spin-slow',
  hover: 'hover:scale-105',
  transition: 'transition-all duration-300',
} as const;

// Common CSS Classes
export const COMMON_CLASSES = {
  input: 'w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors',
  button: 'font-bold rounded-lg transition-colors flex items-center justify-center',
  card: 'bg-gray-800 rounded-lg shadow-lg border border-gray-700',
  modal: 'fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4',
  container: 'container mx-auto px-4',
} as const;