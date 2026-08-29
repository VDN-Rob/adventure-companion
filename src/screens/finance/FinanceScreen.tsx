import { ExpenseCard } from "@/components/card/ExpenseCard";
import { Trip } from "@/models/Trip";
import { useAppServices } from "@/utils/useAppServiceProvider";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { theme } from "@/styling/theme";

export default function FinanceScreen() {
  const {
    tripServices,
    expenseServices,
  } = useAppServices();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [statistics, setStatistics] = useState<{
    total: number;
    byCategory: Record<string, number>;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      async function loadData() {
        try {
          setIsLoading(true);

          // Replace this with however you currently
          // determine the active trip.
        //   const activeTrip = await tripServices.getActiveTrip();
        const activeTrip: Trip = {
            id: "day-01",
            name: "Day 01",
            startDate: "2026:05:11",
            endDate: null,
            description: null,
            budget: null,
            budgetCurrency: "EUR"
        }

          if (!activeTrip) {
            setTrip(null);
            setExpenses([]);
            setStatistics(null);
            return;
          }

          setTrip(activeTrip);

          const tripExpenses =
            await expenseServices.getExpensesForTrip(
              activeTrip.id
            );

          const tripStatistics =
            await expenseServices.getTripStatistics(
              activeTrip.id
            );

          setExpenses(tripExpenses);
          setStatistics(tripStatistics);
        } finally {
          setIsLoading(false);
        }
      }

      loadData();
    }, [])
  );

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!trip) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>
            NO ACTIVE ADVENTURE
          </Text>

          <Text style={styles.emptyText}>
            Start an adventure to begin tracking expenses.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const totalSpent = statistics?.total ?? 0;

  const budget = trip.budget;
  const remaining =
    budget === null
      ? null
      : budget - totalSpent;

  const percentage =
    budget && budget > 0
      ? Math.min(totalSpent / budget, 1)
      : 0;

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={expenses}
        keyExtractor={(expense) => expense.id}
        renderItem={({ item }) => (
          <ExpenseCard
            expense={item}
            onPress={() => {
              router.push({
                pathname: "/finance/editExpense",
                params: {
                  expenseId: item.id,
                },
              });
            }}
          />
        )}
        ItemSeparatorComponent={() => (
          <View style={styles.separator} />
        )}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <Text style={styles.eyebrow}>
                ADVENTURE FINANCE
              </Text>

              <Text style={styles.title}>
                FINANCE
              </Text>

              <Text style={styles.tripName}>
                {trip.name}
              </Text>
            </View>

            <View style={styles.budgetCard}>
              <Text style={styles.sectionLabel}>
                TOTAL SPENT
              </Text>

              <Text style={styles.total}>
                {formatCurrency(
                  totalSpent,
                  trip.budgetCurrency
                )}
              </Text>

              {budget !== null ? (
                <>
                  <View style={styles.budgetInfo}>
                    <Text style={styles.budgetLabel}>
                      BUDGET
                    </Text>

                    <Text style={styles.budgetAmount}>
                      {formatCurrency(
                        budget,
                        trip.budgetCurrency
                      )}
                    </Text>
                  </View>

                  <View style={styles.progressTrack}>
                    <View
                      style={[
                        styles.progress,
                        {
                          width: `${percentage * 100}%`,
                        },
                      ]}
                    />
                  </View>

                  <View style={styles.remainingRow}>
                    <Text style={styles.remainingLabel}>
                      {remaining !== null && remaining >= 0
                        ? "REMAINING"
                        : "OVER BUDGET"}
                    </Text>

                    <Text style={styles.remaining}>
                      {formatCurrency(
                        Math.abs(remaining ?? 0),
                        trip.budgetCurrency
                      )}
                    </Text>
                  </View>
                </>
              ) : (
                <Text style={styles.noBudget}>
                  NO BUDGET SET
                </Text>
              )}
            </View>

            <CategoryBreakdown
              statistics={statistics?.byCategory ?? {}}
              currency={trip.budgetCurrency}
            />

            <View style={styles.expensesHeader}>
              <View>
                <Text style={styles.sectionLabel}>
                  ADVENTURE LOG
                </Text>

                <Text style={styles.expensesTitle}>
                  RECENT EXPENSES
                </Text>
              </View>

              <Text style={styles.expenseCount}>
                {expenses.length}
              </Text>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyExpenses}>
            <Text style={styles.emptyExpensesTitle}>
              NO EXPENSES
            </Text>

            <Text style={styles.emptyText}>
              Your adventure spending will appear here.
            </Text>
          </View>
        }
      />

      <Pressable
        onPress={() => {
          router.push({
            pathname: "/finance/createExpense",
            params: {
              tripId: trip.id,
            },
          });
        }}
        style={({ pressed }) => [
          styles.addButton,
          pressed && styles.addButtonPressed,
        ]}
      >
        <Text style={styles.addButtonText}>
          + ADD EXPENSE
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}

type CategoryBreakdownProps = {
    statistics: Record<string, number>;
    currency: string;
  };
  
  function CategoryBreakdown({
    statistics,
    currency,
  }: CategoryBreakdownProps) {
    const entries = Object.entries(statistics);
  
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
              maximum > 0
                ? amount / maximum
                : 0;
  
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
                    {formatCurrency(
                      amount,
                      currency
                    )}
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

  function formatCurrency(
    amount: number,
    currency: string
  ) {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
    }).format(amount);
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colours.background,
    },
  
    loading: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
  
      backgroundColor: theme.colours.background,
    },
  
    content: {
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.md,
      paddingBottom: 110,
    },
  
    header: {
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
  
    tripName: {
      marginTop: 2,
  
      fontFamily: theme.fonts.body,
      fontSize: theme.fontSize.sm,
  
      color: theme.colours.textSecondary,
    },
  
    budgetCard: {
      padding: theme.spacing.md,
  
      backgroundColor: theme.colours.surface,
  
      borderWidth: 1,
      borderColor: theme.colours.border,
  
      borderRadius: theme.radius.lg,
    },
  
    sectionLabel: {
      fontFamily: theme.fonts.bodyBold,
      fontSize: theme.fontSize.xs,
  
      color: theme.colours.accent,
      letterSpacing: 1.5,
    },
  
    total: {
      marginTop: 2,
  
      fontFamily: theme.fonts.displayBold,
      fontSize: 36,
  
      color: theme.colours.text,
    },
  
    budgetInfo: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
  
      marginTop: theme.spacing.md,
    },
  
    budgetLabel: {
      fontFamily: theme.fonts.bodyBold,
      fontSize: theme.fontSize.xs,
  
      color: theme.colours.textMuted,
      letterSpacing: 1,
    },
  
    budgetAmount: {
      fontFamily: theme.fonts.bodyBold,
      fontSize: theme.fontSize.sm,
  
      color: theme.colours.textSecondary,
    },
  
    progressTrack: {
      height: 10,
  
      marginTop: theme.spacing.sm,
  
      backgroundColor: theme.colours.background,
  
      borderWidth: 1,
      borderColor: theme.colours.border,
  
      overflow: "hidden",
    },
  
    progress: {
      height: "100%",
      backgroundColor: theme.colours.accent,
    },
  
    remainingRow: {
      flexDirection: "row",
      justifyContent: "space-between",
  
      marginTop: theme.spacing.sm,
    },
  
    remainingLabel: {
      fontFamily: theme.fonts.bodyBold,
      fontSize: theme.fontSize.xs,
  
      color: theme.colours.textMuted,
      letterSpacing: 1,
    },
  
    remaining: {
      fontFamily: theme.fonts.displayBold,
      fontSize: theme.fontSize.sm,
  
      color: theme.colours.text,
    },
  
    noBudget: {
      marginTop: theme.spacing.sm,
  
      fontFamily: theme.fonts.bodyBold,
      fontSize: theme.fontSize.xs,
  
      color: theme.colours.textMuted,
      letterSpacing: 1,
    },
  
    categorySection: {
      marginTop: theme.spacing.lg,
    },
  
    categoryTitle: {
      marginTop: 2,
  
      fontFamily: theme.fonts.displayBold,
      fontSize: theme.fontSize.lg,
  
      color: theme.colours.text,
    },
  
    categories: {
      marginTop: theme.spacing.md,
  
      gap: theme.spacing.md,
    },
  
    category: {},
  
    categoryHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
  
      marginBottom: theme.spacing.xs,
    },
  
    categoryName: {
      fontFamily: theme.fonts.bodyBold,
      fontSize: theme.fontSize.xs,
  
      color: theme.colours.textSecondary,
  
      letterSpacing: 1,
    },
  
    categoryAmount: {
      fontFamily: theme.fonts.bodyBold,
      fontSize: theme.fontSize.xs,
  
      color: theme.colours.text,
    },
  
    categoryTrack: {
      height: 7,
  
      backgroundColor: theme.colours.surface,
  
      borderWidth: 1,
      borderColor: theme.colours.border,
  
      overflow: "hidden",
    },
  
    categoryBar: {
      height: "100%",
      backgroundColor: theme.colours.accent,
    },
  
    expensesHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
  
      marginTop: theme.spacing.xl,
      marginBottom: theme.spacing.md,
    },
  
    expensesTitle: {
      marginTop: 2,
  
      fontFamily: theme.fonts.displayBold,
      fontSize: theme.fontSize.lg,
  
      color: theme.colours.text,
    },
  
    expenseCount: {
      fontFamily: theme.fonts.displayBold,
      fontSize: theme.fontSize.lg,
  
      color: theme.colours.textMuted,
    },
  
    separator: {
      height: theme.spacing.sm,
    },
  
    empty: {
      flex: 1,
  
      alignItems: "center",
      justifyContent: "center",
  
      padding: theme.spacing.xl,
    },
  
    emptyTitle: {
      fontFamily: theme.fonts.displayBold,
      fontSize: theme.fontSize.lg,
  
      color: theme.colours.text,
      letterSpacing: 1,
    },
  
    emptyText: {
      marginTop: theme.spacing.sm,
  
      fontFamily: theme.fonts.body,
      fontSize: theme.fontSize.sm,
  
      color: theme.colours.textMuted,
  
      textAlign: "center",
    },
  
    emptyExpenses: {
      paddingVertical: theme.spacing.xl,
  
      alignItems: "center",
    },
  
    emptyExpensesTitle: {
      fontFamily: theme.fonts.displayBold,
      fontSize: theme.fontSize.md,
  
      color: theme.colours.text,
      letterSpacing: 1,
    },
  
    addButton: {
      position: "absolute",
  
      left: theme.spacing.md,
      right: theme.spacing.md,
      bottom: theme.spacing.md,
  
      height: 52,
  
      alignItems: "center",
      justifyContent: "center",
  
      backgroundColor: theme.colours.accent,
  
      borderRadius: theme.radius.md,
    },
  
    addButtonPressed: {
      transform: [
        {
          translateY: 2,
        },
      ],
  
      opacity: 0.85,
    },
  
    addButtonText: {
      fontFamily: theme.fonts.displayBold,
      fontSize: theme.fontSize.md,
  
      color: theme.colours.background,
  
      letterSpacing: 1.5,
    },
  });