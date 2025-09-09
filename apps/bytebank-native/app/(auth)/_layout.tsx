import { GuestOnly } from "@/components/auth/AuthGuard";
import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <GuestOnly>
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
      </Stack>
    </GuestOnly>
  );
}
