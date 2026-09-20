import { Text, View } from "react-native";

import { Trip } from "@/models/Trip";
import { theme } from "@/styling/theme";
import { formatCurrency } from "@/utils/finance/financeHelpers";

type FinanceSummaryProps = {
  totalSpent: number;
  currency: string;
  selectedTrip: Trip | null;
  dailySpending: number | null;
  dailyBudget: number | null;
  remaining: number | null;
  budgetPercentage: number;
};

export function FinanceSummary({
  totalSpent,
  currency,
  selectedTrip,
  dailySpending,
  dailyBudget,
  remaining,
  budgetPercentage,
}: FinanceSummaryProps) {
  return (
    <View style={styles.summary}>
      <Text style={styles.sectionLabel}>
        {selectedTrip ? "TRIP SPENDING" : "TOTAL SPENT"}
      </Text>

      <Text style={styles.total}>
        {formatCurrency(totalSpent, currency)}
      </Text>

      {selectedTrip && (
        <>
          <View style={styles.dailyRow}>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>
                DAILY SPENDING
              </Text>

              <Text style={styles.statValue}>
                {dailySpending !== null
                  ? formatCurrency(dailySpending, currency)
                  : "—"}
              </Text>
            </View>

            <View style={styles.stat}>
              <Text style={styles.statLabel}>
                DAILY BUDGET
              </Text>

              <Text style={styles.statValue}>
                {dailyBudget !== null
                  ? formatCurrency(dailyBudget, currency)
                  : "—"}
              </Text>
            </View>
          </View>

          {selectedTrip.budget !== null ? (
            <>
              <View style={styles.budgetRow}>
                <Text style={styles.statLabel}>
                  TOTAL BUDGET
                </Text>

                <Text style={styles.statValue}>
                  {formatCurrency(
                    selectedTrip.budget,
                    currency
                  )}
                </Text>
              </View>

              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progress,
                    {
                      width: `${Math.min(
                        Math.max(budgetPercentage, 0),
                        1
                      ) * 100}%`,
                    },
                  ]}
                />
              </View>

              <View style={styles.budgetRow}>
                <Text style={styles.statLabel}>
                  {remaining !== null && remaining >= 0
                    ? "REMAINING"
                    : "OVER BUDGET"}
                </Text>

                <Text style={styles.statValue}>
                  {formatCurrency(
                    Math.abs(remaining ?? 0),
                    currency
                  )}
                </Text>
              </View>
            </>
          ) : (
            <Text style={styles.noBudget}>
              NO BUDGET SET
            </Text>
          )}
        </>
      )}
    </View>
  );
}

const styles = {
  summary: {
    backgroundColor: theme.colours.surface,
    borderColor: theme.colours.border,
    borderRadius: theme.radius.lg,
    borderWidth: theme.borders.thin,
    padding: theme.spacing.lg,
  },

  sectionLabel: {
    color: theme.colours.textMuted,
    fontFamily: theme.fonts.bodyMedium,
    fontSize: theme.fontSize.xs,
    letterSpacing: 1.5,
    marginBottom: theme.spacing.xs,
  },

  total: {
    color: theme.colours.text,
    fontFamily: theme.fonts.displayBold,
    fontSize: theme.fontSize.xxl,
  },

  dailyRow: {
    borderTopColor: theme.colours.border,
    borderTopWidth: theme.borders.thin,
    flexDirection: "row" as const,
    gap: theme.spacing.xl,
    marginTop: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
  },

  stat: {
    flex: 1,
  },

  statLabel: {
    color: theme.colours.textMuted,
    fontFamily: theme.fonts.bodyMedium,
    fontSize: theme.fontSize.xs,
    letterSpacing: 1,
  },

  statValue: {
    color: theme.colours.text,
    fontFamily: theme.fonts.bodyMedium,
    fontSize: theme.fontSize.md,
    marginTop: theme.spacing.xs,
  },

  budgetRow: {
    alignItems: "center" as const,
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    marginTop: theme.spacing.lg,
  },

  progressTrack: {
    backgroundColor: theme.colours.surfaceRaised,
    borderRadius: theme.radius.sm,
    height: 8,
    marginTop: theme.spacing.sm,
    overflow: "hidden" as const,
  },

  progress: {
    backgroundColor: theme.colours.accent,
    borderRadius: theme.radius.sm,
    height: "100%" as const,
  },

  noBudget: {
    color: theme.colours.textMuted,
    fontFamily: theme.fonts.bodyMedium,
    fontSize: theme.fontSize.sm,
    marginTop: theme.spacing.lg,
  },
};