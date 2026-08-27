import { setupDatabase } from "@/database/database";
import { AppServicesProvider } from "@/providers/AppServicesProvider";
import { useFonts } from 'expo-font';
import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { SQLiteProvider } from "expo-sqlite";
import { useEffect } from "react";

// Root layout of the app
// Initializes the database
export default function RootLayout() {

  const [fontsLoaded] = useFonts({
    'Rajdhani-Regular': require('@/assets/fonts/Rajdhani-Regular.ttf'),
    'Rajdhani-SemiBold': require('@/assets/fonts/Rajdhani-SemiBold.ttf'),
    'Rajdhani-Bold': require('@/assets/fonts/Rajdhani-Bold.ttf'),

    'Inter-Regular': require('@/assets/fonts/Inter-Regular.ttf'),
    'Inter-Medium': require('@/assets/fonts/Inter-Medium.ttf'),
    'Inter-SemiBold': require('@/assets/fonts/Inter-SemiBold.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }
  
  return (
  <SQLiteProvider
    databaseName="cycling.db"
    onInit={setupDatabase}
  >
    
    <AppServicesProvider>
      <Stack />
    </AppServicesProvider>
  </SQLiteProvider>
  );
}
