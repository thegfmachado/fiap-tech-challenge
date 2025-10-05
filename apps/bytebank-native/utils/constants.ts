/**
 * Application constants
 * Centralized location for colors, sizes, and other app-wide constants
 */

/**
 * Color constants
 */
export const COLORS = {
  // Primary colors
  PRIMARY: '#664373',
  PRIMARY_LIGHT: '#AA8BB5',
  DANGER: '#dc2626',
  
  // Gray tones
  GRAY_LIGHT: '#f3f4f6',
  GRAY_MEDIUM: '#6b7280',
  GRAY_DARK: '#374151',
  
  // Additional semantic colors (add as needed)
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  INFO: '#3b82f6',
} as const;

/**
 * Size constants
 */
export const SIZES = {
  // Icon sizes
  ICON_LARGE: 76,
  ICON_MEDIUM: 24,
  ICON_SMALL: 16,
  
  // Component sizes (add as needed)
  BUTTON_HEIGHT: 48,
  INPUT_HEIGHT: 44,
} as const;

/**
 * Layout constants
 */
export const LAYOUT = {
  // Padding and margins
  PADDING_SMALL: 8,
  PADDING_MEDIUM: 16,
  PADDING_LARGE: 24,
  
  // Border radius
  BORDER_RADIUS_SMALL: 4,
  BORDER_RADIUS_MEDIUM: 8,
  BORDER_RADIUS_LARGE: 12,
} as const;

/**
 * Animation constants
 */
export const ANIMATIONS = {
  // Duration in milliseconds
  DURATION_FAST: 150,
  DURATION_NORMAL: 300,
  DURATION_SLOW: 500,
} as const;