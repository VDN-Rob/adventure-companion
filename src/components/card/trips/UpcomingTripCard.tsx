import { Pressable, StyleSheet, Text, View } from "react-native";

import { Trip } from "@/models/Trip";
import { theme } from "@/styling/theme";

type UpcomingTripCardProps = {
  trip: Trip;
  onPress: () => void;
};

export function UpcomingTripCard({
  trip,
  onPress,
}: UpcomingTripCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.text}>
        <Text style={styles.title}>
          {trip.name}
        </Text>

        <Text style={styles.date}>
          {trip.startDate}
          {trip.endDate ? ` — ${trip.endDate}` : ""}
        </Text>
      </View>

      <Text style={styles.arrow}>
        →
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 68,

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: theme.spacing.md,

    backgroundColor: theme.colours.surface,

    borderWidth: 1,
    borderColor: theme.colours.border,

    borderRadius: theme.radius.md,
  },

  pressed: {
    backgroundColor: theme.colours.surfaceRaised,

    borderColor: theme.colours.accent,
  },

  text: {
    flex: 1,
  },

  title: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: theme.fontSize.md,

    color: theme.colours.text,

    letterSpacing: 1,
  },

  date: {
    marginTop: 2,

    fontFamily: theme.fonts.body,
    fontSize: theme.fontSize.xs,

    color: theme.colours.textMuted,
  },

  arrow: {
    fontFamily: theme.fonts.displayBold,
    fontSize: theme.fontSize.lg,

    color: theme.colours.textMuted,
  },
});