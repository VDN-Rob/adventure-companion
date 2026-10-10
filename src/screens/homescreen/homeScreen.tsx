import { DayCard } from "@/components/card/DayCard";
import { Selector } from "@/components/forms/Selector";
import { AppHeader } from "@/components/UI/AppHeader";
import { getTranslations } from "@/i18n";
import { useAppSettings } from "@/providers/AppSettingsProvider";
import { BottomNavigation } from "@/screens/homescreen/components/BottomNavigation";
import { CheckInModal } from "@/screens/homescreen/components/CheckInModal";
import { QuickActions } from "@/screens/homescreen/components/QuickActions";
import { styles } from "@/styling/styles";
import { textStyles } from "@/styling/textStyles";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
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
        <SafeAreaView style={styles.mainContainer}>
            <AppHeader
                appName={t.common.appName}
                tripName={selectedTrip?.name ?? t.homeScreen.noAdventure}
                currentDay={selectedTrip ? currentDayNumber ?? undefined : undefined}
                totalDays={selectedTrip ? totalDayNumber ?? t.homeScreen.infinity.toUpperCase() : undefined}
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
                    <View style={styles.centeringContainer}>
                        <Text style={textStyles.subTitle}>
                            {t.homeScreen.noAdventure}
                        </Text>
                        
                        <Text style={textStyles.normalText}>
                            {t.homeScreen.noAdventureDesc}
                        </Text>
                        
                        <View style={[styles.smallSpacing]}>
                            <Pressable
                                style={styles.yellowButtonContainer}
                                onPress={() => router.push('/trip/createTrip')}
                            >
                                <Text style={styles.yellowButtonText}>
                                    {t.homeScreen.createAdventure}
                                </Text>
                            </Pressable>
                            <Pressable
                                style={styles.yellowButtonContainer}
                                onPress={() => router.push('/trip/trips')}
                            >
                                <Text style={styles.yellowButtonText}>
                                    {t.homeScreen.continuePlanning}
                                </Text>
                            </Pressable>
                        </View>
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
                        onPress={() => openDayDetails(today.id)}
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
                    rightActionLabel={t.diary.diary}
                />
            )}

            <BottomNavigation
                activeTab={today ? t.day.day : ""}
                items={bottomItems}
                onMorePress={() => router.push("/more")}
            />

            {selectedTrip && today && (
                <CheckInModal
                    visible={checkInVisible}
                    pois={todayPois}
                    onClose={() => setCheckInVisible(false)}
                    onCheckIn={handleCheckIn}
                    onUndoCheckIn={handleUndoCheckIn}
                />
            )}
        </SafeAreaView>
    );
}