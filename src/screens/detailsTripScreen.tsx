import { DayCard } from "@/components/DayCard";
import { Day } from "@/models/Day";
import { Trip } from "@/models/Trip";
import { calculateTripStatistics } from "@/services/tripStatistics";
import { useDaysRepository } from "@/utils/useDaysRepository";
import { useTripsRepository } from "@/utils/useTripsRepository";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { Button, FlatList, SafeAreaView, Text } from "react-native";

export default function TripDetailsScreen() {
    // Retrieve id from parameters
    const { id: tripId } = useLocalSearchParams<{ id: string }>();

    // Load databank
    const tripsRepository = useTripsRepository();
    const daysRepository = useDaysRepository();

    // State
    const [trip, setTrip] = useState<Trip>();
    const [days, setDays] = useState<Day[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [statistics, setStatistics] = useState({
      totalDistance: 0,
      totalElevation: 0,
    });
    
    // Load the right trip everytime the screen is loaded
    useFocusEffect(
      useCallback(() => {
        async function loadData() {
          if (!tripId) {
            setError("No trip ID was provided.");
            setIsLoading(false);
            return;
          }
  
          try {
            setIsLoading(true);
            setError(null);
  
            const trip = await tripsRepository.getTripById(tripId);
  
            if (!trip) {
              setError("Trip not found.");
              return;
            }
  
            setTrip(trip);
  
            const days = await daysRepository.getAllDayForTrip(tripId);
            setDays(days);

            const statistics = await calculateTripStatistics(tripId, daysRepository);
            setStatistics(statistics);
          } catch {
            setError("Unable to load trip.");
          } finally {
            setIsLoading(false);
          }
        }
  
        loadData();
      }, [tripId])
    );
  
    if (isLoading) {
      return <Text>Loading...</Text>;
    }
  
    if (error || !trip) {
      return <Text>{error ?? "Trip not found."}</Text>;
    }

    return (
        <SafeAreaView>
        <Text>{trip?.name}</Text>

        <Text>{trip?.startDate} to {trip?.endDate}</Text>
        <Text>Total distance: {statistics.totalDistance} km</Text>
        <Text>Total elevation: {statistics.totalElevation} m</Text>
        <Text>{trip?.description}</Text>

        <Text>Days</Text>
        <Text>--------------</Text>
        <FlatList
          data={days}
          keyExtractor={(day) => day.id}
          renderItem={({ item }) => (
            <DayCard
              day={item}
              onPress={() => handleDetailsDay(item.id)}
            />
          )}
          ListEmptyComponent={
            <Text>No days planned yet.</Text>
          }
        />
        <Button
          title="Add new day"
          onPress={() => { if (trip) handleAddDay(trip?.id)}}
        />
        
        </SafeAreaView>
    );
}

function handleAddDay(tripId: string){
  router.push({
    pathname: "/createDay",
    params: {tripId}
  })
}

function handleDetailsDay(dayId: string){
  router.push({
    pathname: "/detailsDay",
    params: {dayId}
  })
}