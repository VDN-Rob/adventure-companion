import { DayCard } from "@/components/DayCard";
import { AppHeader } from "@/components/homescreen/AppHeader";
import { Day } from "@/models/Day";
import { POI } from "@/models/POI";
import { StyleSheet, View } from 'react-native';

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0E1514",
  },

  content: {
    padding: 16,
  },
});