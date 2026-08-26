import { DayServices } from "@/services/DayService";
import { MapServices } from "@/services/MapService";
import { useNetworkStatus } from "@/services/NetworkServices";
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
  mapServices: MapServices;
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
    () => new MapServices(tripsRepository, daysRepository),
    [tripsRepository, daysRepository]
  );

  return (
    <AppServicesContext.Provider value={{
      tripServices,
      dayServices,
      poiServices,
      mapServices,
      isOnline,
    }}>
      {children}
    </AppServicesContext.Provider>
  );
}