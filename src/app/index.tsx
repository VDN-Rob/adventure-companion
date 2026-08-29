import { CheckInModal } from "@/components/CheckInModal";
import { DayCard } from "@/components/card/DayCard";
import { AppHeader } from "@/components/homescreen/AppHeader";
import { BottomNavigation } from "@/components/homescreen/BottomNavigation";
import { QuickActions } from "@/components/homescreen/QuickActions";
import { Day } from "@/models/Day";
import { POI } from "@/models/POI";
import { useAppServices } from "@/utils/useAppServiceProvider";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from 'react-native';
import { theme } from "./theme";

export default function HomeScreen() {

  
  const {tripServices, isOnline, mapServices, poiServices} = useAppServices();

  const [checkInVisible, setCheckInVisible] = useState(false);
  const [todayPois, setTodayPois] = useState<POI[]>([]);


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

    setTodayPois(examplePois);
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

  const day: Day = {
    id: "1",
    tripId: "1",
    date: "2026-08-27",
    title: "Forest Road",
    notes: null,
    plannedElevation: 740,
    plannedDistance: 32.4,
  };
  const examplePois: POI[] = [
    {
      id: "poi-00",
      dayId: "test-day-01",
      name: "Start in Oignies",
      type: "other",
      latitude: 50.023722,
      longitude: 4.639699,
      notes: "Starting point og the adventure",
      visitedAt: null
    },
    {
      id: "poi-01",
      dayId: "test-day-01",
      name: "Forest Spring",
      type: "water",
      latitude: 49.82,
      longitude: 4.62,
      notes: "Small spring beside the trail.",
      visitedAt: null
    },
    {
      id: "poi-02",
      dayId: "test-day-01",
      name: "La Petite Boulangerie",
      type: "food",
      latitude: 49.78,
      longitude: 4.71,
      notes: "Good place for breakfast and coffee.",
      visitedAt: null
    },
    {
      id: "poi-03",
      dayId: "test-day-01",
      name: "Intermarché",
      type: "supermarket",
      latitude: 49.75,
      longitude: 4.83,
      notes: "Last reliable resupply before the hills.",
      visitedAt: null
    },
    {
      id: "poi-04",
      dayId: "test-day-01",
      name: "Camping des Pins",
      type: "accommodation",
      latitude: 49.68,
      longitude: 4.91,
      notes: "Small campsite with showers.",
      visitedAt: null
    },
  ];

  return (
    <View style={styles.container}>
      <AppHeader
        appName="WANDER"
        tripName="Ardennes Expedition"
        currentDay={4}
        totalDays={12}
      />

      <View style={styles.content}>
        <DayCard
          day={day}
          pois={todayPois}
          isToday
          onPress={() => openDayDetails(day.id)}
        />
      </View>

      <QuickActions
        onExpensePress={() => { router.push("/createExpense"); }}
        onCheckInPress={() => { setCheckInVisible(true) }}
        onDiaryPress={() => {
          console.log("Diary pressed");
        }}
      />

      <BottomNavigation
        activeTab="today"
        onTodayPress={() => openDayDetails(day.id)}
        onMapPress={() => {
          router.push("/map")
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
    pathname: "/detailsDay",
    params: {dayId},
  });
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colours.background,
  },

  content: {
    flex: 1,
  
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
});