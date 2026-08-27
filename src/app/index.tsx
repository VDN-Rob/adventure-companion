import { TripCard } from "@/components/TripCard";
import { OfflineMap } from "@/models/OfflineMap";
import { Trip } from "@/models/Trip";
import { MapBounds } from "@/utils/combineMapBounds";
import { useAppServices } from "@/utils/useAppServiceProvider";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Button, FlatList, StyleSheet, Text, View } from "react-native";

export default function Index() {
  // Temporary memory
  const [trips, setTrips] = useState<Trip[]>([]);
  const [maps, setMaps] = useState<OfflineMap[]>([]);
  
  const {tripServices, isOnline, mapServices} = useAppServices();

  // When Index finishes loading, get the trips
  useEffect(() => {
    async function loadTrips() {
      const loadedTrips = await tripServices.getAllTrips();

      setTrips(loadedTrips);
    }
    async function loadMaps() {
      const maps = await mapServices.getDownloadedMaps();
      setMaps(maps);
    }

    loadMaps();
    loadTrips();
  }, []);
  
  async function handleDeleteMap(map: OfflineMap) {
    Alert.alert(
        "Delete map",
        `Are you sure you want to delete "${map.name}"?`,
        [
            {
                text: "Cancel",
                style: "cancel",
            },
            {
                text: "Delete",
                style: "destructive",
                onPress: async () => {
                    try {
                        await mapServices.deleteRegion(map);
  
                        // Remove it from the UI
                        setMaps(currentMaps =>
                            currentMaps.filter(
                                currentMap => currentMap.id !== map.id
                            )
                        );
                    } catch (error) {
                        console.error("Failed to delete map:", error);
  
                        Alert.alert(
                            "Error",
                            "The map could not be deleted."
                        );
                    }
                },
            },
        ]
    );
  }

  return (
      <View style={styles.container}>
        <Text>Cycling Companion</Text>

        <Text>Your offline cycling companion.</Text>
        <Text>
          {isOnline === null
            ? "Checking connection..."
            : isOnline
              ? "Online"
              : "Offline"}
        </Text>
        
        <FlatList
          data={trips}
          keyExtractor={(trip) => trip.id}
          renderItem={({ item }) => (
            <TripCard 
              trip={item}
              onPress={() => handleDetailsTrip(item.id)}>
            </TripCard>
          )}
        />
        
        <Button
          title="+ New Trip"
          onPress={() => router.push("/createTrip")}
        />

        <Button
          title="Open map"
          onPress={() => router.push("/map")}
        />
        <Button
          title="Download test map"
          onPress={async () => {
              const bounds: MapBounds = [
                  4.5,  // west
                  49.8, // south
                  4.9,  // east
                  50.1, // north
              ];

              try {
                  const map = await mapServices.downloadRegion(
                      "Test map",
                      bounds
                  );

                  console.log("Downloaded map:", map);

                  Alert.alert(
                      "Success",
                      "Map download started."
                  );
              } catch (error) {
                  console.error(error);

                  Alert.alert(
                      "Error",
                      "Could not download map."
                  );
              }
          }}
      />
      <FlatList
        data={maps}
        keyExtractor={(map) => map.id}
        renderItem={({ item }) => (
            <View>
                <Text>{item.name}</Text>

                <Text>
                    {item.west}, {item.south} → {item.east}, {item.north}
                </Text>

                <Button
                    title="Delete map"
                    onPress={() => handleDeleteMap(item)}
                />
            </View>
        )}
    />
      </View>
  );

}

function handleDetailsTrip(id: string){
  router.push({
    pathname: "/detailsTrip",
    params: {id}
  })
}


// Aestethic
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },  
    input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});