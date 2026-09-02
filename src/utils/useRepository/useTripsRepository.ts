import { TripsRepository } from "@/database/tripRepository";
import { useSQLiteContext } from "expo-sqlite";
import { useMemo } from "react";

export function useTripsRepository() {
  const db = useSQLiteContext();

  return useMemo(
    () => new TripsRepository(db),
    [db]
  );
}