import { setupDatabase } from "@/database/database";
import { TripsRepository } from "@/database/tripRepository";
import { Trip } from "@/models/Trip";
import { SQLiteProvider, useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

export default function Index() {
  // Temporary memory
  const [trips, setTrips] = useState<Trip[]>([]);
  const [text, onChangeText] = useState('Useless Text');
  const [count, setCount] = useState(0);
  
  // Event handlers
  function handleAddTrip() {
    const newTrip: Trip = {
      id: "0", // TODO
      name: "Test", // TODO
      startDate: "01.01.00", // TODO
      endDate: "31.12.00" // TODO
    }
    setTrips([...trips, newTrip]);
  }

  return (
    <SQLiteProvider
      databaseName="cycling.db"
      onInit={setupDatabase}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Cycling Companion</Text>

        <Text>Your offline cycling companion.</Text>
        
        {trips.length === 0 ? (
          <Text>No trips yet.</Text>
        ) : (
          trips.map((trip) => (
            <Text key={trip.id}>
              {trip.name}
              </Text> ))
        )}
        
        <Button title="+ New Trip" onPress={handleAddTrip} />
      </View>
    </SQLiteProvider>
  );
}

export function TripScreen() {
  const db = useSQLiteContext();

  const tripsRepository = new TripsRepository(db);

  return
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