import { DayCard } from "@/components/DayCard";
import { AppHeader } from "@/components/homescreen/AppHeader";
import { BottomNavigation } from "@/components/homescreen/BottomNavigation";
import { QuickActions } from "@/components/homescreen/QuickActions";
import { Day } from "@/models/Day";
import { POI } from "@/models/POI";
import { router } from "expo-router";
import { StyleSheet, View } from 'react-native';
import { theme } from "./theme";

export default function HomeScreen() {
  const day: Day = {
    id: "1",
    tripId: "1",
    date: "2026-08-27",
    title: "Forest Road",
    notes: null,
    plannedElevation: 740,
    plannedDistance: 32.4,
  };

  const pois: POI[] = [];

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
          pois={pois}
          isToday
          onPress={() => openDayDetails(day.id)}
        />
      </View>

      <QuickActions
        onExpensePress={() => {
          console.log("Expense pressed");
        }}
        onDayPress={() => {
          console.log("Day details pressed");
        }}
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