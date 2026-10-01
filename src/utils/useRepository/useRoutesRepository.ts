import { RoutesRepository } from "@/database/dataAccessLayer/routeRepository";
import { useSQLiteContext } from "expo-sqlite";
import { useMemo } from "react";

export function useRoutesRepository() {
  const db = useSQLiteContext();

  return useMemo(
    () => new RoutesRepository(db),
    [db]
  );
}