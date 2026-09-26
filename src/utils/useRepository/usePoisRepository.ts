import { POIsRepository } from "@/database/dataAccessLayer/poiRepository";
import { useSQLiteContext } from "expo-sqlite";
import { useMemo } from "react";

export function usePoisRepository() {
  const db = useSQLiteContext();

  return useMemo(
    () => new POIsRepository(db),
    [db]
  );
}