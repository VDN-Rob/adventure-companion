import { theme } from "@/app/theme";
import { POI } from "@/models/POI";
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

type CheckInModalProps = {
  visible: boolean;
  pois: POI[];
  onClose: () => void;
  onCheckIn: (poi: POI) => void;
};

const poiIcons: Record<POI["type"], string> = {
  food: "◆",
  water: "◇",
  supermarket: "▣",
  accommodation: "⌂",
  other: "●",
};

export function CheckInModal({
  visible,
  pois,
  onClose,
  onCheckIn,
}: CheckInModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          
          {/* Header */}

          <View style={styles.header}>
            <View>
              <Text style={styles.eyebrow}>
                TODAY'S WAYPOINTS
              </Text>

              <Text style={styles.title}>
                CHECKPOINTS
              </Text>
            </View>

            <Pressable
              onPress={onClose}
              style={styles.closeButton}
            >
              <Text style={styles.close}>
                ×
              </Text>
            </Pressable>
          </View>

          {/* POIs */}

          <View style={styles.list}>
            {pois.map((poi) => {
              const visited = poi.visitedAt !== null;

              return (
                <Pressable
                  key={poi.id}
                  disabled={visited}
                  onPress={() => onCheckIn(poi)}
                  style={({ pressed }) => [
                    styles.poi,
                    visited && styles.poiVisited,
                    pressed && styles.poiPressed,
                  ]}
                >
                  <View style={styles.iconContainer}>
                    <Text
                      style={[
                        styles.icon,
                        visited && styles.visitedIcon,
                      ]}
                    >
                      {visited
                        ? "✓"
                        : poiIcons[poi.type]}
                    </Text>
                  </View>

                  <View style={styles.poiContent}>
                    <Text style={styles.poiType}>
                      {poi.type.toUpperCase()}
                    </Text>

                    <Text style={styles.poiName}>
                      {poi.name}
                    </Text>

                    <Text
                      style={[
                        styles.status,
                        visited && styles.visitedStatus,
                      ]}
                    >
                      {visited
                        ? `REACHED · ${formatTime(poi.visitedAt!)}`
                        : "TAP TO CHECK IN"}
                    </Text>
                  </View>

                  {!visited && (
                    <Text style={styles.arrow}>
                      →
                    </Text>
                  )}
                </Pressable>
              );
            })}
          </View>

          {pois.length === 0 && (
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>
                NO WAYPOINTS
              </Text>

              <Text style={styles.emptyText}>
                There are no POIs planned for today.
              </Text>
            </View>
          )}

          <Pressable
            onPress={onClose}
            style={styles.cancelButton}
          >
            <Text style={styles.cancelText}>
              CLOSE
            </Text>
          </Pressable>

        </View>
      </View>
    </Modal>
  );
}

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: "flex-end",
  
      backgroundColor: "rgba(0, 0, 0, 0.65)",
    },
  
    modal: {
      maxHeight: "85%",
  
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.lg,
      paddingBottom: theme.spacing.lg,
  
      backgroundColor: theme.colours.background,
  
      borderTopWidth: 1,
      borderColor: theme.colours.border,
  
      borderTopLeftRadius: theme.radius.lg,
      borderTopRightRadius: theme.radius.lg,
    },
  
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
  
      marginBottom: theme.spacing.lg,
    },
  
    eyebrow: {
      fontFamily: theme.fonts.bodyBold,
      fontSize: theme.fontSize.xs,
  
      color: theme.colours.accent,
      letterSpacing: 2,
    },
  
    title: {
      marginTop: 2,
  
      fontFamily: theme.fonts.displayBold,
      fontSize: theme.fontSize.xxl,
  
      color: theme.colours.text,
      letterSpacing: 1,
    },
  
    closeButton: {
      width: 42,
      height: 42,
  
      alignItems: "center",
      justifyContent: "center",
  
      borderWidth: 1,
      borderColor: theme.colours.border,
      borderRadius: theme.radius.sm,
    },
  
    close: {
      fontFamily: theme.fonts.displayBold,
      fontSize: 26,
  
      color: theme.colours.textMuted,
    },
  
    list: {
      gap: theme.spacing.sm,
    },
  
    poi: {
      minHeight: 72,
  
      flexDirection: "row",
      alignItems: "center",
  
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.sm,
  
      backgroundColor: theme.colours.surface,
  
      borderWidth: 1,
      borderColor: theme.colours.border,
  
      borderRadius: theme.radius.md,
    },
  
    poiVisited: {
      borderColor: theme.colours.accent,
      opacity: 0.7,
    },
  
    poiPressed: {
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
  
    visitedIcon: {
      color: theme.colours.accent,
    },
  
    poiContent: {
      flex: 1,
      marginLeft: theme.spacing.sm,
    },
  
    poiType: {
      fontFamily: theme.fonts.bodyBold,
      fontSize: 9,
  
      color: theme.colours.accent,
      letterSpacing: 1.5,
    },
  
    poiName: {
      marginTop: 2,
  
      fontFamily: theme.fonts.bodyBold,
      fontSize: theme.fontSize.md,
  
      color: theme.colours.text,
    },
  
    status: {
      marginTop: 3,
  
      fontFamily: theme.fonts.body,
      fontSize: 9,
  
      color: theme.colours.textMuted,
      letterSpacing: 0.5,
    },
  
    visitedStatus: {
      color: theme.colours.accent,
    },
  
    arrow: {
      marginLeft: theme.spacing.sm,
  
      fontFamily: theme.fonts.displayBold,
      fontSize: theme.fontSize.lg,
  
      color: theme.colours.textMuted,
    },
  
    empty: {
      paddingVertical: theme.spacing.xl,
  
      alignItems: "center",
    },
  
    emptyTitle: {
      fontFamily: theme.fonts.displayBold,
      fontSize: theme.fontSize.lg,
  
      color: theme.colours.text,
      letterSpacing: 1,
    },
  
    emptyText: {
      marginTop: theme.spacing.xs,
  
      fontFamily: theme.fonts.body,
      fontSize: theme.fontSize.sm,
  
      color: theme.colours.textMuted,
      textAlign: "center",
    },
  
    cancelButton: {
      height: 48,
  
      alignItems: "center",
      justifyContent: "center",
  
      marginTop: theme.spacing.lg,
  
      borderWidth: 1,
      borderColor: theme.colours.border,
      borderRadius: theme.radius.md,
    },
  
    cancelText: {
      fontFamily: theme.fonts.displayBold,
      fontSize: theme.fontSize.sm,
  
      color: theme.colours.textSecondary,
      letterSpacing: 1.5,
    },
  });