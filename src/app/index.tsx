import { DayCard } from "@/components/DayCard";
import { AppHeader } from "@/components/homescreen/AppHeader";
import { BottomNavigation } from "@/components/homescreen/BottomNavigation";
import { QuickActions } from "@/components/homescreen/QuickActions";
import { Day } from "@/models/Day";
import { POI } from "@/models/POI";
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
          isToday={true}
          onPress={() => {
            console.log("Day pressed");
          }}
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
        onTodayPress={() => {
          console.log("Today");
        }}
        onMapPress={() => {
          console.log("Map");
        }}
        onMorePress={() => {
          console.log("More");
        }}
      />
    </View>
  );
}

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