import { MapsRepository } from "@/database/mapsRepository";
import { useSQLiteContext } from "expo-sqlite";
import { useMemo } from "react";

export function useMapsRepository() {
  const db = useSQLiteContext();

  return useMemo(
    () => new MapsRepository(db),
    [db]
  );
}