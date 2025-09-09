import { Platform } from 'react-native';

export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
export const isWeb = Platform.OS === 'web';
export const isWindows = Platform.OS === 'windows';
export const isMacOS = Platform.OS === 'macos';

export const isMobile = isIOS || isAndroid;
export const isNative = !isWeb;

