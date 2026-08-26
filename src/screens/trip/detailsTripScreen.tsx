import { DayCard } from "@/components/DayCard";
import { Day } from "@/models/Day";
import { Trip } from "@/models/Trip";
import { useAppServices } from "@/utils/useAppServiceProvider";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Button, FlatList, SafeAreaView, Text } from "react-native";

export default function TripDetailsScreen() {
    // Retrieve id from parameters
    const { id: tripId } = useLocalSearchParams<{ id: string }>();

    // Use application layer to access databank
    const { tripServices, tripMapServices } = useAppServices();

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
  
            const result = await tripServices.getTripDetails(tripId);
  
            if (result === null) {
              setError("Trip not found.");
              return;
            }
  
            setTrip(result.trip);
            setDays(result.days);

            const statistics = await tripServices.calculateTripStatistics(tripId);
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


    function handleTripMapDownload() {
      const regions = tripMapServices.getTripMapRegions(tripId, "day");
    }

    function tripDownloadWarning(id: string) {
      Alert.alert(
        "Downloading",
        `How would you like to download the maps?

        * Entire trip
          One large map covering the whole trip.
          Simpler, but may download unnecessary areas.

        * Separate maps per day
          Downloads only the area around each day.
          Usually uses less storage for long trips.`,
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Entire trip",
            style: "destructive",
            onPress: handleTripMapDownload,
          },
          {
            text: "Per day",
            style: "destructive",
            onPress: handleTripMapDownload,
          },
        ]
      );
    }

    return (
        <SafeAreaView>
        <Text>{trip?.name}</Text>

        <Text>{trip?.startDate} to {trip?.endDate}</Text>
        <Text>Total distance: {statistics.totalDistance} km</Text>
        <Text>Total elevation: {statistics.totalElevation} m</Text>
        <Text>{trip?.description}</Text>


        <Button
        title="Edit trip details"
        onPress={() => handleEditTrip(trip.id)}
        />
        
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
        
        <Text>Map</Text>
        <Text>--------------</Text>
        <Button
          title="Download maps"
          onPress={() => { if (trip) tripDownloadWarning(trip?.id)}}
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

function handleEditTrip(id: string){
  router.push({
    pathname: "/editTrip",
    params: {id}
  })
}

