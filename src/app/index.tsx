import { CheckInModal } from "@/components/CheckInModal";
import { DayCard } from "@/components/card/DayCard";
import { AppHeader } from "@/components/homescreen/AppHeader";
import { BottomNavigation, NavigationItem } from "@/components/homescreen/BottomNavigation";
import { NoActiveAdventure } from "@/components/homescreen/NoActiveAdventure";
import { QuickActions } from "@/components/homescreen/QuickActions";
import { RestDayState } from "@/components/homescreen/RestDayState";
import { Day } from "@/models/Day";
import { OfflineMap } from "@/models/OfflineMap";
import { POI } from "@/models/POI";
import { Trip } from "@/models/Trip";
import { styles } from "@/styling/styles";
import { getDayNumber, getTodayDate } from "@/utils/date";
import { useAppServices } from "@/utils/useAppServiceProvider";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, View } from 'react-native';

export default function HomeScreen() {
  // Memory
  const {tripServices, dayServices, isOnline, mapServices, poiServices} = useAppServices();

  // Temporary memory
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);
  const [today, setToday] = useState<Day | null>(null);
  const [todayPois, setTodayPois] = useState<POI[]>([]);
  const [currentDayNumber, setCurrentDayNumber] = useState<number | null>(null);
  const [totalDayNumber, setTotalDayNumber] = useState<number | null>(null);
  const [bottomItems, setBottomItems] = useState<NavigationItem[]>([]);

  const [maps, setMaps] = useState<OfflineMap[]>([]);
  const [checkInVisible, setCheckInVisible] = useState(false);

  // When Index finishes loading, get the data to setup the homescreen
  useFocusEffect(
    useCallback(() => {
      async function loadData() {
        const todayDate = getTodayDate();
  
        // Current trip
        const trip = await tripServices.getTripForDate(todayDate);
        setCurrentTrip(trip);
  
        // Today's scheduled day
        const day = await dayServices.getDayByDate(todayDate);
        setToday(day);
  
        // Today's POIs
        if (day) {
          const pois = await poiServices.getPOIsForDay(day.id);
          setTodayPois(pois);
        } else {
          setTodayPois([]);
        }
  
        // Day counter
        if (trip) {
          setCurrentDayNumber(
            getDayNumber(trip.startDate, todayDate)
          );
  
          setTotalDayNumber(
            trip.endDate === null
              ? null
              : getDayNumber(trip.startDate, trip.endDate)
          );
        } else {
          setCurrentDayNumber(null);
          setTotalDayNumber(null);
        }
  
        // Bottom navigation
        const items: NavigationItem[] = [];
  
        if (!trip) {
          items.push({
            key: "adventures",
            icon: "◇",
            label: "Adventures",
            onPress: () => router.push("/trip/trips"),
          });
        } else {
          if (day) {
            items.push({
              key: "day",
              icon: "●",
              label: "Day",
              onPress: () => openDayDetails(day.id),
            });
          }
  
          items.push({
            key: "map",
            icon: "◇",
            label: "Map",
            onPress: () => router.push("/map/map"),
          });
        }
  
        setBottomItems(items);
      }
  
      loadData();
    }, [tripServices, dayServices, poiServices])
  );

  async function loadMaps() {
    const maps = await mapServices.getDownloadedMaps();
    setMaps(maps);
  }
  
  async function handleDeleteMap(map: OfflineMap) {
    Alert.alert(
        "Delete map",
        `Are you sure you want to delete "${map.name}"?`,
        [
            {
                text: "Cancel",
                style: "cancel",
            },
            {
                text: "Delete",
                style: "destructive",
                onPress: async () => {
                    try {
                        await mapServices.deleteRegion(map);

                        // Remove it from the UI
                        setMaps(currentMaps =>
                            currentMaps.filter(
                                currentMap => currentMap.id !== map.id
                            )
                        );
                    } catch (error) {
                        console.error("Failed to delete map:", error);

                        Alert.alert(
                            "Error",
                            "The map could not be deleted."
                        );
                    }
                },
            },
        ]
    );
  }


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

  function openDayDetails(dayId: string) {
    router.push({
      pathname: "/day/detailsDay",
      params: {dayId},
    });
  };

  return (
    <View style={styles.container}>
      <AppHeader
        appName="ELG WANDER"
        tripName={currentTrip?.name ?? "No active adventure"}
        currentDay={currentTrip ? currentDayNumber ?? undefined : undefined}
        totalDays={currentTrip ? totalDayNumber ?? "TO INFINITY!" : undefined}
      />

      <View style={styles.content}>
        {!currentTrip ? (
          <NoActiveAdventure />
        ) : today ? (
          <DayCard
            day={today}
            pois={todayPois}
            isToday
            onPress={() => openDayDetails(today.id)}
          />
        ) : (
          <RestDayState />
        )}
      </View>

      {currentTrip && (
        <QuickActions
          onExpensePress={() => {
            router.push({
              pathname: "/finance/createExpense",
              params: {
                tripId: currentTrip.id,
                dayId: today?.id,
              },
            });
          }}
          onCheckInPress={() => {
            setCheckInVisible(true);
          }}
          onDiaryPress={() => {
            console.log("Diary pressed");
          }}
        />
      )}

      <BottomNavigation
        activeTab={today ? "day" : ""}
        items={bottomItems}
        onMorePress={() => {
          router.push("/more");
        }}
      />

      {currentTrip && (
        <CheckInModal
          visible={checkInVisible}
          pois={todayPois}
          onClose={() => setCheckInVisible(false)}
          onCheckIn={handleCheckIn}
          onUndoCheckIn={handleUndoCheckIn}
          />
        )}
    </View>
  );
}