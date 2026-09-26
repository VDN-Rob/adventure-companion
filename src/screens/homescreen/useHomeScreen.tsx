import { NavigationItem } from "@/components/homescreen/BottomNavigation";
import { Day } from "@/models/Day";
import { POI } from "@/models/POI";
import { Trip } from "@/models/Trip";
import { getDayNumber, getTodayDate } from "@/utils/date";
import { useAppServices } from "@/utils/useRepository/useAppServiceProvider";
import { router, useFocusEffect } from "expo-router";
import {
    useCallback,
    useEffect,
    useState,
} from "react";
import { Alert } from "react-native";

export function useHomeScreen() {
    const {
        tripServices,
        dayServices,
        poiServices,
        diaryEntryServices,
    } = useAppServices();

    const [activeTrips, setActiveTrips] = useState<Trip[]>([]);
    const [selectedTripId, setSelectedTripId] =
        useState<string | null>(null);

    const [today, setToday] = useState<Day | null>(null);
    const [todayPois, setTodayPois] = useState<POI[]>([]);

    const [currentDayNumber, setCurrentDayNumber] =
        useState<number | null>(null);

    const [totalDayNumber, setTotalDayNumber] =
        useState<number | null>(null);

    const [bottomItems, setBottomItems] =
        useState<NavigationItem[]>([]);

    const [checkInVisible, setCheckInVisible] =
        useState(false);

    const selectedTrip =
        activeTrips.find(
        (trip) => trip.id === selectedTripId
        ) ?? null;

    useFocusEffect(
        useCallback(() => {
        let active = true;

        async function loadActiveTrips() {
            const todayDate = getTodayDate();

            const trips =
            await tripServices.getTripsForDate(todayDate);

            if (!active) {
            return;
            }

            setActiveTrips(trips);

            if (trips.length === 0) {
            setSelectedTripId(null);
            return;
            }

            if (trips.length === 1) {
            setSelectedTripId(trips[0].id);
            return;
            }

            if (
            selectedTripId &&
            trips.some(
                (trip) => trip.id === selectedTripId
            )
            ) {
            return;
            }

            setSelectedTripId(null);
        }

        loadActiveTrips();

        return () => {
            active = false;
        };
        }, [tripServices, selectedTripId])
    );

    useEffect(() => {
        let active = true;

        async function loadSelectedTripData() {
        if (!selectedTrip) {
            setToday(null);
            setTodayPois([]);
            setCurrentDayNumber(null);
            setTotalDayNumber(null);

            setBottomItems([
            {
                key: "adventures",
                icon: "◇",
                label: "Adventures",
                onPress: () =>
                router.push("/trip/trips"),
            },
            ]);

            return;
        }

        const todayDate = getTodayDate();

        const day =
            await dayServices.getDayByTripAndDate(
            selectedTrip.id,
            todayDate
            );

        if (!active) {
            return;
        }

        setToday(day);

        if (day) {
            const pois =
            await poiServices.getPOIsForDay(day.id);

            if (!active) {
            return;
            }

            setTodayPois(pois);
        } else {
            setTodayPois([]);
        }

        setCurrentDayNumber(
            getDayNumber(
            selectedTrip.startDate,
            todayDate
            )
        );

        setTotalDayNumber(
            selectedTrip.endDate === null
            ? null
            : getDayNumber(
                selectedTrip.startDate,
                selectedTrip.endDate
                )
        );

        const items: NavigationItem[] = [];

        if (day) {
            items.push({
            key: "day",
            icon: "●",
            label: "Day",
            onPress: () =>
                openDayDetails(day.id),
            });
        }

        items.push({
            key: "map",
            icon: "◇",
            label: "Map",
            onPress: () => router.push("/map/map"),
        });

        setBottomItems(items);
        }

        loadSelectedTripData();

        return () => {
        active = false;
        };
    }, [
        selectedTrip,
        dayServices,
        poiServices,
    ]);

    const selectTrip = useCallback(
        (tripId: string) => {
        setSelectedTripId(tripId);
        },
        []
    );

    const openDayDetails = useCallback(
        (dayId: string) => {
        router.push({
            pathname: "/day/detailsDay",
            params: { dayId },
        });
        },
        []
    );

    const openExpense = useCallback(() => {
        if (!selectedTrip || !today) {
        return;
        }

        router.push({
        pathname: "/finance/createExpense",
        params: {
            tripId: selectedTrip.id,
            dayId: today.id,
        },
        });
    }, [selectedTrip, today]);

    const handleDiaryPress = useCallback(
        async () => {
        if (!selectedTripId) {
            router.push("/diary/diary");
            return;
        }

        const todayDate = getTodayDate();

        try {
            const todayDay =
            await dayServices.getDayByTripAndDate(
                selectedTripId,
                todayDate
            );

            if (!todayDay) {
            router.push({
                pathname:
                "/diary/createDiaryEntry",
                params: {
                tripId: selectedTripId,
                date: todayDate,
                },
            });

            return;
            }

            const todayEntry =
            await diaryEntryServices
                .getDiaryEntryForDay(todayDay.id);

            if (!todayEntry) {
            router.push({
                pathname:
                "/diary/createDiaryEntry",
                params: {
                tripId: selectedTripId,
                date: todayDate,
                },
            });

            return;
            }

            router.push({
            pathname: "/diary/editDiaryEntry",
            params: {
                diaryEntryId: todayEntry.id,
            },
            });
        } catch (error) {
            console.error(
            "Failed to open today's diary entry:",
            error
            );

            Alert.alert(
            "Could not open diary",
            "Something went wrong while opening today's diary entry."
            );
        }
        },
        [
        selectedTripId,
        dayServices,
        diaryEntryServices,
        ]
    );

    const handleCheckIn = useCallback(
        async (poi: POI) => {
        const result =
            await poiServices.checkInPOI(poi.id);

        if (!result.success) {
            Alert.alert(
            "Check-in failed",
            result.errors.poi ??
                "Unable to check in."
            );

            return;
        }

        const visitedAt =
            new Date().toISOString();

        setTodayPois((current) =>
            current.map((item) =>
            item.id === poi.id
                ? { ...item, visitedAt }
                : item
            )
        );
        },
        [poiServices]
    );

    const handleUndoCheckIn = useCallback(
        async (poi: POI) => {
        const result =
            await poiServices.undoCheckInPOI(
            poi.id
            );

        if (!result.success) {
            Alert.alert(
            "Unable to undo check-in",
            result.errors.poi ??
                "Something went wrong."
            );

            return;
        }

        setTodayPois((current) =>
            current.map((item) =>
            item.id === poi.id
                ? { ...item, visitedAt: null }
                : item
            )
        );
        },
        [poiServices]
    );

    const openCreateDay = useCallback(() => {
        if (!selectedTrip) return;
      
        router.push({
          pathname: '/day/createDay',
          params: {
            tripId: selectedTrip.id
          },
        });
      }, [selectedTrip, today]);

    return {
        activeTrips,
        selectedTrip,
        selectedTripId,

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
    };
}