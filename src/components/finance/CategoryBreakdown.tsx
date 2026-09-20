import { Text, View } from "react-native";

import { theme } from "@/styling/theme";
import { formatCurrency } from "@/utils/finance/financeHelpers";

type CategoryBreakdownProps = {
  statistics: Record<string, number>;
  currency: string;
};

export function CategoryBreakdown({
  statistics,
  currency,
}: CategoryBreakdownProps) {
  const entries = Object.entries(statistics).sort(
    ([, amountA], [, amountB]) => amountB - amountA
  );

  if (entries.length === 0) {
    return null;
  }

  const maximum = Math.max(
    ...entries.map(([, amount]) => amount)
  );

  return (
    <View style={styles.categorySection}>
      <Text style={styles.sectionLabel}>
        WHERE IT WENT
      </Text>

      <Text style={styles.categoryTitle}>
        EXPENSE BREAKDOWN
      </Text>

      <View style={styles.categories}>
        {entries.map(([category, amount]) => {
          const percentage =
            maximum > 0 ? amount / maximum : 0;

          return (
            <View
              key={category}
              style={styles.category}
            >
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryName}>
                  {category.toUpperCase()}
                </Text>

                <Text style={styles.categoryAmount}>
                  {formatCurrency(amount, currency)}
                </Text>
              </View>

              <View style={styles.categoryTrack}>
                <View
                  style={[
                    styles.categoryBar,
                    {
                      width: `${percentage * 100}%`,
                    },
                  ]}
                />
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = {
  categorySection: {
    marginTop: theme.spacing.lg,
  },

  sectionLabel: {
    color: theme.colours.textMuted,
    fontFamily: theme.fonts.bodyMedium,
    fontSize: theme.fontSize.xs,
    letterSpacing: 1.5,
    marginBottom: theme.spacing.xs,
  },

  categoryTitle: {
    color: theme.colours.text,
    fontFamily: theme.fonts.displayBold,
    fontSize: theme.fontSize.lg,
    marginBottom: theme.spacing.md,
  },

  categories: {
    gap: theme.spacing.md,
  },

  category: {
    gap: theme.spacing.xs,
  },

  categoryHeader: {
    alignItems: "center" as const,
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
  },

  categoryName: {
    color: theme.colours.text,
    fontFamily: theme.fonts.bodyMedium,
    fontSize: theme.fontSize.sm,
  },

  categoryAmount: {
    color: theme.colours.text,
    fontFamily: theme.fonts.bodyMedium,
    fontSize: theme.fontSize.sm,
  },

  categoryTrack: {
    backgroundColor: theme.colours.surfaceRaised,
    borderRadius: theme.radius.sm,
    height: 6,
    overflow: "hidden" as const,
  },

  categoryBar: {
    backgroundColor: theme.colours.accent,
    borderRadius: theme.radius.sm,
    height: "100%" as const,
  },
};