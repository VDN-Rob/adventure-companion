import { ExchangeRateRepository } from "@/database/exchangeRateRepository";
import { useSQLiteContext } from "expo-sqlite";
import { useMemo } from "react";

export function useExchangeRateRepository() {
  const db = useSQLiteContext();

  return useMemo(
    () => new ExchangeRateRepository(db),
    [db]
  );
}