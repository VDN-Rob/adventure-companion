import { InputField } from "@/components/forms/InputField";
import { SectionLabel } from "@/components/forms/SectionLabel";
import { Expense, ExpenseCategory } from "@/models/Expense";
import { useAppServices } from "@/utils/useRepository/useAppServiceProvider";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { theme } from "@/styling/theme";

const categories: {
  value: ExpenseCategory;
  label: string;
  icon: string;
}[] = [
  { value: "food", label: "Food", icon: "◆" },
  { value: "transport", label: "Transport", icon: "➜" },
  { value: "accommodation", label: "Stay", icon: "⌂" },
  { value: "gear", label: "Gear", icon: "◇" },
  { value: "other", label: "Other", icon: "●" },
];

export default function EditExpenseScreen() {
  const { expenseId } =
    useLocalSearchParams<{ expenseId: string }>();

  const { expenseServices } = useAppServices();

  const [expense, setExpense] = useState<Expense | null>(null);

  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("EUR");
  const [category, setCategory] =
    useState<ExpenseCategory>("food");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    async function loadExpense() {
      if (!expenseId) return;

      const result =
        await expenseServices.getExpense(expenseId);

      if (!result) return;

      setExpense(result);

      setAmount(String(result.amount));
      setCurrency(result.currency);
      setCategory(result.category);
      setDescription(result.description ?? "");
      setDate(result.date);
    }

    loadExpense();
  }, [expenseId]);

  async function handleSave() {
    if (!expense) return;

    const numericAmount = Number(amount);

    if (
      !amount ||
      Number.isNaN(numericAmount) ||
      numericAmount <= 0
    ) {
      Alert.alert(
        "Invalid amount",
        "Please enter an amount greater than zero."
      );
      return;
    }

    if (!currency.trim()) {
      Alert.alert(
        "Missing currency",
        "Please enter a currency."
      );
      return;
    }

    if (!date.trim()) {
      Alert.alert(
        "Missing date",
        "Please enter a date."
      );
      return;
    }

    const updatedExpense: Expense = {
      ...expense,

      amount: numericAmount,
      currency: currency.trim().toUpperCase(),

      category,
      description: description.trim() || null,

      date,
    };

    try {
      await expenseServices.updateExpense(updatedExpense);
      router.back();
    } catch {
      Alert.alert(
        "Could not save expense",
        "Something went wrong while saving the expense."
      );
    }
  }

  function handleDelete() {
    Alert.alert(
      "Delete expense?",
      "This expense will be permanently removed.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: deleteExpense,
        },
      ]
    );
  }

  async function deleteExpense() {
    if (!expenseId) return;

    try {
      await expenseServices.deleteExpense(expenseId);
      router.back();
    } catch {
      Alert.alert(
        "Could not delete expense",
        "Something went wrong while deleting the expense."
      );
    }
  }

  if (!expense) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loading}>
          LOADING EXPENSE...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>EDIT EXPENSE</Text>

        <SectionLabel title="AMOUNT" />

        <View style={styles.amountRow}>
          <View style={styles.amountContainer}>
            <InputField
              label="Amount"
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              keyboardType="decimal-pad"
            />
          </View>

          <View style={styles.currencyContainer}>
            <InputField
              label="Currency"
              value={currency}
              onChangeText={setCurrency}
              placeholder="EUR"
            />
          </View>
        </View>

        <SectionLabel title="CATEGORY" />

        <View style={styles.categoryGrid}>
          {categories.map((item) => {
            const selected = category === item.value;

            return (
              <Pressable
                key={item.value}
                onPress={() => setCategory(item.value)}
                style={[
                  styles.category,
                  selected && styles.categorySelected,
                ]}
              >
                <Text
                  style={[
                    styles.categoryIcon,
                    selected && styles.categorySelectedText,
                  ]}
                >
                  {item.icon}
                </Text>

                <Text
                  style={[
                    styles.categoryText,
                    selected && styles.categorySelectedText,
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <SectionLabel title="DETAILS" />

        <InputField
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="What did you spend it on?"
        />

        <InputField
          label="Date"
          value={date}
          onChangeText={setDate}
          placeholder="2026-08-29"
        />

        <Pressable
          onPress={handleSave}
          style={({ pressed }) => [
            styles.saveButton,
            pressed && styles.saveButtonPressed,
          ]}
        >
          <Text style={styles.saveText}>
            SAVE CHANGES
          </Text>
        </Pressable>

        <Pressable
          onPress={handleDelete}
          style={({ pressed }) => [
            styles.deleteButton,
            pressed && styles.deleteButtonPressed,
          ]}
        >
          <Text style={styles.deleteText}>
            DELETE EXPENSE
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colours.background,
  },

  content: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },

  title: {
    marginBottom: theme.spacing.lg,

    fontFamily: theme.fonts.displayBold,
    fontSize: theme.fontSize.xl,
    letterSpacing: 2,

    color: theme.colours.text,
  },

  loading: {
    padding: theme.spacing.md,

    fontFamily: theme.fonts.displayBold,
    fontSize: theme.fontSize.md,
    letterSpacing: 2,

    color: theme.colours.textMuted,
  },

  amountRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },

  amountContainer: {
    flex: 1,
  },

  currencyContainer: {
    width: 100,
  },

  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,

    marginBottom: theme.spacing.lg,
  },

  category: {
    width: "30%",
    minHeight: 76,

    alignItems: "center",
    justifyContent: "center",

    padding: theme.spacing.sm,

    backgroundColor: theme.colours.surface,

    borderWidth: 1,
    borderColor: theme.colours.border,
    borderRadius: theme.radius.md,
  },

  categorySelected: {
    backgroundColor: theme.colours.surfaceRaised,
    borderColor: theme.colours.accent,
  },

  categoryIcon: {
    marginBottom: 4,

    fontFamily: theme.fonts.displayBold,
    fontSize: theme.fontSize.lg,

    color: theme.colours.textMuted,
  },

  categoryText: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: theme.fontSize.xs,
    letterSpacing: 1,

    color: theme.colours.textSecondary,
  },

  categorySelectedText: {
    color: theme.colours.accent,
  },

  saveButton: {
    minHeight: 54,

    alignItems: "center",
    justifyContent: "center",

    marginTop: theme.spacing.lg,

    backgroundColor: theme.colours.accent,

    borderRadius: theme.radius.md,
  },

  saveButtonPressed: {
    opacity: 0.75,
    transform: [{ translateY: 2 }],
  },

  saveText: {
    fontFamily: theme.fonts.displayBold,
    fontSize: theme.fontSize.md,
    letterSpacing: 2,

    color: theme.colours.background,
  },

  deleteButton: {
    minHeight: 48,

    alignItems: "center",
    justifyContent: "center",

    marginTop: theme.spacing.md,

    backgroundColor: "transparent",

    borderWidth: 1,
    borderColor: theme.colours.border,
    borderRadius: theme.radius.md,
  },

  deleteButtonPressed: {
    opacity: 0.6,
    borderColor: theme.colours.accent,
  },

  deleteText: {
    fontFamily: theme.fonts.displayBold,
    fontSize: theme.fontSize.sm,
    letterSpacing: 1.5,

    color: theme.colours.textMuted,
  },
});