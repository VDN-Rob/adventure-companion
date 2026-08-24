import { setupDatabase } from "@/database/database";
import { AppServicesProvider } from "@/providers/AppServicesProvider";
import { Stack } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";

// Root layout of the app
// Initializes the database
export default function RootLayout() {

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
