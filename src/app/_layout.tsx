import { setupDatabase } from "@/database/database";
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
    <Stack />
  </SQLiteProvider>
  );
}
