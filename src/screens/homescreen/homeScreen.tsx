import { DayCard } from "@/components/card/DayCard";
import { Selector } from "@/components/forms/Selector";
import { AppHeader } from "@/components/homescreen/AppHeader";
import { BottomNavigation } from "@/components/homescreen/BottomNavigation";
import { CheckInModal } from "@/components/homescreen/CheckInModal";
import { QuickActions } from "@/components/homescreen/QuickActions";
import { getTranslations } from "@/i18n";
import { useAppSettings } from "@/providers/AppSettingsProvider";
import { styles } from "@/styling/styles";
import { theme } from "@/styling/theme";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
        adventureOptions,
        selectedTripId,
        setSelectedTripId,
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

    const { settings } = useAppSettings();
    const t = getTranslations(settings.language)

    return (
        <SafeAreaView style={styles.container}>
        <AppHeader
            appName={t.common.appName}
            tripName={
            selectedTrip?.name ??
            t.homeScreen.noAdventure
            }
            currentDay={
            selectedTrip
                ? currentDayNumber ?? undefined
                : undefined
            }
            totalDays={
            selectedTrip
                ? totalDayNumber ?? t.homeScreen.infinity.toUpperCase()
                : undefined
            }
        />

        {hasMultipleTrips && (
            <Selector
                label={t.homeScreen.currentAdventure.toUpperCase()}
                placeholder={t.homeScreen.selectAdventure.toUpperCase()}
                options={adventureOptions}
                selectedValue={selectedTripId}
                onSelect={setSelectedTripId}
            />
        )}

        <View style={styles.content}>
            {activeTrips.length === 0 && (
            <View style={emptyStateStyles.container}>
                <Text style={emptyStateStyles.title}>
                    {t.homeScreen.noAdventure}
                </Text>
                
                <Text style={emptyStateStyles.description}>
                    {t.homeScreen.noAdventureDesc}
                </Text>
                
                <Pressable
                    style={emptyStateStyles.button}
                    onPress={() => router.push('/trip/trips')}
                >
                    <Text style={emptyStateStyles.buttonText}>
                        {t.homeScreen.viewAdventures.toUpperCase()}
                    </Text>
                </Pressable>
                </View>
            )}

            {activeTrips.length > 0 &&
            !selectedTrip && (
                <Pressable
                style={styles.chooseAdventureButton}
                onPress={() => {
                    // The selector above is the entry
                    // point for choosing an adventure.
                }}
                >
                <Text style={styles.chooseAdventureTitle}>
                    {t.homeScreen.selectAdventure}
                </Text>

                <Text style={styles.chooseAdventureText}>
                    {t.homeScreen.multAdventuresDesc}
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
                    {t.homeScreen.restDayTitle.toUpperCase()}
                </Text>

                <Text style={styles.restDayText}>
                    {t.homeScreen.restDayDesc}
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
                leftActionIcon={today ? '◇' : '◇'}
                leftActionLabel={today ? t.homeScreen.checkIn : t.homeScreen.dayPlanner}
                onMiddleActionPress={openExpense}
                middleActionIcon="+"
                middleActionLabel={t.homeScreen.addExpense}
                onRightActionPress={handleDiaryPress}
                rightActionIcon="✎"
                rightActionLabel={t.common.diary}
            />
        )}

        <BottomNavigation
            activeTab={today ? t.common.day : ""}
            items={bottomItems}
            onMorePress={() => router.push("/more")}
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
        </SafeAreaView>
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