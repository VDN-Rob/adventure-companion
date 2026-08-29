import { theme } from '@/styling/theme';
import { StyleSheet, Text, View } from 'react-native';

type AppHeaderProps = {
  appName: string;
  tripName: string;
  currentDay?: number;
  totalDays?: number | string | null;
};

export function AppHeader({
  appName,
  tripName,
  currentDay,
  totalDays,
}: AppHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.titleContainer}>
          <Text style={styles.appName}>{appName}</Text>

          <View style={styles.accentLine} />
        </View>

        {currentDay !== undefined && (
          <View style={styles.dayContainer}>
            <Text style={styles.dayLabel}>
              DAY
            </Text>

            <Text style={styles.dayNumber}>
              {String(currentDay).padStart(2, "0")}
            </Text>

            <Text style={styles.dayTotal}>
              /{" "}
              {typeof totalDays === "number"
                ? String(totalDays).padStart(2, "0")
                : totalDays}
            </Text>
          </View>
        )}
      </View>

      <Text style={styles.tripName}>
        {tripName}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.lg,

    backgroundColor: theme.colours.background,

    borderBottomWidth: 1,
    borderBottomColor: theme.colours.border,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },

  titleContainer: {
    flex: 1,
  },

  appName: {
    fontFamily: theme.fonts.displayBold,
    fontSize: theme.fontSize.xxl,

    color: theme.colours.text,

    letterSpacing: 3,
    textTransform: 'uppercase',
  },

  accentLine: {
    width: 36,
    height: 2,

    marginTop: theme.spacing.xs,

    backgroundColor: theme.colours.accent,
  },

  dayContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',

    marginLeft: theme.spacing.lg,
  },

  dayLabel: {
    marginRight: theme.spacing.xs,

    fontFamily: theme.fonts.bodyMedium,
    fontSize: theme.fontSize.xs,

    color: theme.colours.textMuted,

    letterSpacing: 1.5,
  },

  dayNumber: {
    fontFamily: theme.fonts.displayBold,
    fontSize: theme.fontSize.xl,

    color: theme.colours.accent,

    letterSpacing: 1,
  },

  dayTotal: {
    marginLeft: 2,

    fontFamily: theme.fonts.displayMedium,
    fontSize: theme.fontSize.md,

    color: theme.colours.textMuted,
  },

  tripName: {
    marginTop: theme.spacing.sm,

    fontFamily: theme.fonts.body,
    fontSize: theme.fontSize.sm,

    color: theme.colours.textSecondary,

    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});