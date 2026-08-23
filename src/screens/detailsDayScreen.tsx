import { POICard } from "@/components/POICard";
import { Day } from "@/models/Day";
import { POI } from "@/models/POI";
import { useDaysRepository } from "@/utils/useDaysRepository";
import { usePoisRepository } from "@/utils/usePoisRepository";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { Button, FlatList, SafeAreaView, Text } from "react-native";

export default function DayDetailsScreen() {
    // Retrieve id from parameters
    const { dayId } = useLocalSearchParams<{ dayId: string }>();

    // Load databank
    const daysRepository = useDaysRepository();
    const poisRepository = usePoisRepository();

    // State
    const [day, setDay] = useState<Day | null>(null);
    const [pois, setPois] = useState<POI[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    
    // Load the right day everytime the screen is loaded
    useFocusEffect(
      useCallback(() => {
        async function loadData() {
          if (!dayId) {
            setError("No day ID was provided");
            setIsLoading(false);
            return;
          }
    
          try {
            setIsLoading(true);
            setError(null);

            const day = await daysRepository.getDayById(dayId);
      
            if (!day) {
              setError("Day not Found");
              return;
            }

            setDay(day);

            const pois = await poisRepository.getAllPOIsForDay(dayId);
            setPois(pois);
          } catch {
            setError("Unable to load day");
          } finally {
            setIsLoading(false);
          }
        }
    
        loadData();
      }, [dayId])
    );
    
    if (isLoading) {
        return <Text>Loading...</Text>;
    }

    if (error || !day) {
      return <Text>{error ?? "Day not found."}</Text>;
    }

    return (
        <SafeAreaView>
        <Text>{day.title}</Text>

        <Text>{day.date}</Text>
        <Text>{day.notes}</Text>
        <Text>{day.plannedElevation}</Text>
        <Text>{day.plannedDistance}</Text>

        <Button
        title="Edit day"
        onPress={() => {editDay(dayId)}}
        />


        <Text>Point of interest</Text>
        <Text>--------------</Text>
        <FlatList
          data={pois}
          keyExtractor={(poi) => poi.id}
          renderItem={({ item }) => (
            <POICard
              poi={item} onPress={() => editPOI(item.id)}
              />
          )}
          ListEmptyComponent={
            <Text>No points of interest planned yet.</Text>
          }
        />
        <Button
        title="Add new POI"
        onPress={() => {handleAddPoi(dayId)}}
        />
        
        </SafeAreaView>
    );
}

function handleAddPoi(dayId: string){
  router.push({
    pathname: "/createPoi",
    params: {dayId}
  })
}

function editPOI(poiId: string){
  router.push({
    pathname: "/editPOI",
    params: {poiId}
  })
}

function editDay(dayId: string){
  router.push({
    pathname: "/editDay",
    params: {dayId}
  })
}