import { Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

const TYPE_CLASS_MAP: Record<string, string> = {
  title: 'text-[32px] font-bold leading-8',
  subtitle: 'text-xl font-bold',
  defaultSemiBold: 'text-base leading-6 font-semibold',
  link: 'text-base leading-[30px] text-[#0a7ea4]',
  default: 'text-base leading-6',
} ;

const getTypeClassName = (type: string) => {
  return TYPE_CLASS_MAP[type] || TYPE_CLASS_MAP.default;
};

export function ThemedText({
  lightColor,
  darkColor,
  type = 'default',
  className,
  ...rest
}: Omit<ThemedTextProps, 'style'> & { className?: string }) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const typeClassName = getTypeClassName(type);

  return (
    <Text
      style={{ color }}
      className={`${typeClassName}${className ? ` ${className}` : ''}`}
      {...rest}
    />
  );
}


