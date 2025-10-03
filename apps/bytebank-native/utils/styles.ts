import { StyleSheet } from 'react-native';
import { COLORS, SIZES, LAYOUT, ANIMATIONS } from './constants';

export const commonStyles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  flexRow: {
    flexDirection: 'row',
  },
  
  flexRowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  flexRowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  padding: {
    padding: LAYOUT.PADDING_MEDIUM,
  },
  
  paddingHorizontal: {
    paddingHorizontal: LAYOUT.PADDING_MEDIUM,
  },
  
  paddingVertical: {
    paddingVertical: LAYOUT.PADDING_MEDIUM,
  },
  
  marginBottom: {
    marginBottom: LAYOUT.PADDING_MEDIUM,
  },
  
  gap: {
    gap: LAYOUT.PADDING_SMALL,
  },

  border: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  
  borderTop: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  
  rounded: {
    borderRadius: LAYOUT.BORDER_RADIUS_MEDIUM,
  },
  
  roundedLarge: {
    borderRadius: LAYOUT.BORDER_RADIUS_LARGE,
  },
  
  backgroundWhite: {
    backgroundColor: '#ffffff',
  },
  
  backgroundGray: {
    backgroundColor: '#f9fafb',
  },
  
  backgroundPrimary: {
    backgroundColor: COLORS.PRIMARY_LIGHT,
  },

  shadow: {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  shadowLarge: {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },

  textCenter: {
    textAlign: 'center',
  },
  
  textBold: {
    fontWeight: 'bold',
  },
  
  textSemibold: {
    fontWeight: '600',
  },
  
  textMedium: {
    fontWeight: '500',
  },

  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: LAYOUT.BORDER_RADIUS_MEDIUM,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  buttonPrimary: {
    backgroundColor: COLORS.PRIMARY_LIGHT,
  },
  
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  
  buttonDanger: {
    backgroundColor: COLORS.DANGER,
  },

  spinner: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: COLORS.PRIMARY_LIGHT,
    borderTopColor: 'transparent',
  },
  
  spinnerWhite: {
    width: 16,
    height: 16,
    borderWidth: 2,
    borderRadius: 8,
    borderColor: 'transparent',
    borderTopColor: '#ffffff',
  },
  
  spinnerSmall: {
    width: 16,
    height: 16,
    borderWidth: 2,
    borderRadius: 8,
    borderColor: '#d1d5db',
    borderTopColor: COLORS.PRIMARY_LIGHT,
  },

  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: LAYOUT.BORDER_RADIUS_MEDIUM,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
    fontSize: 14,
  },
  
  inputFocused: {
    borderColor: COLORS.PRIMARY_LIGHT,
  },
  
  inputError: {
    borderColor: COLORS.DANGER,
  },
  
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  
  errorText: {
    fontSize: 12,
    color: COLORS.DANGER,
    marginTop: 4,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },

  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  
  listItemContent: {
    flex: 1,
  },
  
  listItemTitle: {
    fontSize: 14,
    color: '#111827',
    marginBottom: 2,
  },
  
  listItemSubtitle: {
    fontSize: 14,
    color: '#6b7280', // gray-500
  },

  // Card styles
  card: {
    backgroundColor: '#ffffff',
    borderRadius: LAYOUT.BORDER_RADIUS_MEDIUM,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  
  cardGray: {
    backgroundColor: '#f9fafb',
    borderRadius: LAYOUT.BORDER_RADIUS_MEDIUM,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  // Utility classes
  opacity50: {
    opacity: 0.5,
  },
  
  opacity75: {
    opacity: 0.75,
  },
  
  absolute: {
    position: 'absolute',
  },
  
  absoluteFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

/**
 * Typography styles
 */
export const textStyles = StyleSheet.create({
  // Headers
  h1: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
    lineHeight: 40,
  },
  
  h2: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    lineHeight: 32,
  },
  
  h3: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    lineHeight: 28,
  },
  
  h4: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    lineHeight: 24,
  },

  // Body text
  bodyLarge: {
    fontSize: 16,
    color: '#111827',
    lineHeight: 24,
  },
  
  body: {
    fontSize: 14,
    color: '#111827',
    lineHeight: 20,
  },
  
  bodySmall: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 16,
  },

  // Specialized text
  caption: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 16,
  },
  
  link: {
    fontSize: 14,
    color: COLORS.PRIMARY_LIGHT,
    textDecorationLine: 'underline',
  },
  
  error: {
    fontSize: 12,
    color: COLORS.DANGER,
    lineHeight: 16,
  },
  
  success: {
    fontSize: 14,
    color: COLORS.SUCCESS,
    fontWeight: '500',
  },

  // Button text
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  
  buttonTextSmall: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});

/**
 * Animation styles
 */
export const animationStyles = StyleSheet.create({
  fadeIn: {
    opacity: 1,
  },
  
  fadeOut: {
    opacity: 0,
  },
  
  slideUp: {
    transform: [{ translateY: 0 }],
  },
  
  slideDown: {
    transform: [{ translateY: 100 }],
  },
  
  scaleIn: {
    transform: [{ scale: 1 }],
  },
  
  scaleOut: {
    transform: [{ scale: 0.9 }],
  },
});