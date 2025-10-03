import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider } from '@/contexts/auth-context';
import { ErrorBoundary } from '@/components/ErrorBoundary';

import '../global.css';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    GeistMono: require('../assets/fonts/GeistMono-Regular.ttf'),
    Geist: require('../assets/fonts/Geist-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ErrorBoundary
      errorTitle="Erro na Aplicação"
      errorMessage="Ocorreu um erro inesperado na aplicação. Por favor, reinicie o app."
      onError={(error, errorInfo) => {
        console.error('💥 Erro global capturado:', error);
        console.error('📍 Informações:', errorInfo);
      }}
    >
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
    </ErrorBoundary>
  );
}
