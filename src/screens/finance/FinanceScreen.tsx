import { ExpenseCard } from "@/components/card/ExpenseCard";
import { CategoryBreakdown } from "@/components/finance/CategoryBreakdown";
import { FinanceSummary } from "@/components/finance/FinanceSummary";
import {
  FinancePeriod,
  PeriodSelector,
} from "@/components/finance/PeriodSelector";
import { SpendingOverview } from "@/components/finance/SpendingOverview";
import { TripSelector } from "@/components/finance/TripSelector";
import { appSettings } from "@/config/appSetting";
import { Expense } from "@/models/Expense";
import { Trip } from "@/models/Trip";
import {
  ExpenseFilter,
  ExpenseStatistics,
} from "@/services/ExpenseService";
import { theme } from "@/styling/theme";
import { getDateDaysAgo, getElapsedTripDays, getTodayDate, getTripDuration } from "@/utils/date";
import { useAppServices } from "@/utils/useRepository/useAppServiceProvider";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from "react-native";

export default function FinanceScreen() {
  const {
    tripServices,
    expenseServices,
  } = useAppServices();

  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTripId, setSelectedTripId] =
    useState<string | null>(null);

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [statistics, setStatistics] =
    useState<ExpenseStatistics | null>(null);

  const [period, setPeriod] =
    useState<FinancePeriod>("30_DAYS");

  const [isLoading, setIsLoading] =
    useState(true);

  const [selectorVisible, setSelectorVisible] =
    useState(false);

  const selectedTrip = useMemo(
    () =>
      trips.find(
        (trip) => trip.id === selectedTripId
      ) ?? null,
    [trips, selectedTripId]
  );

  const financeCurrency =
    selectedTrip?.budgetCurrency ??
    appSettings.currency;

  useFocusEffect(
    useCallback(() => {
      let active = true;

      async function loadTrips() {
        try {
          const allTrips =
            await tripServices.getAllTrips();

          if (!active) {
            return;
          }

          setTrips(allTrips);
        } catch (error) {
          console.error(
            "Failed to load trips:",
            error
          );
        }
      }

      loadTrips();

      return () => {
        active = false;
      };
    }, [tripServices])
  );

  useFocusEffect(
    useCallback(() => {
      let active = true;

      async function loadFinanceData() {
        try {
          setIsLoading(true);

          const filter =
            createFinanceFilter(
              selectedTrip,
              period
            );

          const [
            loadedExpenses,
            loadedStatistics,
          ] = await Promise.all([
            expenseServices.getExpenses(filter),
            expenseServices.getExpenseStatistics(
              filter,
              financeCurrency
            ),
          ]);

          if (!active) {
            return;
          }

          setExpenses(loadedExpenses);
          setStatistics(loadedStatistics);
        } catch (error) {
          console.error(
            "Failed to load finance data:",
            error
          );

          if (!active) {
            return;
          }

          setExpenses([]);
          setStatistics(null);
        } finally {
          if (active) {
            setIsLoading(false);
          }
        }
      }

      loadFinanceData();

      return () => {
        active = false;
      };
    }, [
      expenseServices,
      selectedTrip,
      period,
      financeCurrency,
    ])
  );

  const totalSpent =
    statistics?.total ?? 0;

  const tripBudget =
    selectedTrip?.budget ?? null;

  const tripDuration = selectedTrip
    ? getTripDuration(selectedTrip)
    : null;

  const elapsedTripDays = selectedTrip
    ? getElapsedTripDays(selectedTrip)
    : null;

  const dailySpending =
    selectedTrip &&
    elapsedTripDays !== null &&
    elapsedTripDays > 0
      ? totalSpent / elapsedTripDays
      : null;

  const dailyBudget =
    selectedTrip &&
    tripBudget !== null &&
    tripDuration !== null &&
    tripDuration > 0
      ? tripBudget / tripDuration
      : null;

  const remaining =
    tripBudget !== null
      ? tripBudget - totalSpent
      : null;

  const budgetPercentage =
    tripBudget !== null &&
    tripBudget > 0
      ? Math.min(totalSpent / tripBudget, 1)
      : 0;

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator />
      </View>
    );
  }

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
                pathname:
                  "/finance/editExpense",
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
        contentContainerStyle={
          styles.content
        }
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              <Text style={styles.eyebrow}>
                ADVENTURE FINANCE
              </Text>

              <Text style={styles.title}>
                FINANCE
              </Text>
            </View>

            <TripSelector
              trips={trips}
              selectedTrip={selectedTrip}
              visible={selectorVisible}
              onOpen={() =>
                setSelectorVisible(true)
              }
              onClose={() =>
                setSelectorVisible(false)
              }
              onSelect={(tripId) => {
                setSelectedTripId(tripId);
                setSelectorVisible(false);
              }}
            />

            {!selectedTrip && (
              <PeriodSelector
                period={period}
                onChange={setPeriod}
              />
            )}

            <FinanceSummary
              totalSpent={totalSpent}
              currency={financeCurrency}
              selectedTrip={selectedTrip}
              dailySpending={dailySpending}
              dailyBudget={dailyBudget}
              remaining={remaining}
              budgetPercentage={
                budgetPercentage
              }
            />

            {statistics &&
              statistics.conversionPendingCount >
                0 && (
                <View
                  style={
                    styles.conversionNotice
                  }
                >
                  <Text
                    style={
                      styles.conversionNoticeText
                    }
                  >
                    {
                      statistics.conversionPendingCount
                    }{" "}
                    expense
                    {statistics.conversionPendingCount ===
                    1
                      ? ""
                      : "s"} awaiting exchange
                    rate
                    {statistics.conversionPendingCount ===
                    1
                      ? ""
                      : "s"}
                    .
                  </Text>
                </View>
              )}

            <SpendingOverview
              statistics={statistics}
            />

            <CategoryBreakdown
              statistics={
                statistics?.byCategory ?? {}
              }
              currency={financeCurrency}
            />

            <View
              style={styles.expensesHeader}
            >
              <View>
                <Text
                  style={
                    styles.sectionLabel
                  }
                >
                  ADVENTURE LOG
                </Text>

                <Text
                  style={
                    styles.expensesTitle
                  }
                >
                  RECENT EXPENSES
                </Text>
              </View>

              <Text
                style={styles.expenseCount}
              >
                {expenses.length}
              </Text>
            </View>
          </>
        }
        ListEmptyComponent={
          <View
            style={styles.emptyExpenses}
          >
            <Text
              style={
                styles.emptyExpensesTitle
              }
            >
              NO EXPENSES
            </Text>

            <Text style={styles.emptyText}>
              Your adventure spending will
              appear here.
            </Text>
          </View>
        }
      />

      <Pressable
        onPress={() => {
          router.push({
            pathname:
              "/finance/createExpense",
            params: selectedTrip
              ? {
                  tripId: selectedTrip.id,
                }
              : undefined,
          });
        }}
        style={({ pressed }) => [
          styles.addButton,
          pressed &&
            styles.addButtonPressed,
        ]}
      >
        <Text
          style={styles.addButtonText}
        >
          + ADD EXPENSE
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}

function createFinanceFilter(
  trip: Trip | null,
  period: FinancePeriod
): ExpenseFilter {
  if (trip) {
    return {
      tripId: trip.id,
      startDate: trip.startDate,
      endDate:
        trip.endDate ?? getTodayDate(),
    };
  }

  const today = getTodayDate();

  if (period === "30_DAYS") {
    return {
      startDate: getDateDaysAgo(
        today,
        30
      ),
      endDate: today,
    };
  }

  if (period === "YEAR") {
    return {
      startDate: getDateDaysAgo(
        today,
        365
      ),
      endDate: today,
    };
  }

  return {};
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
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxxl + 72,
  },

  header: {
    marginBottom: theme.spacing.xl,
  },

  eyebrow: {
    marginBottom: theme.spacing.xs,
    color: theme.colours.accent,
    fontFamily: theme.fonts.bodyBold,
    fontSize: theme.fontSize.xs,
    letterSpacing: 1.5,
  },

  title: {
    color: theme.colours.text,
    fontFamily: theme.fonts.displayBold,
    fontSize: theme.fontSize.xxxl,
    letterSpacing: 1,
  },

  separator: {
    height: theme.spacing.sm,
  },

  expensesHeader: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginTop: theme.spacing.xxl,
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: theme.borders.thin,
    borderBottomColor: theme.colours.border,
  },

  sectionLabel: {
    marginBottom: theme.spacing.xs,
    color: theme.colours.accent,
    fontFamily: theme.fonts.bodyBold,
    fontSize: theme.fontSize.xs,
    letterSpacing: 1.2,
  },

  expensesTitle: {
    color: theme.colours.text,
    fontFamily: theme.fonts.displayBold,
    fontSize: theme.fontSize.xl,
    letterSpacing: 0.5,
  },

  expenseCount: {
    color: theme.colours.textSecondary,
    fontFamily: theme.fonts.displayMedium,
    fontSize: theme.fontSize.lg,
  },

  emptyExpenses: {
    alignItems: "center",
    paddingVertical: theme.spacing.xxxl,
    paddingHorizontal: theme.spacing.xl,
  },

  emptyExpensesTitle: {
    marginBottom: theme.spacing.sm,
    color: theme.colours.text,
    fontFamily: theme.fonts.displayBold,
    fontSize: theme.fontSize.xl,
  },

  emptyText: {
    color: theme.colours.textSecondary,
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSize.md,
    textAlign: "center",
  },

  conversionNotice: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colours.surface,
    borderWidth: theme.borders.thin,
    borderColor: theme.colours.border,
    borderRadius: theme.radius.md,
  },

  conversionNoticeText: {
    color: theme.colours.textSecondary,
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSize.sm,
    lineHeight: 18,
  },

  addButton: {
    position: "absolute",
    right: theme.spacing.lg,
    bottom: theme.spacing.lg,
    left: theme.spacing.lg,

    minHeight: 52,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: theme.colours.accent,
    borderRadius: theme.radius.md,
  },

  addButtonPressed: {
    backgroundColor: theme.colours.accentBright,
  },

  addButtonText: {
    color: theme.colours.background,
    fontFamily: theme.fonts.bodyBold,
    fontSize: theme.fontSize.md,
    letterSpacing: 1,
  },
});