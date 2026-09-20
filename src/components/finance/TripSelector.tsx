import { Pressable, Text, View } from "react-native";

import { Trip } from "@/models/Trip";
import { theme } from "@/styling/theme";

type TripSelectorProps = {
  trips: Trip[];
  selectedTrip: Trip | null;
  visible: boolean;
  onOpen: () => void;
  onClose: () => void;
  onSelect: (tripId: string | null) => void;
};

export function TripSelector({
  trips,
  selectedTrip,
  visible,
  onOpen,
  onClose,
  onSelect,
}: TripSelectorProps) {
  const handleSelect = (tripId: string | null) => {
    onSelect(tripId);
    onClose();
  };

  return (
    <View>
      <Pressable
        style={({ pressed }) => [
          styles.selector,
          pressed && styles.selectorPressed,
        ]}
        onPress={onOpen}
      >
        <View style={styles.selectorContent}>
          <Text style={styles.selectorLabel}>
            FINANCE SCOPE
          </Text>

          <Text style={styles.selectorValue}>
            {selectedTrip?.name ?? "ALL EXPENSES"}
          </Text>
        </View>

        <Text style={styles.selectorArrow}>
          ▼
        </Text>
      </Pressable>

      {visible && (
        <View style={styles.selectorOptions}>
          <Pressable
            style={[
              styles.selectorOption,
              selectedTrip === null &&
                styles.selectorOptionSelected,
            ]}
            onPress={() => handleSelect(null)}
          >
            <Text
              style={[
                styles.selectorOptionText,
                selectedTrip === null &&
                  styles.selectorOptionTextSelected,
              ]}
            >
              ALL EXPENSES
            </Text>

            <Text style={styles.selectorOptionDate}>
              All recorded expenses
            </Text>
          </Pressable>

          {trips.map((trip) => {
            const selected =
              trip.id === selectedTrip?.id;

            return (
              <Pressable
                key={trip.id}
                style={[
                  styles.selectorOption,
                  selected &&
                    styles.selectorOptionSelected,
                ]}
                onPress={() =>
                  handleSelect(trip.id)
                }
              >
                <Text
                  style={[
                    styles.selectorOptionText,
                    selected &&
                      styles.selectorOptionTextSelected,
                  ]}
                  numberOfLines={1}
                >
                  {trip.name}
                </Text>

                <Text style={styles.selectorOptionDate}>
                  {trip.startDate}
                  {" → "}
                  {trip.endDate ?? "∞"}
                </Text>
              </Pressable>
            );
          })}

          <Pressable
            style={({ pressed }) => [
              styles.selectorClose,
              pressed && styles.selectorClosePressed,
            ]}
            onPress={onClose}
          >
            <Text style={styles.selectorCloseText}>
              CLOSE
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = {
  selector: {
    alignItems: "center" as const,
    backgroundColor: theme.colours.surface,
    borderColor: theme.colours.border,
    borderRadius: theme.radius.md,
    borderWidth: theme.borders.thin,
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    padding: theme.spacing.md,
  },

  selectorPressed: {
    opacity: 0.75,
  },

  selectorContent: {
    flex: 1,
  },

  selectorLabel: {
    color: theme.colours.textMuted,
    fontFamily: theme.fonts.bodyMedium,
    fontSize: theme.fontSize.xs,
    letterSpacing: 1.5,
    marginBottom: theme.spacing.xs,
  },

  selectorValue: {
    color: theme.colours.text,
    fontFamily: theme.fonts.bodyMedium,
    fontSize: theme.fontSize.md,
  },

  selectorArrow: {
    color: theme.colours.accent,
    fontFamily: theme.fonts.bodyBold,
    fontSize: theme.fontSize.sm,
    marginLeft: theme.spacing.md,
  },

  selectorOptions: {
    backgroundColor: theme.colours.surface,
    borderColor: theme.colours.border,
    borderRadius: theme.radius.md,
    borderWidth: theme.borders.thin,
    marginTop: theme.spacing.xs,
    overflow: "hidden" as const,
  },

  selectorOption: {
    borderBottomColor: theme.colours.border,
    borderBottomWidth: theme.borders.thin,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },

  selectorOptionSelected: {
    backgroundColor: theme.colours.surfaceRaised,
    borderLeftColor: theme.colours.accent,
    borderLeftWidth: 3,
  },

  selectorOptionText: {
    color: theme.colours.text,
    fontFamily: theme.fonts.bodyMedium,
    fontSize: theme.fontSize.md,
  },

  selectorOptionTextSelected: {
    color: theme.colours.accentBright,
    fontFamily: theme.fonts.bodyBold,
  },

  selectorOptionDate: {
    color: theme.colours.textMuted,
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSize.xs,
    marginTop: theme.spacing.xs,
  },

  selectorClose: {
    alignItems: "center" as const,
    paddingVertical: theme.spacing.md,
  },

  selectorClosePressed: {
    opacity: 0.75,
  },

  selectorCloseText: {
    color: theme.colours.textSecondary,
    fontFamily: theme.fonts.bodyBold,
    fontSize: theme.fontSize.xs,
    letterSpacing: 1,
  },
};