import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  className?: string;
};

export function ThemedView({ lightColor, darkColor, className, ...otherProps }: Omit<ThemedViewProps, 'style'>) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <View style={{ backgroundColor }} className={className} {...otherProps} />;
}
