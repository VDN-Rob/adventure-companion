import { theme } from "@/app/theme";
import { Day } from "@/models/Day";
import { POI } from "@/models/POI";
import { Route } from "@/models/Route";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { DayMapPreview } from "./homescreen/DayMapPreview";

type DayCardProps = {
  day: Day;
  route?: Route;
  pois: POI[];
  isToday?: boolean;
  onPress: () => void;
};

export function DayCard({
  day,
  route,
  pois,
  isToday = false,
  onPress,
}: DayCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.dayLabel}>
            DAY
          </Text>

          <Text style={styles.title}>
            {day.title ?? "Untitled Day"}
          </Text>
        </View>

        {isToday && (
          <Text style={styles.today}>
            TODAY
          </Text>
        )}
      </View>

      <View style={styles.divider} />

      {/* Main content */}
      <View style={styles.content}>

        {/* Map */}
        <View style={styles.mapContainer}>
          <DayMapPreview />
        </View>

        {/* Statistics */}
        <View style={styles.stats}>

          {day.plannedDistance !== null && (
            <View style={styles.stat}>
              <Text style={styles.statValue}>
                {day.plannedDistance}
              </Text>

              <Text style={styles.statUnit}>
                KM
              </Text>
            </View>
          )}

          {day.plannedElevation !== null && (
            <View style={styles.stat}>
              <Text style={styles.statValue}>
                {day.plannedElevation}
              </Text>

              <Text style={styles.statUnit}>
                M ↑
              </Text>
            </View>
          )}

          <View style={styles.poiStat}>
            <Text style={styles.poiIcon}>
              ◆
            </Text>

            <Text style={styles.poiText}>
              {pois.length} POI{pois.length === 1 ? "" : "s"}
            </Text>
          </View>

        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.date}>
          {day.date}
        </Text>

        <Text style={styles.arrow}>
          →
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flex: 1,
  },
  card: {
    backgroundColor: theme.colours.surface,

    borderWidth: 1,
    borderColor: theme.colours.border,

    borderRadius: theme.radius.md,

    overflow: "hidden",
  },

  cardPressed: {
    backgroundColor: theme.colours.surfaceRaised,

    borderColor: theme.colours.borderStrong,

    transform: [
      {
        translateY: 2,
      },
    ],
  },

  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.md,

    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },

  dayLabel: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: theme.fontSize.xs,

    color: theme.colours.textMuted,

    letterSpacing: 2,
  },

  title: {
    marginTop: 2,

    fontFamily: theme.fonts.displayBold,
    fontSize: theme.fontSize.xl,

    color: theme.colours.text,

    letterSpacing: 1,
    textTransform: "uppercase",
  },

  today: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,

    fontFamily: theme.fonts.bodyBold,
    fontSize: theme.fontSize.xs,

    color: theme.colours.accent,

    letterSpacing: 1.5,

    borderWidth: 1,
    borderColor: theme.colours.accent,

    borderRadius: theme.radius.sm,
  },

  divider: {
    height: 1,
    backgroundColor: theme.colours.border,
  },

  content: {
    padding: theme.spacing.sm,

    flexDirection: "row",
    gap: theme.spacing.sm,
  },

  mapContainer: {
    flex: 1,
    minHeight: 160,
  
    overflow: "hidden",
  
    borderWidth: 1,
    borderColor: theme.colours.border,
  
    backgroundColor: theme.colours.mapBackground,
  },

  stats: {
    width: "35%",

    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,

    justifyContent: "center",
    gap: theme.spacing.lg,
  },

  stat: {
    alignItems: "flex-start",
  },

  statValue: {
    fontFamily: theme.fonts.displayBold,
    fontSize: theme.fontSize.xxl,

    color: theme.colours.text,

    lineHeight: 34,
  },

  statUnit: {
    marginTop: -2,

    fontFamily: theme.fonts.bodyBold,
    fontSize: theme.fontSize.xs,

    color: theme.colours.accent,

    letterSpacing: 1.5,
  },

  footer: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    borderTopWidth: 1,
    borderTopColor: theme.colours.border,
  },

  date: {
    fontFamily: theme.fonts.bodyMedium,
    fontSize: theme.fontSize.sm,

    color: theme.colours.textSecondary,

    letterSpacing: 0.5,
  },

  arrow: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSize.lg,

    color: theme.colours.accent,
  },
  poiStat: {
    flexDirection: "row",
    alignItems: "center",
  
    marginTop: theme.spacing.sm,
  },
  
  poiIcon: {
    marginRight: theme.spacing.sm,
  
    fontSize: 10,
  
    color: theme.colours.accent,
  },
  
  poiText: {
    fontFamily: theme.fonts.bodyMedium,
    fontSize: theme.fontSize.sm,
  
    color: theme.colours.textSecondary,
  
    letterSpacing: 0.5,
  },
});