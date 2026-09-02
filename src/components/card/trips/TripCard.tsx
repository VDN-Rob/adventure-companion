import { Trip } from "@/models/Trip";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { theme } from "@/styling/theme";
import { getDayNumber, getTodayDate } from "@/utils/date";

type TripCardProps = {
  trip: Trip;
  onPress: () => void;
  active?: boolean;
};

export function TripCard({ trip, onPress, active = false }: TripCardProps) {
  let currentDay: number | null = null;
  let totalDays: number | null = null;
  const todayDate = getTodayDate();

  if (active) {
    currentDay = getDayNumber(trip.startDate, todayDate);
    totalDays = trip.endDate === null ? null : getDayNumber(trip.startDate, trip.endDate);
  }

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]}
    >
      { active && 
      <View style={styles.topRow}>

        <Text style={styles.dates}>
          DAY {currentDay} / {totalDays === null ? "To Infinity" : totalDays}
        </Text>
      </View>
      }

    <Text style={styles.title}>
      {trip.name}
    </Text>
    
    <Text style={styles.dates}>
        {trip.startDate}
        {" → "}
        {trip.endDate ?? "∞"}
      </Text>

    {trip.description && (
      <Text
        style={styles.description}
        numberOfLines={2}
      >
        {trip.description}
      </Text>
    )}

    {active &&
      <View style={styles.progressBackground}>
        {totalDays && currentDay && totalDays !== null && totalDays > 0 && (
          <View
            style={[
              styles.progress,
              {
                width: `${Math.min(
                  (currentDay / totalDays) * 100,
                  100
                )}%`,
              },
            ]}
          />
        )}
      </View>
    }
    {active &&
      <View style={styles.bottomRow}>
        <Text style={styles.continue}>
          CONTINUE
        </Text>

        <Text style={styles.arrow}>
          →
        </Text>
      </View>
      }
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.md,
    backgroundColor: theme.colours.surface,
    borderWidth: 1,
    borderColor: theme.colours.border,
    borderRadius: theme.radius.md,
  },

  pressed: {
    backgroundColor: theme.colours.surfaceRaised,
    transform: [{ translateY: 2 }],
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
  },

  title: {
    fontFamily: theme.fonts.displayBold,
    fontSize: theme.fontSize.xl,
    color: theme.colours.text,
    letterSpacing: 0.5,
  },

  dates: {
    marginTop: theme.spacing.xs,
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSize.sm,
    color: theme.colours.textMuted,
  },

  description: {
    marginTop: theme.spacing.sm,
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSize.sm,
    color: theme.colours.textSecondary,
    lineHeight: 18,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  status: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: theme.fontSize.xs,

    color: theme.colours.accent,

    letterSpacing: 2,
  },

  day: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: theme.fontSize.xs,

    color: theme.colours.textMuted,

    letterSpacing: 1,
  },
  progressBackground: {
    height: 4,

    marginTop: theme.spacing.lg,

    backgroundColor: theme.colours.border,

    borderRadius: 2,

    overflow: "hidden",
  },

  progress: {
    height: "100%",

    backgroundColor: theme.colours.accent,
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",

    marginTop: theme.spacing.md,
  },

  continue: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: theme.fontSize.xs,

    color: theme.colours.text,

    letterSpacing: 1.5,
  },

  arrow: {
    marginLeft: theme.spacing.xs,

    fontFamily: theme.fonts.displayBold,
    fontSize: theme.fontSize.lg,

    color: theme.colours.accent,
  },
});