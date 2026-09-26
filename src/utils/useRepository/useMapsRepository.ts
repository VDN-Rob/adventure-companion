import { OfflineMapsRepository } from "@/database/dataAccessLayer/mapsRepository";
import { useSQLiteContext } from "expo-sqlite";
import { useMemo } from "react";

export function useMapsRepository() {
  const db = useSQLiteContext();

  return useMemo(
    () => new OfflineMapsRepository(db),
    [db]
  );
}