import { Day } from "@/models/Day";
import { Trip } from "@/models/Trip";
import { useDaysRepository } from "@/utils/useDaysRepository";
import { useTripsRepository } from "@/utils/useTripsRepository";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { Button, FlatList, SafeAreaView, Text, View } from "react-native";

export default function TripDetailsScreen() {
    // Retrieve id from parameters
    const { id: tripId } = useLocalSearchParams<{ id: string }>();

    // Load databank
    const tripsRepository = useTripsRepository();
    const daysRepository = useDaysRepository();

    // State
    const [trip, setTrip] = useState<Trip>();
    const [days, setDays] = useState<Day[]>();
    
    // Load the right trip everytime the screen is loaded
    useFocusEffect(
      useCallback(() => {
        async function loadTrip() {
          if (!tripId) return;
    
          const trip = await tripsRepository.getTripById(tripId);
    
          if (!trip) return;
    
          setTrip(trip);
    
          const days = await daysRepository.getAllDayForTrip(tripId);
    
          setDays(days);
        }
    
        loadTrip();
      }, [tripId])
    );
    
    return (
        <SafeAreaView>
        <Text>{trip?.name}</Text>

        <Text>{trip?.startDate} to {trip?.endDate}</Text>
        <Text>{trip?.description}</Text>

        <Text>Days</Text>
        <Text>--------------</Text>
        <FlatList
          data={days}
          keyExtractor={(day) => day.id}
          renderItem={({ item }) => (
            <View>
              <Text>{item.title}</Text>
              <Text>{item.date}</Text>
              <Text>{item.notes}</Text>
              <Text>{item.plannedDistance}</Text>
              <Text>{item.plannedElevation}</Text>
            </View>
          )}
        />
        <Button
          title="Add new day"
          onPress={() => { if (trip) handleAddDay(trip?.id)}}
        />
        
        </SafeAreaView>
    );
}

// Button list component
type ItemProps = { title: string };

const Item = ({ title }: ItemProps) => (
  <Text>{title}</Text>
);

function handleAddDay(tripId: string){
  router.push({
    pathname: "/createDay",
    params: {tripId}
  })
}