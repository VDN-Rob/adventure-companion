import { PoisRepository } from "@/database/poiRepository";
import { useSQLiteContext } from "expo-sqlite";
import { useMemo } from "react";

export function usePoisRepository() {
  const db = useSQLiteContext();

  return useMemo(
    () => new PoisRepository(db),
    [db]
  );
}