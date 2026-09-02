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
import { formatDate, getDayNumber, getTodayDate } from "@/utils/date";
import { useAppServices } from "@/utils/useRepository/useAppServiceProvider";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert, Modal, Pressable, Text, View } from 'react-native';

export default function HomeScreen() {
  // Memory
  const {tripServices, dayServices, isOnline, mapServices, poiServices} = useAppServices();

  // Temporary memory
  const [activeTrips, setActiveTrips] = useState<Trip[]>([]);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [selectorVisible, setSelectorVisible] = useState(false);

  const selectedTrip = activeTrips.find((trip) => trip.id === selectedTripId) ?? null;

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
      let active = true;
  
      async function loadActiveTrips() {
        const todayDate = getTodayDate();
  
        const trips = await tripServices.getTripsForDate(todayDate);
  
        if (!active) return;
  
        setActiveTrips(trips);
  
        // No active adventures
        if (trips.length === 0) {
          setSelectedTripId(null);
          return;
        }
  
        // Exactly one active adventure → select it automatically
        if (trips.length === 1) {
          setSelectedTripId(trips[0].id);
          return;
        }
  
        // Multiple active adventures.
        // Keep the existing selection if it is still active.
        if (
          selectedTripId &&
          trips.some((trip) => trip.id === selectedTripId)
        ) {
          return;
        }
  
        // Multiple active adventures and no valid selection.
        setSelectedTripId(null);
      }
  
      loadActiveTrips();
  
      return () => {
        active = false;
      };
    }, [tripServices, selectedTripId])
  );

  useEffect(() => {
    let active = true;
  
    async function loadSelectedTripData() {
      if (!selectedTrip) {
        setToday(null);
        setTodayPois([]);
        setCurrentDayNumber(null);
        setTotalDayNumber(null);
  
        setBottomItems([
          {
            key: "adventures",
            icon: "◇",
            label: "Adventures",
            onPress: () => router.push("/trip/trips"),
          },
        ]);
  
        return;
      }
  
      const todayDate = getTodayDate();
  
      const day = await dayServices.getDayByTripAndDate(
        selectedTrip.id,
        todayDate
      );
  
      if (!active) return;
  
      setToday(day);
  
      if (day) {
        const pois = await poiServices.getPOIsForDay(day.id);
  
        if (!active) return;
  
        setTodayPois(pois);
      } else {
        setTodayPois([]);
      }
  
      setCurrentDayNumber(getDayNumber(selectedTrip.startDate, todayDate));
  
      setTotalDayNumber(selectedTrip.endDate === null ? null : getDayNumber(selectedTrip.startDate, selectedTrip.endDate));
  
      const items: NavigationItem[] = [];
  
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
  
      setBottomItems(items);
    }
  
    loadSelectedTripData();
  
    return () => {
      active = false;
    };
  }, [
    selectedTripId,
    selectedTrip,
    dayServices,
    poiServices,
  ]);
  
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


  const handleCheckIn = async (poi: POI) => {
    const result = await poiServices.checkInPOI(poi.id);
  
    if (!result.success) {
      Alert.alert(
        "Check-in failed",
        result.errors.poi ?? "Unable to check in."
      );
      return;
    }
  
    const visitedAt = new Date().toISOString();
  
    setTodayPois((current) =>
      current.map((item) =>
        item.id === poi.id
          ? { ...item, visitedAt }
          : item
      )
    );
  };

  const handleUndoCheckIn = async (poi: POI) => {
    const result = await poiServices.undoCheckInPOI(poi.id);
  
    if (!result.success) {
      Alert.alert(
        "Unable to undo check-in",
        result.errors.poi ?? "Something went wrong."
      );
      return;
    }
  
    setTodayPois((current) =>
      current.map((item) =>
        item.id === poi.id
          ? { ...item, visitedAt: null }
          : item
      )
    );
  };

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
        tripName={selectedTrip?.name ?? "No active adventure"}
        currentDay={selectedTrip ? currentDayNumber ?? undefined : undefined}
        totalDays={selectedTrip ? totalDayNumber ?? "TO INFINITY!" : undefined}
      />

      {activeTrips.length > 1 && (
        <Pressable
          style={styles.adventureSelector}
          onPress={() => setSelectorVisible(true)}
        >
          <View>
            <Text style={styles.selectorLabel}>
              CURRENT ADVENTURE
            </Text>

            <Text style={styles.selectorValue}>
              {selectedTrip?.name ?? "SELECT ADVENTURE"}
            </Text>
          </View>

          <Text style={styles.selectorArrow}>▼</Text>
        </Pressable>
      )}

      <View style={styles.content}>
        {activeTrips.length === 0 ? (
          <NoActiveAdventure />
        ) : !selectedTrip ? (
          <Pressable
            style={styles.chooseAdventureButton}
            onPress={() => setSelectorVisible(true)}
          >
            <Text style={styles.chooseAdventureTitle}>
              SELECT YOUR ADVENTURE
            </Text>

            <Text style={styles.chooseAdventureText}>
              You have multiple active adventures today.
            </Text>
          </Pressable>
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

      {selectedTrip && today &&(
        <QuickActions
          onExpensePress={() => {
            router.push({
              pathname: "/finance/createExpense",
              params: {
                tripId: selectedTrip.id,
                dayId: today.id,
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

      {selectedTrip && today && (
        <CheckInModal
          visible={checkInVisible}
          pois={todayPois}
          onClose={() => setCheckInVisible(false)}
          onCheckIn={handleCheckIn}
          onUndoCheckIn={handleUndoCheckIn}
          />
        )}

      <Modal
        visible={selectorVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectorVisible(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setSelectorVisible(false)}
        >
          <Pressable
            style={styles.selectorModal}
            onPress={(event) => event.stopPropagation()}
          >
            <Text style={styles.modalTitle}>
              SELECT ADVENTURE
            </Text>

            {activeTrips.map((trip) => {
              const isSelected = trip.id === selectedTripId;

              return (
                <Pressable
                  key={trip.id}
                  style={[
                    styles.tripOption,
                    isSelected && styles.tripOptionSelected,
                  ]}
                  onPress={() => {
                    setSelectedTripId(trip.id);
                    setSelectorVisible(false);
                  }}
                >
                  <Text style={styles.tripOptionIndicator}>
                    {isSelected ? "●" : "○"}
                  </Text>

                  <View style={styles.tripOptionContent}>
                    <Text style={styles.tripOptionName}>
                      {trip.name}
                    </Text>

                    <Text style={styles.tripOptionDates}>
                      {formatDate(trip.startDate)}
                      {" → "}
                      {trip.endDate ? formatDate(trip.endDate) : "∞"}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}