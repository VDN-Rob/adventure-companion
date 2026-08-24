import { Trip } from "@/models/Trip";
import { useAppServices } from "@/utils/useAppServiceProvider";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Button, SafeAreaView, Text, TextInput } from "react-native";

export default function EditTripScreen() {
    // Retrieve id from parameters
    const { id } = useLocalSearchParams<{ id: string }>();

    // Load databank
    const { tripServices } = useAppServices();

    // State
    const [trip, setTrip] = useState<Trip>();
    const [name, setName] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState<string | null>(null);
    const [description, setDescription] = useState<string | null>(null);

    // Load the right trip when screen finishes loading
    useEffect(() => {
        async function loadTrip() {
            if (!id) return;
            
            const trip = await tripServices.getTrip(id);

            if (trip) {
                setTrip(trip);
                setName(trip.name);
                setStartDate(trip.startDate);
                setEndDate(trip.endDate);
                setDescription(trip.description)
            }
        }

        loadTrip()
    }, [id]);

    async function handleSave() {
        if (!trip) return;
        
        const updatedTrip: Trip = {
        ...trip, // Keep same id
        name: name,
        startDate: startDate,
        endDate: endDate,
        description: description
        }
        
        await tripServices.updateTrip(updatedTrip);

        router.replace("/")
    }

    function handleDeleteTrip(id: string){
        Alert.alert(
          "Delete trip?",
          "This action cannot be undone.",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Delete",
              style: "destructive",
              onPress: deleteTrip,
            },
          ]
        );
      }
    
    async function deleteTrip() {
        if (!id) return;
      
        await tripServices.deleteTrip(id);
      
        router.replace("/");
      }
    
    return (
        <SafeAreaView>
        <Text>Edit trip</Text>

        <Text>Trip name</Text>
        <TextInput
            value={name}
            onChangeText={setName}
        />

        <Text>Start date</Text>
        <TextInput
            value={startDate}
            onChangeText={setStartDate}
        />

        <Text>End date</Text>
        <TextInput
            value={endDate ?? ""}
            onChangeText={setEndDate}
        />

        <Text>Description</Text>
        <TextInput
            value={description ?? ""}
            onChangeText={setDescription}
            placeholder= "Add new description"
        />

        <Button
            title="Save changes"
            onPress={handleSave}
        />
        <Button
        title="Delete"
        onPress={() => handleDeleteTrip(id)}
        />
        </SafeAreaView>
    );
}