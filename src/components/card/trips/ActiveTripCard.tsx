import { Pressable, StyleSheet, Text, View } from "react-native";

import { Trip } from "@/models/Trip";
import { theme } from "@/styling/theme";

type ActiveTripCardProps = {
  trip: Trip;
  currentDay: number;
  totalDays: number | null;
  onPress: () => void;
};

export function ActiveTripCard({
  trip,
  currentDay,
  totalDays,
  onPress,
}: ActiveTripCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.topRow}>
        <Text style={styles.status}>
          ACTIVE
        </Text>

        <Text style={styles.day}>
          DAY {currentDay} / {totalDays}
        </Text>
      </View>

      <Text style={styles.title}>
        {trip.name}
      </Text>

      {trip.description && (
        <Text
          style={styles.description}
          numberOfLines={2}
        >
          {trip.description}
        </Text>
      )}

      <View style={styles.progressBackground}>
        {totalDays !== null && totalDays > 0 && (
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

      <View style={styles.bottomRow}>
        <Text style={styles.continue}>
          CONTINUE
        </Text>

        <Text style={styles.arrow}>
          →
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
    container: {
      padding: theme.spacing.lg,
  
      backgroundColor: theme.colours.surface,
  
      borderWidth: 1,
      borderColor: theme.colours.accent,
  
      borderRadius: theme.radius.md,
    },
  
    pressed: {
      backgroundColor: theme.colours.surfaceRaised,
  
      transform: [
        {
          translateY: 2,
        },
      ],
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
  
    title: {
      marginTop: theme.spacing.sm,
  
      fontFamily: theme.fonts.displayBold,
      fontSize: theme.fontSize.xxl,
  
      color: theme.colours.text,
  
      letterSpacing: 1,
    },
  
    description: {
      marginTop: theme.spacing.xs,
  
      fontFamily: theme.fonts.body,
      fontSize: theme.fontSize.sm,
  
      color: theme.colours.textSecondary,
  
      lineHeight: 18,
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