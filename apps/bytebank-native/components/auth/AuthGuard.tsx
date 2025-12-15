import React from 'react';
import { ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '../../contexts/auth-context';
import { ThemedView } from '../ui/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * AuthGuard component that protects authenticated routes
 * Redirects to login if user is not authenticated
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading } = useAuth();
  const tintColor = useThemeColor({}, 'tint');

  if (loading) {
    return (
      <ThemedView className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color={tintColor} />
      </ThemedView>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Redirect href="/login" />;
  }

  // User is authenticated, render protected content
  return <>{children}</>;
}

/**
 * Component for auth screens that redirects authenticated users to main app
 */
interface GuestOnlyProps {
  children: React.ReactNode;
}

export function GuestOnly({ children }: GuestOnlyProps) {
  const { user, loading } = useAuth();
  const tintColor = useThemeColor({}, 'tint');

  if (loading) {
    return (
      <ThemedView className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color={tintColor} />
      </ThemedView>
    );
  }

  // Redirect to main app if already authenticated
  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  // User is not authenticated, show auth screens
  return <>{children}</>;
}
