import { Day } from "@/models/Day";
import { POI } from "@/models/POI";
import { useDaysRepository } from "@/utils/useDaysRepository";
import { usePoisRepository } from "@/utils/usePoisRepository";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { Button, FlatList, SafeAreaView, Text, View } from "react-native";

export default function DayDetailsScreen() {
    // Retrieve id from parameters
    const { dayId } = useLocalSearchParams<{ dayId: string }>();

    // Load databank
    const daysRepository = useDaysRepository();
    const poisRepository = usePoisRepository();

    // State
    const [day, setDay] = useState<Day | null>(null);
    const [pois, setPois] = useState<POI[]>();
    
    
    // Load the right trip everytime the screen is loaded
    useFocusEffect(
      useCallback(() => {
        async function loadDay() {
          if (!dayId) return;
    
          const day = await daysRepository.getDayById(dayId);
    
          setDay(day);

          const pois = await poisRepository.getAllPOIsForDay(dayId);

          setPois(pois);
        }
    
        loadDay();
      }, [dayId])
    );
    
    if (!day) {
        return <Text>Loading...</Text>;
      }

    return (
        <SafeAreaView>
        <Text>{day.title}</Text>

        <Text>{day.date}</Text>
        <Text>{day.notes}</Text>
        <Text>{day.plannedElevation}</Text>
        <Text>{day.plannedDistance}</Text>

        <Text>Stops</Text>
        <Text>--------------</Text>
        <FlatList
        data={pois}
        keyExtractor={(poi) => poi.id}
        renderItem={({ item }) => (
            <View>
            <Text>{item.name}</Text>
            <Text>{item.type}</Text>
            <Text>{item.latitude}</Text>
            <Text>{item.longitude}</Text>
            <Text>{item.notes}</Text>
            </View>
        )}
        />
        <Button
        title="Add new POI"
        onPress={() => { if (day) handleAddPoi(dayId)}}
        />
        
        </SafeAreaView>
    );
}

// Button list component
type ItemProps = { title: string };

const Item = ({ title }: ItemProps) => (
  <Text>{title}</Text>
);

function handleAddPoi(dayId: string){
  router.push({
    pathname: "/createPoi",
    params: {dayId}
  })
}

// function handleDetailsPoi(poiId: string){
//   router.push({
//     pathname: "/detailsPoi",
//     params: {poiId}
//   })
// }