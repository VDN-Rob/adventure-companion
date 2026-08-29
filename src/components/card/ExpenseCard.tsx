import { Expense } from "@/models/Expense";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { theme } from "@/styling/theme";

type ExpenseCardProps = {
  expense: Expense;
  onPress: () => void;
};

const categoryIcons: Record<Expense["category"], string> = {
  food: "◆",
  accommodation: "⌂",
  transport: "➜",
  gear: "◇",
  activity: "★",
  other: "●",
};

export function ExpenseCard({
  expense,
  onPress,
}: ExpenseCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>
          {categoryIcons[expense.category]}
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.category}>
            {expense.category.toUpperCase()}
          </Text>
        </View>

        <Text
          style={styles.description}
          numberOfLines={1}
        >
          {expense.description ?? "Expense"}
        </Text>

        <Text style={styles.date}>
          {formatExpenseDate(expense.date)}
        </Text>
      </View>

      <View style={styles.amountContainer}>
        <Text style={styles.amount}>
          {formatAmount(expense.amount, expense.currency)}
        </Text>

        <Text style={styles.arrow}>
          →
        </Text>
      </View>
    </Pressable>
  );
}

function formatAmount(
  amount: number,
  currency: string
) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
  }).format(amount);
}

function formatExpenseDate(date: string) {
  return new Date(date).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
  }).toUpperCase();
}

const styles = StyleSheet.create({
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
  
    category: {
      fontFamily: theme.fonts.bodyBold,
      fontSize: theme.fontSize.xs,
  
      color: theme.colours.accent,
  
      letterSpacing: 1.5,
    },
  
    description: {
      marginTop: 2,
  
      fontFamily: theme.fonts.bodyBold,
      fontSize: theme.fontSize.md,
  
      color: theme.colours.text,
    },
  
    date: {
      marginTop: 3,
  
      fontFamily: theme.fonts.body,
      fontSize: 10,
  
      color: theme.colours.textMuted,
  
      letterSpacing: 0.5,
    },
  
    amountContainer: {
      alignItems: "flex-end",
      marginLeft: theme.spacing.sm,
    },
  
    amount: {
      fontFamily: theme.fonts.displayBold,
      fontSize: theme.fontSize.md,
  
      color: theme.colours.text,
    },
  
    arrow: {
      marginTop: 2,
  
      fontFamily: theme.fonts.displayBold,
      fontSize: theme.fontSize.sm,
  
      color: theme.colours.textMuted,
    },
  });