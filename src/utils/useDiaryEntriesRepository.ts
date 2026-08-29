import { DiaryEntriesRepository } from "@/database/diaryEntryRepository";
import { useSQLiteContext } from "expo-sqlite";
import { useMemo } from "react";

export function useDiaryEntriesRepository() {
  const db = useSQLiteContext();

  return useMemo(
    () => new DiaryEntriesRepository(db),
    [db]
  );
}