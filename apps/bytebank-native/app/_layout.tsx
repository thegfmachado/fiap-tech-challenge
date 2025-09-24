import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider } from '@/contexts/auth-context';
import IntroSlider from '@/components/IntroSlider';

import '../global.css';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [storageLoading, setStorageLoading] = React.useState(true);
  const [firstLaunch, setFirstLaunch] = React.useState<boolean | null>(null);

  const [fontsLoaded] = useFonts({
    GeistMono: require('../assets/fonts/GeistMono-Regular.ttf'),
    Geist: require('../assets/fonts/Geist-Regular.ttf'),
  });

  React.useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const hasLaunched = await AsyncStorage.getItem("hasLaunched");
        if (hasLaunched === null) {
          setFirstLaunch(true);
        } else {
          setFirstLaunch(false);
        }
      } catch (err) {
        console.log("Error checking launch state:", err);
      } finally {
        setStorageLoading(false);
      }
    };

    checkFirstLaunch();
  }, []);

  const handleDone = async () => {
    try {
      await AsyncStorage.setItem("hasLaunched", "true");
      setFirstLaunch(false);
    } catch (err) {
      console.log("Error setting launch state:", err);
    }
  };

  if (!fontsLoaded) {
    // Async font loading only occurs in development.
    return null;
  }

  if (storageLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator color="#664373" size="large" />
      </View>
    );
  }

  return firstLaunch ?
    (
      <IntroSlider onDone={handleDone} />
    ) : (
      <AuthProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack initialRouteName="(auth)">
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </AuthProvider>
    );
}
