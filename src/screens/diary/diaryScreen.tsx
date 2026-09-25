import { Trip } from "@/models/Trip";
import { useAppServices } from "@/utils/useRepository/useAppServiceProvider";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { theme } from "@/styling/theme";
import { formatDate } from "@/utils/date";

type DiaryAdventure = {
  trip: Trip;
  entryCount: number;
};

export default function DiaryScreen() {
  const {
    tripServices,
    diaryEntryServices,
  } = useAppServices();

  const [adventures, setAdventures] = useState<
    DiaryAdventure[]
  >([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      async function loadDiaryOverview() {
        try {
          setIsLoading(true);
          setError(null);

          const trips =
            await tripServices.getAllTrips();

          const diaryAdventures =
            await Promise.all(
              trips.map(async (trip) => {
                const entries =
                  await diaryEntryServices
                    .getDiaryEntriesForTrip(
                      trip.id
                    );

                return {
                  trip,
                  entryCount: entries.length,
                };
              })
            );

          // Show adventures with the most recent
          // adventure first.
          diaryAdventures.sort((a, b) => {
            return b.trip.startDate.localeCompare(
              a.trip.startDate
            );
          });

          if (!cancelled) {
            setAdventures(diaryAdventures);
          }
        } catch (e) {
          console.error(
            "Failed to load diary overview:",
            e
          );

          if (!cancelled) {
            setError(
              "Unable to load your adventures."
            );
          }
        } finally {
          if (!cancelled) {
            setIsLoading(false);
          }
        }
      }

      loadDiaryOverview();

      return () => {
        cancelled = true;
      };
    }, [
      tripServices,
      diaryEntryServices,
    ])
  );

  function openAdventure(tripId: string) {
    router.push({
      pathname: "/diary/detailsDiary",
      params: {
        tripId,
      },
    });
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loading}>
          <ActivityIndicator />
          <Text style={styles.loadingText}>
            Loading adventures...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>
            SOMETHING WENT WRONG
          </Text>

          <Text style={styles.emptyText}>
            {error}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.kicker}>
              MEMORIES
            </Text>

            <Text style={styles.title}>
              DIARY
            </Text>
          </View>
        </View>

        <Text style={styles.intro}>
          Revisit the days, places and moments
          that made each adventure yours.
        </Text>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>
            YOUR ADVENTURES
          </Text>

          <Text style={styles.adventureCount}>
            {adventures.length}
          </Text>
        </View>

        {adventures.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>
              NO ADVENTURES YET
            </Text>

            <Text style={styles.emptyText}>
              Create an adventure first and your
              memories will appear here.
            </Text>
          </View>
        ) : (
          <View style={styles.adventureList}>
            {adventures.map(
              ({ trip, entryCount }) => (
                <AdventureCard
                  key={trip.id}
                  trip={trip}
                  entryCount={entryCount}
                  onPress={() =>
                    openAdventure(trip.id)
                  }
                />
              )
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

type AdventureCardProps = {
  trip: Trip;
  entryCount: number;
  onPress: () => void;
};

function AdventureCard({
  trip,
  entryCount,
  onPress,
}: AdventureCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.adventureCard,
        pressed &&
          styles.adventureCardPressed,
      ]}
    >
      <View style={styles.cardTop}>
        <Text style={styles.cardKicker}>
          ADVENTURE
        </Text>

        <Text style={styles.arrow}>
          →
        </Text>
      </View>

      <Text
        style={styles.cardTitle}
        numberOfLines={2}
      >
        {trip.name}
      </Text>

      <View style={styles.cardMeta}>
        <Text style={styles.cardDate}>
          {formatDate(trip.startDate)}
        </Text>

        <Text style={styles.cardDateSeparator}>
          →
        </Text>

        <Text style={styles.cardDate}>
          {trip.endDate
            ? formatDate(trip.endDate)
            : "ONGOING"}
        </Text>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.entryCount}>
          {entryCount === 1
            ? "1 DIARY ENTRY"
            : `${entryCount} DIARY ENTRIES`}
        </Text>

        {trip.description && (
          <Text
            style={styles.description}
            numberOfLines={2}
          >
            {trip.description}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      theme.colours.background,
  },

  content: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },

  header: {
    marginBottom: theme.spacing.md,
  },

  kicker: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: theme.fontSize.xs,
    letterSpacing: 2,
    color: theme.colours.accent,
  },

  title: {
    marginTop: 2,
    fontFamily: theme.fonts.displayBold,
    fontSize: theme.fontSize.xxl,
    color: theme.colours.text,
  },

  intro: {
    maxWidth: 360,
    marginBottom: theme.spacing.xl,
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSize.md,
    lineHeight: 24,
    color: theme.colours.textSecondary,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing.md,
  },

  sectionLabel: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: theme.fontSize.xs,
    letterSpacing: 1.5,
    color: theme.colours.textMuted,
  },

  adventureCount: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: theme.fontSize.xs,
    color: theme.colours.textMuted,
  },

  adventureList: {
    gap: theme.spacing.md,
  },

  adventureCard: {
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colours.border,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colours.surface,
  },

  adventureCardPressed: {
    backgroundColor:
      theme.colours.surfaceRaised,
    borderColor: theme.colours.accent,
    transform: [{ translateY: 2 }],
  },

  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  cardKicker: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: theme.fontSize.xs,
    letterSpacing: 1.5,
    color: theme.colours.accent,
  },

  arrow: {
    fontFamily: theme.fonts.displayBold,
    fontSize: theme.fontSize.lg,
    color: theme.colours.textMuted,
  },

  cardTitle: {
    marginTop: theme.spacing.sm,
    fontFamily: theme.fonts.displayBold,
    fontSize: theme.fontSize.xl,
    lineHeight: 28,
    color: theme.colours.text,
  },

  cardMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: theme.spacing.sm,
  },

  cardDate: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: theme.fontSize.xs,
    color: theme.colours.textSecondary,
  },

  cardDateSeparator: {
    marginHorizontal: theme.spacing.xs,
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSize.xs,
    color: theme.colours.textMuted,
  },

  cardFooter: {
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colours.border,
  },

  entryCount: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: theme.fontSize.xs,
    letterSpacing: 1,
    color: theme.colours.textMuted,
  },

  description: {
    marginTop: theme.spacing.xs,
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSize.sm,
    lineHeight: 20,
    color: theme.colours.textSecondary,
  },

  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
  },

  loadingText: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSize.sm,
    color: theme.colours.textSecondary,
  },

  empty: {
    alignItems: "center",
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },

  emptyTitle: {
    fontFamily: theme.fonts.displayBold,
    fontSize: theme.fontSize.lg,
    color: theme.colours.text,
    textAlign: "center",
  },

  emptyText: {
    marginTop: theme.spacing.sm,
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSize.sm,
    lineHeight: 20,
    textAlign: "center",
    color: theme.colours.textSecondary,
  },
});
