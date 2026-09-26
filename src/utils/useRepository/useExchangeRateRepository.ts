import { ExchangeRateRepository } from "@/database/dataAccessLayer/exchangeRateRepository";
import { useSQLiteContext } from "expo-sqlite";
import { useMemo } from "react";

export function useExchangeRateRepository() {
  const db = useSQLiteContext();

  return useMemo(
    () => new ExchangeRateRepository(db),
    [db]
  );
}