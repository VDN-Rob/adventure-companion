import { Text, View } from "react-native";

import { ExpenseStatistics } from "@/services/ExpenseService";
import { theme } from "@/styling/theme";

type SpendingOverviewProps = {
  statistics: ExpenseStatistics | null;
};

export function SpendingOverview({
  statistics,
}: SpendingOverviewProps) {
  const entries = Object.entries(
    statistics?.byDate ?? {}
  ).sort(([dateA], [dateB]) =>
    dateA.localeCompare(dateB)
  );

  if (entries.length === 0) {
    return null;
  }

  const visibleEntries = entries.slice(-14);

  const maximum = Math.max(
    ...visibleEntries.map(([, amount]) => amount)
  );

  return (
    <View style={styles.spendingSection}>
      <Text style={styles.sectionLabel}>
        SPENDING OVER TIME
      </Text>

      <Text style={styles.sectionTitle}>
        DAILY SPENDING
      </Text>

      <View style={styles.chart}>
        {visibleEntries.map(([date, amount]) => {
          const percentage =
            maximum > 0 ? amount / maximum : 0;

          return (
            <View
              key={date}
              style={styles.chartColumn}
            >
              <View style={styles.chartBarContainer}>
                <View
                  style={[
                    styles.chartBar,
                    {
                      height: Math.max(
                        percentage * 120,
                        4
                      ),
                    },
                  ]}
                />
              </View>

              <Text style={styles.chartLabel}>
                {date.slice(8)}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = {
  spendingSection: {
    marginTop: theme.spacing.lg,
  },

  sectionLabel: {
    color: theme.colours.textMuted,
    fontFamily: theme.fonts.bodyMedium,
    fontSize: theme.fontSize.xs,
    letterSpacing: 1.5,
    marginBottom: theme.spacing.xs,
  },

  sectionTitle: {
    color: theme.colours.text,
    fontFamily: theme.fonts.displayBold,
    fontSize: theme.fontSize.lg,
    marginBottom: theme.spacing.md,
  },

  chart: {
    alignItems: "flex-end" as const,
    flexDirection: "row" as const,
    gap: theme.spacing.xs,
    height: 150,
  },

  chartColumn: {
    alignItems: "center" as const,
    flex: 1,
    height: "100%" as const,
    justifyContent: "flex-end" as const,
  },

  chartBarContainer: {
    alignItems: "center" as const,
    height: 120,
    justifyContent: "flex-end" as const,
    width: "100%" as const,
  },

  chartBar: {
    backgroundColor: theme.colours.accent,
    borderRadius: theme.radius.sm,
    minWidth: 6,
    width: "70%" as const,
  },

  chartLabel: {
    color: theme.colours.textMuted,
    fontFamily: theme.fonts.bodyMedium,
    fontSize: theme.fontSize.xs,
    marginTop: theme.spacing.xs,
  },
};