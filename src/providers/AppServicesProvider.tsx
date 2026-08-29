import { DayServices } from "@/services/DayService";
import { DiaryEntryServices } from "@/services/DiaryEntryService";
import { ExpenseServices } from "@/services/ExpenseService";
import { MapServices } from "@/services/MapService";
import { useNetworkStatus } from "@/services/NetworkServices";
import { POIServices } from "@/services/POIService";
import { TripMapServices } from "@/services/tripMapService";
import { TripServices } from "@/services/TripService";
import { useDaysRepository } from "@/utils/useDaysRepository";
import { useDiaryEntriesRepository } from "@/utils/useDiaryEntriesRepository";
import { useExpensesRepository } from "@/utils/useExpensesRepository";
import { useMapsRepository } from "@/utils/useMapsRepository";
import { usePoisRepository } from "@/utils/usePoisRepository";
import { useTripsRepository } from "@/utils/useTripsRepository";
import { createContext, useMemo } from "react";

interface AppServices {
  tripServices: TripServices;
  dayServices: DayServices;
  poiServices: POIServices;
  mapServices: MapServices;
  tripMapServices: TripMapServices;
  expenseServices: ExpenseServices;
  diaryEntryServices: DiaryEntryServices;
  isOnline: boolean | null;
}
export const AppServicesContext = createContext<AppServices | null>(null);

export function AppServicesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const tripsRepository = useTripsRepository();
  const daysRepository = useDaysRepository();
  const poisRepository = usePoisRepository();
  const mapsRepository = useMapsRepository();
  const expensesRepository = useExpensesRepository();
  const diaryEntriesRepository = useDiaryEntriesRepository();

  const isOnline = useNetworkStatus();

  const tripServices = useMemo(
    () => new TripServices(
      tripsRepository,
      daysRepository
    ),
    [tripsRepository, daysRepository]
  );

  const dayServices = useMemo(
    () => new DayServices(daysRepository),
    [daysRepository]
  );

  const poiServices = useMemo(
    () => new POIServices(
      poisRepository
    ),
    [poisRepository]
  );

  const mapServices = useMemo(
    () => new MapServices(mapsRepository),
    [mapsRepository]
  );

  const tripMapServices = useMemo(
    () => new TripMapServices(
      tripsRepository,
      daysRepository,
      poisRepository
    ),
    [tripsRepository, daysRepository, poisRepository]
  );

  const expenseServices = useMemo(
    () => new ExpenseServices(expensesRepository),
    [mapsRepository]
  );

  const diaryEntryServices = useMemo(
    () => new DiaryEntryServices(diaryEntriesRepository),
    [diaryEntriesRepository]
  )

  return (
    <AppServicesContext.Provider value={{
      tripServices,
      dayServices,
      poiServices,
      mapServices,
      tripMapServices,
      expenseServices,
      diaryEntryServices,
      isOnline,
    }}>
      {children}
    </AppServicesContext.Provider>
  );
}