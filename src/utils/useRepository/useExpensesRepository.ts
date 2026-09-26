import { ExpensesRepository } from "@/database/dataAccessLayer/expenseRepository";
import { useSQLiteContext } from "expo-sqlite";
import { useMemo } from "react";

export function useExpensesRepository() {
  const db = useSQLiteContext();

  return useMemo(
    () => new ExpensesRepository(db),
    [db]
  );
}