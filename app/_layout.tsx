import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { HistoryProvider } from "@/contexts/HistoryContext";
import { useFrameworkReady } from "@/hooks/useFrameworkReady";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

function RootLayoutNav() {
  const router = useRouter();
  const segments = useSegments();
  const { session, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "auth";

    if (!session && !inAuthGroup) {
      router.replace("/auth/sign-in");
    } else if (session && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [session, loading, segments, router]);

  return (
    <Stack
      initialRouteName={!session ? "auth/sign-in" : "(tabs)"}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="auth/sign-in" />
      <Stack.Screen name="auth/sign-up" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="history-detail" />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  useFrameworkReady();

  return (
    <AuthProvider>
      <HistoryProvider>
        <RootLayoutNav />
        <StatusBar style="auto" />
      </HistoryProvider>
    </AuthProvider>
  );
}
