import { DayService } from "@/services/DayService";
import { DiaryEntryService } from "@/services/DiaryEntryService";
import { ExchangeRateService } from "@/services/ExchangeRateService";
import { ExpenseService } from "@/services/ExpenseService";
import { MapService } from "@/services/MapService";
import { useNetworkStatus } from "@/services/NetworkServices";
import { POIService } from "@/services/POIService";
import { TripMapServices } from "@/services/tripMapService";
import { TripService } from "@/services/TripService";
import { useDaysRepository } from "@/utils/useRepository/useDaysRepository";
import { useDiaryEntriesRepository } from "@/utils/useRepository/useDiaryEntriesRepository";
import { useExchangeRateRepository } from "@/utils/useRepository/useExchangeRateRepository";
import { useExpensesRepository } from "@/utils/useRepository/useExpensesRepository";
import { useMapsRepository } from "@/utils/useRepository/useMapsRepository";
import { usePoisRepository } from "@/utils/useRepository/usePoisRepository";
import { useTripsRepository } from "@/utils/useRepository/useTripsRepository";
import { createContext, useMemo } from "react";

interface AppServices {
  tripServices: TripService;
  dayServices: DayService;
  poiServices: POIService;
  mapServices: MapService;
  tripMapServices: TripMapServices;
  expenseServices: ExpenseService;
  diaryEntryServices: DiaryEntryService;
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
  const exchangeRateRepository = useExchangeRateRepository();
  const expensesRepository = useExpensesRepository();
  const diaryEntriesRepository = useDiaryEntriesRepository();

  const isOnline = useNetworkStatus();

  const tripServices = useMemo(
    () => new TripService(
      tripsRepository,
      daysRepository
    ),
    [tripsRepository, daysRepository]
  );

  const dayServices = useMemo(
    () => new DayService(daysRepository, tripsRepository),
    [daysRepository, tripsRepository]
  );

  const poiServices = useMemo(
    () => new POIService(
      poisRepository
    ),
    [poisRepository]
  );

  const mapServices = useMemo(
    () => new MapService(mapsRepository),
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

  const exchangeRateServices = useMemo(
    () => new ExchangeRateService(exchangeRateRepository),
    [exchangeRateRepository]
  );

  const expenseServices = useMemo(
    () => new ExpenseService(expensesRepository, exchangeRateServices),
    [expensesRepository, exchangeRateServices]
  );

  const diaryEntryServices = useMemo(
    () => new DiaryEntryService(diaryEntriesRepository, dayServices),
    [diaryEntriesRepository, dayServices]
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