import { theme } from "@/app/theme";
import { POICard } from "@/components/POICard";
import { Day } from "@/models/Day";
import { POI } from "@/models/POI";
import { useAppServices } from "@/utils/useAppServiceProvider";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from "react-native";

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

export default function DayDetailsScreen() {
    // Retrieve id from parameters
    const { dayId } = useLocalSearchParams<{ dayId: string }>();

    // Load databank
    const { dayServices, poiServices } = useAppServices();

    // State
    const [day, setDay] = useState<Day | null>(null);
    const [pois, setPois] = useState<POI[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    
    // Load the right day everytime the screen is loaded
    useFocusEffect(
      useCallback(() => {
        async function loadData() {
          if (!dayId) {
            setError("No day ID was provided");
            setIsLoading(false);
            return;
          }
    
          try {
            setIsLoading(true);
            setError(null);

            const day = await dayServices.getDay(dayId);
      
            if (!day) {
              setError("Day not Found");
              return;
            }

            setDay(day);

            const pois = await poiServices.getPOIsForDay(dayId);
            setPois(pois);
          } catch {
            setError("Unable to load day");
          } finally {
            setIsLoading(false);
          }
        }
    
        // loadData(); // Replace the three sets hereunder. 
        setDay(exampleDay);
        setPois(examplePois);
        setIsLoading(false);
      }, [dayId])
    );
    
    if (isLoading) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator
            size="small"
            color={theme.colours.accent}
          />
    
          <Text style={styles.loadingText}>
            LOADING DAY...
          </Text>
        </View>
      );
    }

    if (error || !day) {
      return (
        <View style={styles.centered}>
          <Text style={styles.errorTitle}>
            DAY NOT FOUND
          </Text>
    
          <Text style={styles.errorText}>
            {error ?? "Unable to load this day."}
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <FlatList
          data={pois}
          keyExtractor={(poi) => poi.id}
          renderItem={({ item }) => (
            <POICard
              poi={item}
              onPress={() => editPOI(item.id)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => (
            <View style={styles.poiSeparator} />
          )}
          ListHeaderComponent={
            <>
              {/* HEADER */}
              <View style={styles.header}>
                <Pressable
                  onPress={() => router.back()}
                  style={styles.backButton}
                >
                  <Text style={styles.backArrow}>
                    ←
                  </Text>
                </Pressable>
    
                <View>
                  <Text style={styles.eyebrow}>
                    DAY
                  </Text>
    
                  <Text style={styles.dayNumber}>
                    {day.date}
                  </Text>
                </View>
              </View>
    
              {/* TITLE */}
              <View style={styles.titleSection}>
                <Text style={styles.title}>
                  {day.title ?? "UNTITLED DAY"}
                </Text>
              </View>
    
              {/* STATS */}
              <View style={styles.stats}>
                <View style={styles.stat}>
                  <Text style={styles.statValue}>
                    {day.plannedDistance !== null
                      ? `${day.plannedDistance}`
                      : "—"}
                  </Text>
    
                  <Text style={styles.statUnit}>
                    KM
                  </Text>
    
                  <Text style={styles.statLabel}>
                    PLANNED DISTANCE
                  </Text>
                </View>
    
                <View style={styles.statDivider} />
    
                <View style={styles.stat}>
                  <Text style={styles.statValue}>
                    {day.plannedElevation !== null
                      ? `${day.plannedElevation}`
                      : "—"}
                  </Text>
    
                  <Text style={styles.statUnit}>
                    M ↑
                  </Text>
    
                  <Text style={styles.statLabel}>
                    ELEVATION
                  </Text>
                </View>
              </View>
    
              {/* NOTES */}
              {day.notes && (
                <View style={styles.notesSection}>
                  <SectionLabel title="NOTES" />
    
                  <Text style={styles.notes}>
                    {day.notes}
                  </Text>
                </View>
              )}
    
              {/* POIS */}
              <SectionLabel title="POINTS OF INTEREST" />
    
              {pois.length === 0 && (
                <View style={styles.emptyPois}>
                  <Text style={styles.emptyTitle}>
                    NO WAYPOINTS
                  </Text>
    
                  <Text style={styles.emptyText}>
                    Nothing has been planned for this day yet.
                  </Text>
                </View>
              )}
            </>
          }
          ListFooterComponent={
            <View style={styles.footer}>
              <Pressable
                style={styles.addPoiButton}
                onPress={() => {
                  router.push({
                    pathname: "/createPoi",
                    params: { dayId },
                  });
                }}
              >
                <Text style={styles.addPoiPlus}>
                  +
                </Text>
    
                <Text style={styles.addPoiText}>
                  ADD POINT OF INTEREST
                </Text>
              </Pressable>
    
              <Pressable
                style={styles.mapButton}
                onPress={() => {
                  router.push({
                    pathname: "/map",
                    params: { dayId },
                  });
                }}
              >
                <Text style={styles.mapButtonText}>
                  OPEN MAP
                </Text>
    
                <Text style={styles.mapArrow}>
                  →
                </Text>
              </Pressable>
    
              <Pressable
                style={styles.editButton}
                onPress={() => {
                  router.push({
                    pathname: "/editDay",
                    params: { dayId },
                  });
                }}
              >
                <Text style={styles.editButtonText}>
                  EDIT DAY
                </Text>
              </Pressable>
            </View>
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

function editPOI(poiId: string){
  router.push({
    pathname: "/editPOI",
    params: {poiId}
  })
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: theme.colours.background,
  },

  listContent: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    paddingBottom: 140,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",

    marginBottom: theme.spacing.lg,
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

  dayNumber: {
    marginTop: 1,

    fontFamily: theme.fonts.body,
    fontSize: theme.fontSize.xs,

    color: theme.colours.textMuted,
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

  stats: {
    flexDirection: "row",

    minHeight: 88,

    marginBottom: theme.spacing.xl,

    backgroundColor: theme.colours.surface,

    borderWidth: 1,
    borderColor: theme.colours.border,

    borderRadius: theme.radius.md,
  },

  stat: {
    flex: 1,

    justifyContent: "center",

    paddingHorizontal: theme.spacing.md,
  },

  statDivider: {
    width: 1,

    marginVertical: theme.spacing.md,

    backgroundColor: theme.colours.border,
  },

  statValue: {
    fontFamily: theme.fonts.displayBold,
    fontSize: theme.fontSize.xxl,

    color: theme.colours.text,
  },

  statUnit: {
    position: "absolute",

    top: 16,
    right: 16,

    fontFamily: theme.fonts.bodyBold,
    fontSize: theme.fontSize.xs,

    color: theme.colours.accent,
  },

  statLabel: {
    marginTop: 1,

    fontFamily: theme.fonts.bodyBold,
    fontSize: 9,

    color: theme.colours.textMuted,

    letterSpacing: 1,
  },

  notesSection: {
    marginBottom: theme.spacing.xl,
  },

  notes: {
    marginTop: theme.spacing.sm,

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

  poiSeparator: {
    height: theme.spacing.sm,
  },

  emptyPois: {
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,

    marginBottom: theme.spacing.md,

    backgroundColor: theme.colours.surface,

    borderWidth: 1,
    borderColor: theme.colours.border,

    borderRadius: theme.radius.md,

    alignItems: "center",
  },

  emptyTitle: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: theme.fontSize.sm,

    color: theme.colours.textMuted,

    letterSpacing: 1.5,
  },

  emptyText: {
    marginTop: theme.spacing.xs,

    fontFamily: theme.fonts.body,
    fontSize: theme.fontSize.xs,

    color: theme.colours.textMuted,

    textAlign: "center",
  },

  footer: {
    marginTop: theme.spacing.lg,

    gap: theme.spacing.sm,
  },

  addPoiButton: {
    minHeight: 52,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1,
    borderColor: theme.colours.border,

    borderStyle: "dashed",

    borderRadius: theme.radius.md,
  },

  addPoiPlus: {
    fontFamily: theme.fonts.displayBold,
    fontSize: theme.fontSize.xl,

    color: theme.colours.accent,

    marginRight: theme.spacing.sm,
  },

  addPoiText: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: theme.fontSize.xs,

    color: theme.colours.text,

    letterSpacing: 1.5,
  },

  mapButton: {
    minHeight: 58,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    backgroundColor: theme.colours.surface,

    borderWidth: 1,
    borderColor: theme.colours.accent,

    borderRadius: theme.radius.md,
  },

  mapButtonText: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: theme.fontSize.sm,

    color: theme.colours.text,

    letterSpacing: 2,
  },

  mapArrow: {
    marginLeft: theme.spacing.sm,

    fontFamily: theme.fonts.displayBold,
    fontSize: theme.fontSize.lg,

    color: theme.colours.accent,
  },

  editButton: {
    minHeight: 44,

    alignItems: "center",
    justifyContent: "center",
  },

  editButtonText: {
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