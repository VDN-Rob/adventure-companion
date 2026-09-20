import { Pressable, Text, View } from "react-native";

import { theme } from "@/styling/theme";

export type FinancePeriod = "30_DAYS" | "YEAR" | "ALL_TIME";

type PeriodSelectorProps = {
  period: FinancePeriod;
  onChange: (period: FinancePeriod) => void;
};

export function PeriodSelector({
  period,
  onChange,
}: PeriodSelectorProps) {
  return (
    <View style={styles.periodSection}>
      <Text style={styles.sectionLabel}>
        PERIOD
      </Text>

      <View style={styles.periodOptions}>
        <PeriodButton
          label="30 DAYS"
          active={period === "30_DAYS"}
          onPress={() => onChange("30_DAYS")}
        />

        <PeriodButton
          label="YEAR"
          active={period === "YEAR"}
          onPress={() => onChange("YEAR")}
        />

        <PeriodButton
          label="ALL TIME"
          active={period === "ALL_TIME"}
          onPress={() => onChange("ALL_TIME")}
        />
      </View>
    </View>
  );
}

type PeriodButtonProps = {
  label: string;
  active: boolean;
  onPress: () => void;
};

function PeriodButton({
  label,
  active,
  onPress,
}: PeriodButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.periodButton,
        active && styles.periodButtonActive,
        pressed && styles.periodButtonPressed,
      ]}
    >
      <Text
        style={[
          styles.periodButtonText,
          active && styles.periodButtonTextActive,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = {
  periodSection: {
    marginTop: theme.spacing.lg,
  },

  sectionLabel: {
    color: theme.colours.textMuted,
    fontFamily: theme.fonts.bodyMedium,
    fontSize: theme.fontSize.xs,
    letterSpacing: 1.5,
    marginBottom: theme.spacing.sm,
  },

  periodOptions: {
    flexDirection: "row" as const,
    gap: theme.spacing.sm,
  },

  periodButton: {
    alignItems: "center" as const,
    borderColor: theme.colours.border,
    borderRadius: theme.radius.md,
    borderWidth: theme.borders.thin,
    flex: 1,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
  },

  periodButtonActive: {
    backgroundColor: theme.colours.accent,
    borderColor: theme.colours.accent,
  },

  periodButtonPressed: {
    opacity: 0.75,
  },

  periodButtonText: {
    color: theme.colours.textSecondary,
    fontFamily: theme.fonts.bodyMedium,
    fontSize: theme.fontSize.xs,
  },

  periodButtonTextActive: {
    color: theme.colours.background,
    fontFamily: theme.fonts.bodyBold,
  },
};