import { DayCard } from "@/components/card/DayCard";
import { AdventureSelector } from "@/components/homescreen/adventureSelector";
import { AppHeader } from "@/components/homescreen/AppHeader";
import { BottomNavigation } from "@/components/homescreen/BottomNavigation";
import { CheckInModal } from "@/components/homescreen/CheckInModal";
import { QuickActions } from "@/components/homescreen/QuickActions";
import { styles } from "@/styling/styles";
import { theme } from "@/styling/theme";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useHomeScreen } from "./useHomeScreen";

export default function HomeScreen() {
    const {
        activeTrips,
        selectedTrip,
        today,
        todayPois,
        currentDayNumber,
        totalDayNumber,
        bottomItems,
        checkInVisible,
        setCheckInVisible,
        selectTrip,
        openDayDetails,
        openCreateDay,
        openExpense,
        handleDiaryPress,
        handleCheckIn,
        handleUndoCheckIn,
    } = useHomeScreen();

    const hasMultipleTrips = activeTrips.length > 1;
    const hasActiveDay = Boolean(selectedTrip && today);

    return (
        <View style={styles.container}>
        <AppHeader
            appName="ELG WANDER"
            tripName={
            selectedTrip?.name ??
            "No active adventure"
            }
            currentDay={
            selectedTrip
                ? currentDayNumber ?? undefined
                : undefined
            }
            totalDays={
            selectedTrip
                ? totalDayNumber ?? "TO INFINITY!"
                : undefined
            }
        />

        {hasMultipleTrips && (
            <AdventureSelector
            trips={activeTrips}
            selectedTripId={
                selectedTrip?.id ?? null
            }
            onSelect={selectTrip}
            />
        )}

        <View style={styles.content}>
            {activeTrips.length === 0 && (
            <View style={emptyStateStyles.container}>
                <Text style={emptyStateStyles.title}>
                    NO ACTIVE ADVENTURE
                </Text>
                
                <Text style={emptyStateStyles.description}>
                    Start or join an adventure to begin your journey.
                </Text>
                
                <Pressable
                    style={emptyStateStyles.button}
                    onPress={() => router.push('/trip/trips')}
                >
                    <Text style={emptyStateStyles.buttonText}>
                    VIEW ADVENTURES
                    </Text>
                </Pressable>
                </View>
            )}

            {activeTrips.length > 0 &&
            !selectedTrip && (
                <Pressable
                style={
                    styles.chooseAdventureButton
                }
                onPress={() => {
                    // The selector above is the entry
                    // point for choosing an adventure.
                }}
                >
                <Text
                    style={
                    styles.chooseAdventureTitle
                    }
                >
                    SELECT YOUR ADVENTURE
                </Text>

                <Text
                    style={
                    styles.chooseAdventureText
                    }
                >
                    You have multiple active
                    adventures today.
                </Text>
                </Pressable>
            )}

            {selectedTrip && today && (
            <DayCard
                day={today}
                pois={todayPois}
                isToday
                onPress={() =>
                openDayDetails(today.id)
                }
            />
            )}

            {selectedTrip && !today && (
            <View style={styles.restDay}>
                <Text style={styles.restDayTitle}>
                REST DAY
                </Text>

                <Text style={styles.restDayText}>
                Nothing planned for today.
                </Text>
            </View>
            )}
        </View>

        {selectedTrip && (
            <QuickActions
                onLeftActionPress={
                hasActiveDay
                    ? () => setCheckInVisible(true)
                    : () => openCreateDay()
                }
                leftActionIcon={today ? 'check' : 'calendar'}
                leftActionLabel={today ? 'Check In' : 'Day Planner'}
                onMiddleActionPress={openExpense}
                middleActionIcon=""
                middleActionLabel="Add expense"
                onRightActionPress={handleDiaryPress}
                rightActionIcon="todo"
                rightActionLabel="Diary"
            />
        )}

        <BottomNavigation
            activeTab={today ? "day" : ""}
            items={bottomItems}
            onMorePress={() =>
            router.push("/more")
            }
        />

        {selectedTrip && today && (
            <CheckInModal
            visible={checkInVisible}
            pois={todayPois}
            onClose={() =>
                setCheckInVisible(false)
            }
            onCheckIn={handleCheckIn}
            onUndoCheckIn={handleUndoCheckIn}
            />
        )}
        </View>
    );
}

const emptyStateStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: theme.spacing.lg,
    },

    title: {
        ...theme.typography.display,
        fontSize: theme.fontSize.xl,
        color: theme.colours.text,
        textAlign: 'center',
        marginBottom: theme.spacing.sm,
    },

    description: {
        ...theme.typography.body,
        fontSize: theme.fontSize.md,
        color: theme.colours.textSecondary,
        textAlign: 'center',
        marginBottom: theme.spacing.xl,
    },

    button: {
        backgroundColor: theme.colours.accent,
        paddingHorizontal: theme.spacing.xl,
        paddingVertical: theme.spacing.md,
        borderRadius: theme.radius.md,
    },

    buttonText: {
        ...theme.typography.bodyMedium,
        fontSize: theme.fontSize.sm,
        color: theme.colours.background,
    },
});