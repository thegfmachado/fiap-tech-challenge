import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TouchableOpacityProps,
} from 'react-native';

import { cva } from 'class-variance-authority';
import { useThemeColor } from '@/hooks/useThemeColor';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const buttonVariants = cva('rounded-lg items-center justify-center flex-row', {
  variants: {
    variant: {
      primary: 'bg-primary text-primary-foreground',
      secondary: 'bg-secondary text-secondary-foreground',
      ghost: 'bg-transparent text-primary',
    },
    size: {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    },
    disabled: {
      true: 'opacity-50',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'lg',
  },
});

const textVariants = cva('', {
  variants: {
    variant: {
      primary: 'text-primary-foreground font-semibold',
      secondary: 'text-secondary-foreground font-semibold',
      ghost: 'text-primary font-medium',
    },
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'lg',
  },
});

export function Button({
  title,
  loading = false,
  variant = 'primary',
  size = 'lg',
  disabled,
  className,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const tintColor = useThemeColor({}, 'tint');
  const textOnPrimary = useThemeColor({}, 'textOnPrimary');

  return (
    <TouchableOpacity
      {...props}
      disabled={isDisabled}
      className={`
        ${buttonVariants({ variant, size, disabled: isDisabled })}
        ${className || ''}
      `}
    >
      {loading && (
        <ActivityIndicator
          color={variant === 'primary' ? textOnPrimary : tintColor}
          size="small"
          className="mr-2"
        />
      )}

      <Text className={textVariants({ variant, size })}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
