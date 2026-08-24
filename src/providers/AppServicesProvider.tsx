import { DayServices } from "@/services/DayService";
import { POIServices } from "@/services/POIService";
import { TripServices } from "@/services/TripService";
import { useDaysRepository } from "@/utils/useDaysRepository";
import { usePoisRepository } from "@/utils/usePoisRepository";
import { useTripsRepository } from "@/utils/useTripsRepository";
import { createContext, useMemo } from "react";

interface AppServices {
  tripServices: TripServices;
  dayServices: DayServices;
  poiServices: POIServices;
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

  return (
    <AppServicesContext.Provider value={{
      tripServices,
      dayServices,
      poiServices,
    }}>
      {children}
    </AppServicesContext.Provider>
  );
}