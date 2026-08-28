import { theme } from "@/app/theme";
import { DayCard } from "@/components/DayCard";
import { Day } from "@/models/Day";
import { POI } from "@/models/POI";
import { Trip } from "@/models/Trip";
import { useAppServices } from "@/utils/useAppServiceProvider";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, View } from "react-native";

const exampleTrip: Trip = {
  id: "test-trip-01",
  name: "Ardennes Expedition",
  startDate: "2026-08-24",
  endDate: "2026-09-04",
  description: "A two-week cycling adventure through the Ardennes.",
};

const exampleDay: Day = {
  id: "test-day-01",
  tripId: "test-trip-01",
  date: "2026-08-28",
  title: "Through the Ardennes",
  notes:
    "A long climbing day through forest roads and small villages. Water is limited after the second climb.",
  plannedElevation: 820,
  plannedDistance: 68.5,
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
  },
  {
    id: "poi-01",
    dayId: "test-day-01",
    name: "Forest Spring",
    type: "water",
    latitude: 49.82,
    longitude: 4.62,
    notes: "Small spring beside the trail.",
  },
  {
    id: "poi-02",
    dayId: "test-day-01",
    name: "La Petite Boulangerie",
    type: "food",
    latitude: 49.78,
    longitude: 4.71,
    notes: "Good place for breakfast and coffee.",
  },
  {
    id: "poi-03",
    dayId: "test-day-01",
    name: "Intermarché",
    type: "supermarket",
    latitude: 49.75,
    longitude: 4.83,
    notes: "Last reliable resupply before the hills.",
  },
  {
    id: "poi-04",
    dayId: "test-day-01",
    name: "Camping des Pins",
    type: "accommodation",
    latitude: 49.68,
    longitude: 4.91,
    notes: "Small campsite with showers.",
  },
];

export default function TripDetailsScreen() {
    // Retrieve id from parameters
    const { id: tripId } = useLocalSearchParams<{ id: string }>();

    // Use application layer to access databank
    const { tripServices, tripMapServices, mapServices, poiServices } = useAppServices();

    // State
    const [trip, setTrip] = useState<Trip>();
    const [days, setDays] = useState<Day[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [statistics, setStatistics] = useState({
      totalDistance: 0,
      totalElevation: 0,
    });
    const [poisByDay, setPoisByDay] = useState<Record<string, POI[]>>({});
    
    // Load the right trip everytime the screen is loaded
    useFocusEffect(
      useCallback(() => {
        async function loadData() {
          if (!tripId) {
            setError("No trip ID was provided.");
            setIsLoading(false);
            return;
          }
  
          try {
            setIsLoading(true);
            setError(null);
  
            const result = await tripServices.getTripDetails(tripId);
  
            if (result === null) {
              setError("Trip not found.");
              return;
            }
  
            setTrip(result.trip);
            setDays(result.days);

            const loadedPois: Record<string, POI[]> = {};

            for (const day of result.days) {
              loadedPois[day.id] = await poiServices.getPOIsForDay(day.id);

              // Route service isn't implemented yet.
              console.log(
                `[TripDetails] Route loading not implemented for day ${day.id}`
              );
            }

            setPoisByDay(loadedPois);

            const statistics = await tripServices.calculateTripStatistics(tripId);
            setStatistics(statistics);
          } catch {
            setError("Unable to load trip.");
          } finally {
            setIsLoading(false);
          }
        }
  
        // loadData();

        setTrip(exampleTrip);
        setDays([exampleDay]);
        const loadedPois: Record<string, POI[]> = {};
        loadedPois[exampleDay.id] = examplePois;
        setPoisByDay(loadedPois)
        setIsLoading(false);
        
      }, [tripId])
    );
  
    if (isLoading) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator
            size="small"
            color={theme.colours.accent}
          />
    
          <Text style={styles.loadingText}>
            LOADING ADVENTURE...
          </Text>
        </View>
      );
    }
    
    if (error || !trip) {
      return (
        <View style={styles.centered}>
          <Text style={styles.errorTitle}>
            ADVENTURE NOT FOUND
          </Text>
    
          <Text style={styles.errorText}>
            {error ?? "Unable to load this adventure."}
          </Text>
        </View>
      );
    }


    async function handleTripMapDownload() {
      const regions = tripMapServices.getTripMapRegions(tripId, "day");

      // for (const region of await regions) {
      //   await mapServices.downloadRegion(region.bounds);
      // }

      // loadedRoutes[day.id] =
      //   await routeServices.getRouteForDay(day.id);

    }

    function tripDownloadWarning(id: string) {
      Alert.alert(
        "Downloading",
        `How would you like to download the maps?

        * Entire trip
          One large map covering the whole trip.
          Simpler, but may download unnecessary areas.

        * Separate maps per day
          Downloads only the area around each day.
          Usually uses less storage for long trips.`,
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Entire trip",
            style: "destructive",
            onPress: handleTripMapDownload,
          },
          {
            text: "Per day",
            style: "destructive",
            onPress: handleTripMapDownload,
          },
        ]
      );
    }

    return (
      <View style={styles.container}>
        <FlatList
          data={days}
          keyExtractor={(day) => day.id}
          renderItem={({ item, index }) => (
            <View>
              <DayCard
                day={item}
                pois={poisByDay[item.id] ?? []}
                dayNumber={index + 1}
                onPress={() => handleDetailsDay(item.id)}
              />
            </View>
          )}
          ItemSeparatorComponent={() => (
            <View style={styles.daySeparator} />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
          ListHeaderComponent={
            <>
              {/* HEADER */}
              <View style={styles.header}>
                <Pressable
                  style={styles.backButton}
                  onPress={() => router.back()}
                >
                  <Text style={styles.backArrow}>
                    ←
                  </Text>
                </Pressable>
    
                <View>
                  <Text style={styles.eyebrow}>
                    ADVENTURE
                  </Text>
    
                  <Text style={styles.headerSubtext}>
                    MISSION BRIEFING
                  </Text>
                </View>
              </View>
    
              {/* TRIP TITLE */}
              <View style={styles.titleSection}>
                <Text style={styles.title}>
                  {trip.name}
                </Text>
    
                <Text style={styles.dates}>
                  {trip.startDate}
                  {trip.endDate
                    ? ` — ${trip.endDate}`
                    : ""}
                </Text>
              </View>
    
              {/* STATISTICS */}
              <View style={styles.stats}>
                <View style={styles.stat}>
                  <Text style={styles.statValue}>
                    {days.length}
                  </Text>
    
                  <Text style={styles.statUnit}>
                    DAYS
                  </Text>
    
                  <Text style={styles.statLabel}>
                    ADVENTURE
                  </Text>
                </View>
    
                <View style={styles.statDivider} />
    
                <View style={styles.stat}>
                  <Text style={styles.statValue}>
                    {statistics.totalDistance}
                  </Text>
    
                  <Text style={styles.statUnit}>
                    KM
                  </Text>
    
                  <Text style={styles.statLabel}>
                    DISTANCE
                  </Text>
                </View>
    
                <View style={styles.statDivider} />
    
                <View style={styles.stat}>
                  <Text style={styles.statValue}>
                    {statistics.totalElevation}
                  </Text>
    
                  <Text style={styles.statUnit}>
                    M ↑
                  </Text>
    
                  <Text style={styles.statLabel}>
                    ELEVATION
                  </Text>
                </View>
              </View>
    
              {/* DESCRIPTION */}
              {trip.description && (
                <Text style={styles.description}>
                  {trip.description}
                </Text>
              )}
    
              {/* SCHEDULE HEADER */}
              <SectionLabel title="SCHEDULE" />
    
              {days.length === 0 && (
                <View style={styles.emptyDays}>
                  <Text style={styles.emptyTitle}>
                    NO DAYS PLANNED
                  </Text>
    
                  <Text style={styles.emptyText}>
                    Your adventure needs a route.
                    Add the first day to begin planning.
                  </Text>
                </View>
              )}
            </>
          }
          ListFooterComponent={
            <>
              {/* ADD DAY */}
              <Pressable
                style={styles.addDayButton}
                onPress={() => {
                  handleAddDay(trip.id);
                }}
              >
                <Text style={styles.addDayPlus}>
                  +
                </Text>
    
                <Text style={styles.addDayText}>
                  ADD DAY
                </Text>
              </Pressable>
    
              {/* MAP SECTION */}
              <View style={styles.mapSection}>
                <SectionLabel title="OFFLINE MAP" />
    
                <Text style={styles.mapDescription}>
                  Download map data before heading out
                  of range.
                </Text>
    
                <Pressable
                  style={styles.downloadButton}
                  onPress={() => {
                    tripDownloadWarning(trip.id);
                  }}
                >
                  <Text style={styles.downloadText}>
                    DOWNLOAD MAPS
                  </Text>
    
                  <Text style={styles.downloadArrow}>
                    ↓
                  </Text>
                </Pressable>
              </View>
    
              {/* EDIT */}
              <Pressable
                style={styles.editButton}
                onPress={() => {
                  handleEditTrip(trip.id);
                }}
              >
                <Text style={styles.editText}>
                  EDIT ADVENTURE
                </Text>
              </Pressable>
            </>
          }
        />
      </View>
    );
}

function SectionLabel({ title }: { title: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>
        {title}
      </Text>

      <View style={styles.sectionLine} />
    </View>
  );
}

function handleAddDay(tripId: string){
  router.push({
    pathname: "/createDay",
    params: {tripId}
  })
}

function handleDetailsDay(dayId: string){
  router.push({
    pathname: "/detailsDay",
    params: {dayId}
  })
}

function handleEditTrip(id: string){
  router.push({
    pathname: "/editTrip",
    params: {id}
  })
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colours.background,
  },

  content: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    paddingBottom: 140,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",

    marginBottom: theme.spacing.xl,
  },

  backButton: {
    width: 42,
    height: 42,

    alignItems: "center",
    justifyContent: "center",

    marginRight: theme.spacing.sm,

    borderWidth: 1,
    borderColor: theme.colours.border,
    borderRadius: theme.radius.sm,
  },

  backArrow: {
    fontFamily: theme.fonts.displayBold,
    fontSize: theme.fontSize.xl,

    color: theme.colours.text,
  },

  eyebrow: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: theme.fontSize.xs,

    color: theme.colours.accent,

    letterSpacing: 2,
  },

  headerSubtext: {
    marginTop: 2,

    fontFamily: theme.fonts.body,
    fontSize: 9,

    color: theme.colours.textMuted,

    letterSpacing: 1,
  },

  titleSection: {
    marginBottom: theme.spacing.lg,
  },

  title: {
    fontFamily: theme.fonts.displayBold,
    fontSize: theme.fontSize.xxxl,

    color: theme.colours.text,

    letterSpacing: 1,
  },

  dates: {
    marginTop: theme.spacing.xs,

    fontFamily: theme.fonts.body,
    fontSize: theme.fontSize.sm,

    color: theme.colours.textSecondary,
  },

  stats: {
    flexDirection: "row",

    minHeight: 92,

    marginBottom: theme.spacing.lg,

    backgroundColor: theme.colours.surface,

    borderWidth: 1,
    borderColor: theme.colours.border,

    borderRadius: theme.radius.md,
  },

  stat: {
    flex: 1,

    justifyContent: "center",

    paddingHorizontal: theme.spacing.sm,
  },

  statDivider: {
    width: 1,

    marginVertical: theme.spacing.md,

    backgroundColor: theme.colours.border,
  },

  statValue: {
    fontFamily: theme.fonts.displayBold,
    fontSize: theme.fontSize.xl,

    color: theme.colours.text,
  },

  statUnit: {
    marginTop: -2,

    fontFamily: theme.fonts.bodyBold,
    fontSize: 9,

    color: theme.colours.accent,
  },

  statLabel: {
    marginTop: 3,

    fontFamily: theme.fonts.bodyBold,
    fontSize: 8,

    color: theme.colours.textMuted,

    letterSpacing: 1,
  },

  description: {
    marginBottom: theme.spacing.xl,

    fontFamily: theme.fonts.body,
    fontSize: theme.fontSize.sm,

    lineHeight: 20,

    color: theme.colours.textSecondary,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",

    marginBottom: theme.spacing.sm,

    gap: theme.spacing.sm,
  },

  sectionTitle: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: theme.fontSize.xs,

    color: theme.colours.accent,

    letterSpacing: 2,
  },

  sectionLine: {
    flex: 1,

    height: 1,

    backgroundColor: theme.colours.border,
  },

  daySeparator: {
    height: theme.spacing.sm,
  },

  emptyDays: {
    padding: theme.spacing.lg,

    marginBottom: theme.spacing.md,

    alignItems: "center",

    backgroundColor: theme.colours.surface,

    borderWidth: 1,
    borderColor: theme.colours.border,

    borderRadius: theme.radius.md,
  },

  emptyTitle: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: theme.fontSize.sm,

    color: theme.colours.textMuted,

    letterSpacing: 1.5,
  },

  emptyText: {
    maxWidth: 280,

    marginTop: theme.spacing.xs,

    fontFamily: theme.fonts.body,
    fontSize: theme.fontSize.xs,

    lineHeight: 18,

    color: theme.colours.textMuted,

    textAlign: "center",
  },

  addDayButton: {
    minHeight: 52,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    marginTop: theme.spacing.md,

    borderWidth: 1,
    borderColor: theme.colours.border,
    borderStyle: "dashed",

    borderRadius: theme.radius.md,
  },

  addDayPlus: {
    marginRight: theme.spacing.sm,

    fontFamily: theme.fonts.displayBold,
    fontSize: theme.fontSize.xl,

    color: theme.colours.accent,
  },

  addDayText: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: theme.fontSize.xs,

    color: theme.colours.text,

    letterSpacing: 1.5,
  },

  mapSection: {
    marginTop: theme.spacing.xxl,
  },

  mapDescription: {
    marginBottom: theme.spacing.sm,

    fontFamily: theme.fonts.body,
    fontSize: theme.fontSize.xs,

    color: theme.colours.textMuted,
  },

  downloadButton: {
    minHeight: 54,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    backgroundColor: theme.colours.surface,

    borderWidth: 1,
    borderColor: theme.colours.accent,

    borderRadius: theme.radius.md,
  },

  downloadText: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: theme.fontSize.sm,

    color: theme.colours.text,

    letterSpacing: 1.5,
  },

  downloadArrow: {
    marginLeft: theme.spacing.sm,

    fontFamily: theme.fonts.displayBold,
    fontSize: theme.fontSize.lg,

    color: theme.colours.accent,
  },

  editButton: {
    minHeight: 48,

    alignItems: "center",
    justifyContent: "center",

    marginTop: theme.spacing.md,
  },

  editText: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: theme.fontSize.xs,

    color: theme.colours.textMuted,

    letterSpacing: 1.5,
  },

  centered: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",

    padding: theme.spacing.lg,

    backgroundColor: theme.colours.background,
  },

  loadingText: {
    marginTop: theme.spacing.sm,

    fontFamily: theme.fonts.bodyBold,
    fontSize: theme.fontSize.xs,

    color: theme.colours.textMuted,

    letterSpacing: 1.5,
  },

  errorTitle: {
    fontFamily: theme.fonts.displayBold,
    fontSize: theme.fontSize.xl,

    color: theme.colours.accent,

    letterSpacing: 1.5,
  },

  errorText: {
    marginTop: theme.spacing.sm,

    fontFamily: theme.fonts.body,
    fontSize: theme.fontSize.sm,

    color: theme.colours.textMuted,

    textAlign: "center",
  },
});