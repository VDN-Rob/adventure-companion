import { CheckInModal } from "@/components/CheckInModal";
import { DayCard } from "@/components/card/DayCard";
import { AppHeader } from "@/components/homescreen/AppHeader";
import { BottomNavigation } from "@/components/homescreen/BottomNavigation";
import { QuickActions } from "@/components/homescreen/QuickActions";
import { Day } from "@/models/Day";
import { OfflineMap } from "@/models/OfflineMap";
import { POI } from "@/models/POI";
import { Trip } from "@/models/Trip";
import { styles } from "@/styling/styles";
import { getDayNumber, getTodayDate } from "@/utils/date";
import { useAppServices } from "@/utils/useAppServiceProvider";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { View } from 'react-native';

export default function HomeScreen() {
  // Memory
  const {tripServices, dayServices, isOnline, mapServices, poiServices} = useAppServices();

  // Temporary memory
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);
  const [today, setToday] = useState<Day | null>(null);
  const [todayPois, setTodayPois] = useState<POI[]>([]);
  const [currentDayNumber, setCurrentDayNumber] = useState<number | null>(null);
  const [totalDayNumber, setTotalDayNumber] = useState<number | null>(null);

  const [maps, setMaps] = useState<OfflineMap[]>([]);
  const [checkInVisible, setCheckInVisible] = useState(false);

  // When Index finishes loading, get the data to setup the homescreen
  useEffect(() => {
    async function loadToday() {
      const today = await dayServices.getDayByDate(getTodayDate());
    
      setToday(today);
    
      if (today) {
        const pois = await poiServices.getPOIsForDay(today.id);
        setTodayPois(pois);
      } else {
        setTodayPois([]);
      }
    }

    async function loadCurrentTrip() {
      const today = getTodayDate();
    
      const trip = await tripServices.getTripForDate(today);
    
      setCurrentTrip(trip);
    }

    async function loadCurrentDay() {
      if (today && currentTrip) {
        setCurrentDayNumber(getDayNumber( currentTrip.startDate, today.date ));
        setTotalDayNumber(currentTrip.endDate === null ? null : getDayNumber( currentTrip.startDate, today.date ));
      }
    }

    async function loadMaps() {
      const maps = await mapServices.getDownloadedMaps();
      setMaps(maps);
    }

    loadToday()
    // loadMaps();
    loadCurrentTrip();
    loadCurrentDay();

  }, []);


  async function handleCheckIn(poi: POI) {
    const visitedAt = new Date().toISOString();

    await poiServices.updatePOI({
      ...poi,
      visitedAt,
    });

    setTodayPois((current) =>
      current.map((item) =>
        item.id === poi.id
        ? { ...item, visitedAt }
        : item
      )
    );

    setTodayPois(todayPois);
  }

  async function handleUndoCheckIn(poi: POI) {
    await poiServices.updatePOI({
      ...poi,
      visitedAt: null,
    });

    setTodayPois((current) =>
      current.map((item) =>
        item.id === poi.id
        ? { ...item, visitedAt: null }
        : item
      )
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader
        appName="ELG WANDER"
        tripName={currentTrip?.name ?? "No active adventure"}
        currentDay={currentDayNumber ?? 0}
        totalDays={totalDayNumber === null ? "To infity!" : totalDayNumber}
        />

      <View style={styles.content}>

      {today !== null && (<DayCard
        day={today}
        pois={todayPois}
        isToday
        onPress={() => openDayDetails(today.id)}
        />)}
      
        </View>

      <QuickActions
        onExpensePress={() => { router.push("/finance/createExpense"); }}
        onCheckInPress={() => { setCheckInVisible(true) }}
        onDiaryPress={() => {
        console.log("Diary pressed");
        }}
        />

      <BottomNavigation
        activeTab="today"
        onTodayPress={() => openDayDetails(today.id)}
        onMapPress={() => {
        router.push("/map/map")
        }}
        onMorePress={() => { router.push("/more"); }}
        />

      <CheckInModal
        visible={checkInVisible}
        pois={todayPois}
        onClose={() => setCheckInVisible(false)}
        onCheckIn={handleCheckIn}
        />
    </View>
  );
}

function openDayDetails(dayId: string) {
router.push({
pathname: "/day/detailsDay",
params: {dayId},
});
};