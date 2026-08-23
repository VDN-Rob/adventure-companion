import { POI } from "@/models/POI";
import { usePoisRepository } from "@/utils/usePoisRepository";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView, Text } from "react-native";

export default function DetailsPOIScreen() {
    // Retrieve id from parameters
    const { poiId } = useLocalSearchParams<{ poiId: string }>();

    // Load databank
    const poisRepository = usePoisRepository();

    // State
    const [poi, setPoi] = useState<POI | null>(null);
    
    // Load the right Poi everytime the screen is loaded
    useEffect(() => {
        async function loadDay() {
            if (!poiId) return;

            const poi = await poisRepository.getPOIById(poiId);

            setPoi(poi);
            }

            loadDay();
            }, 
        [poiId]
    );
    
    if (!poi) {
        return <Text>Loading...</Text>;
      }

    return (
        <SafeAreaView>
        <Text>{poi.name}</Text>

        <Text>{poi.type}</Text>
        <Text>{poi.notes}</Text>
        <Text>{poi.latitude}</Text>
        <Text>{poi.longitude}</Text>

        </SafeAreaView>
    );
}

// Button list component
type ItemProps = { title: string };

const Item = ({ title }: ItemProps) => (
  <Text>{title}</Text>
);