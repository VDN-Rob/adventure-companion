import { Trip } from "@/models/Trip";
import { useAppServices } from "@/utils/useAppServiceProvider";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Button, FlatList, StyleSheet, Text, View } from "react-native";

export default function Index() {
  // Temporary memory
  const [trips, setTrips] = useState<Trip[]>([]);
  
  const {tripServices, isOnline} = useAppServices();

  // When Index finishes loading, get the trips
  useEffect(() => {
    async function loadTrips() {
      const loadedTrips = await tripServices.getAllTrips();

      setTrips(loadedTrips);
    }

    loadTrips();
  }, []);
  
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
            <View>
              <Text
              style={styles.title}
              onPress={() => handleDetailsTrip(item.id)}>{item.name}</Text>
              <Text>{item.startDate}</Text>
              <Text>{item.endDate}</Text>
              {(item && item.description != null) &&
              <Text>{item.description}</Text>}
              <Button
                title="Edit"
                onPress={() => handleEditTrip(item.id)}
              />
            </View>
          )}
        />
        
        <Button
          title="+ New Trip"
          onPress={() => router.push("/createTrip")}
        />
      </View>
  );

}

// Button list component
type ItemProps = { title: string };

const Item = ({ title }: ItemProps) => (
  <Text>{title}</Text>
);


function handleEditTrip(id: string){
  router.push({
    pathname: "/editTrip",
    params: {id}
  })
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