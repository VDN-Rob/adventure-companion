import { POI } from "@/models/POI";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { theme } from "@/app/theme";

type POICardProps = {
  poi: POI;
  onPress: () => void;
};

const poiIcons: Record<POI["type"], string> = {
  food: "◆",
  water: "◇",
  supermarket: "▣",
  accommodation: "⌂",
  other: "●",
};

export function POICard({ poi, onPress }: POICardProps) {
  function formatVisitedTime(value: string) {
    return new Date(value).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        poi.visitedAt !== null && styles.visitedContainer,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.iconContainer}>
      <Text
        style={[
          styles.icon,
          poi.visitedAt !== null && styles.visitedIcon,
        ]}
      >
        {poi.visitedAt !== null
          ? "✓"
          : poiIcons[poi.type]}
      </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.type}>
            {poi.type.toUpperCase()}
          </Text>

          {poi.visitedAt !== null && (
            <Text>
              REACHED
            </Text>
          )}
        </View>

        <Text
          style={styles.name}
          numberOfLines={1}
        >
          {poi.name}
        </Text>

        {poi.notes && (
          <Text
            style={styles.notes}
            numberOfLines={2}
          >
            {poi.notes}
          </Text>
        )}

        {poi.latitude !== null &&
          poi.longitude !== null && (
            <Text style={styles.coordinates}>
              {poi.latitude.toFixed(4)},{" "}
              {poi.longitude.toFixed(4)}
            </Text>
          )}
      </View>

      {poi.visitedAt !== null && (
        <Text style={styles.visitedAt}>
          REACHED {formatVisitedTime(poi.visitedAt)}
        </Text>
      )}

      <Text style={styles.arrow}>
        →
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  visitedContainer: {
    borderColor: theme.colours.accent,
    opacity: 0.8,
  },
  
  visitedIcon: {
    color: theme.colours.accent,
  },
  
  visitedAt: {
    marginTop: 3,
  
    fontFamily: theme.fonts.bodyBold,
    fontSize: 9,
  
    color: theme.colours.accent,
    letterSpacing: 1,
  },
    container: {
      minHeight: 72,
  
      flexDirection: "row",
      alignItems: "center",
  
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
  
      backgroundColor: theme.colours.surface,
  
      borderWidth: 1,
      borderColor: theme.colours.border,
  
      borderRadius: theme.radius.md,
    },
  
    pressed: {
      backgroundColor: theme.colours.surfaceRaised,
      borderColor: theme.colours.accent,
  
      transform: [
        {
          translateY: 2,
        },
      ],
    },
  
    iconContainer: {
      width: 38,
      height: 38,
  
      alignItems: "center",
      justifyContent: "center",
  
      borderWidth: 1,
      borderColor: theme.colours.border,
  
      borderRadius: theme.radius.sm,
    },
  
    icon: {
      fontFamily: theme.fonts.displayBold,
      fontSize: theme.fontSize.md,
  
      color: theme.colours.accent,
    },
  
    content: {
      flex: 1,
  
      marginLeft: theme.spacing.sm,
    },
  
    header: {
      flexDirection: "row",
      alignItems: "center",
    },
  
    type: {
      fontFamily: theme.fonts.bodyBold,
      fontSize: theme.fontSize.xs,
  
      color: theme.colours.accent,
  
      letterSpacing: 1.5,
    },
  
    name: {
      marginTop: 2,
  
      fontFamily: theme.fonts.bodyBold,
      fontSize: theme.fontSize.md,
  
      color: theme.colours.text,
    },
  
    notes: {
      marginTop: 2,
  
      fontFamily: theme.fonts.body,
      fontSize: theme.fontSize.xs,
  
      color: theme.colours.textSecondary,
    },
  
    coordinates: {
      marginTop: 3,
  
      fontFamily: theme.fonts.body,
      fontSize: 10,
  
      color: theme.colours.textMuted,
    },
  
    arrow: {
      marginLeft: theme.spacing.sm,
  
      fontFamily: theme.fonts.displayBold,
      fontSize: theme.fontSize.lg,
  
      color: theme.colours.textMuted,
    },
  });