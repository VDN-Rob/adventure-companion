import { DaysRepository } from "@/database/dayRepository";
import { useSQLiteContext } from "expo-sqlite";
import { useMemo } from "react";

export function useDaysRepository() {
  const db = useSQLiteContext();

  return useMemo(
    () => new DaysRepository(db),
    [db]
  );
}