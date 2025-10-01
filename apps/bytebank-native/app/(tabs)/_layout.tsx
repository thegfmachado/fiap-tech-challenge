import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { DashboardProvider } from '@/contexts/dashboard-context';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthGuard>
      <DashboardProvider>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
            tabBarActiveBackgroundColor: Colors[colorScheme ?? "light"].gradient,
            tabBarItemStyle: {
              borderRadius: 12,
              marginHorizontal: 8,
            },
            headerShown: false,
            tabBarButton: HapticTab,
            tabBarBackground: TabBarBackground,
            tabBarStyle: {
              backgroundColor: Colors[colorScheme ?? "light"].background
            },
          }}>
          <Tabs.Screen
            name="index"
            options={{
              title: 'Transações',
              tabBarIcon: ({ color }) => <IconSymbol size={28} name="arrow.right.arrow.left" color={color} />,
            }}
          />
          <Tabs.Screen
            name="dashboard"
            options={{
              title: 'Dashboard',
              tabBarIcon: ({ color }) => <IconSymbol size={28} name="chart.line.uptrend.xyaxis.circle.fill" color={color} />,
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: 'Conta',
              tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
            }}
          />
        </Tabs>
      </DashboardProvider>
    </AuthGuard>
  );
}
