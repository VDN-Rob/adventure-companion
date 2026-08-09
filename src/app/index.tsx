import { TripsRepository } from "@/database/tripRepository";
import { Trip } from "@/models/Trip";
import * as Crypto from "expo-crypto";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Button, FlatList, StyleSheet, Text, TextInput, View } from "react-native";

export default function Index() {
  // Temporary memory
  const [trips, setTrips] = useState<Trip[]>([]);
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const db = useSQLiteContext();
  const repository = new TripsRepository(db);

  // When Index finishes loading, get the trips
  useEffect(() => {
    async function loadTrips() {
      const loadedTrips = await repository.getTrips();

      setTrips(loadedTrips);
    }

    loadTrips();
  }, [db]);
  
  // Event handlers
  async function handleAddTrip() {
    const newTrip: Trip = {
      id: Crypto.randomUUID(),
      name: name,
      startDate: startDate,
      endDate: endDate
    }

    await repository.createTrip(newTrip);
    const trips = await repository.getTrips();
    
    setTrips(trips);
  }

  return (
      <View style={styles.container}>
        <Text>Cycling Companion</Text>

        <Text>Your offline cycling companion.</Text>
        
        <FlatList
          data={trips}
          keyExtractor={(trip) => trip.id}
          renderItem={({ item }) => (
            <View>
              <Text>{item.name}</Text>
              <Text>{item.startDate}</Text>
              <Text>{item.endDate}</Text>
            </View>
          )}
        />

        <TextInput
          placeholder="Trip name"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          placeholder="Start date"
          value={startDate}
          onChangeText={setStartDate}
        />

        <TextInput
          placeholder="End date"
          value={endDate}
          onChangeText={setEndDate}
        />
        
        <Button title="+ New Trip" onPress={handleAddTrip} />
      </View>
  );
}

// Button list component
type ItemProps = { title: string };

const Item = ({ title }: ItemProps) => (
  <Text>{title}</Text>
);





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