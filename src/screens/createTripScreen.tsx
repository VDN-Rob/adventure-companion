import { Trip } from "@/models/Trip";
import { useAppServices } from "@/utils/useAppServiceProvider";
import * as Crypto from "expo-crypto";
import { router } from "expo-router";
import { useState } from "react";
import {
    Button,
    SafeAreaView,
    Text,
    TextInput,
} from "react-native";

export default function CreateTripScreen() {
    // State
    const [name, setName] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [description, setDescription] = useState("");
    
    // Access application layer
    const { tripServices } = useAppServices();

    async function handleSaveTrip() {
        const newTrip: Trip = {
            id: Crypto.randomUUID(),
            name: name,
            startDate: startDate,
            endDate: endDate,
            description: description
        }

        await tripServices.createTrip(newTrip);

        router.replace("/")
    }
    
    return (
        <SafeAreaView>
        <Text>Create new trip</Text>

        <Text>Trip name</Text>
        <TextInput
            value={name}
            onChangeText={setName}
            placeholder="2026 Cycling Trip"
        />

        <Text>Start date</Text>
        <TextInput
            value={startDate}
            onChangeText={setStartDate}
            placeholder="2026-08-08"
        />

        <Text>End date</Text>
        <TextInput
            value={endDate}
            onChangeText={setEndDate}
            placeholder="2026-08-15"
        />

        <Text>Description</Text>
        <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Description"
        />

        <Button
            title="Save trip"
            onPress={handleSaveTrip}
        />
        </SafeAreaView>
    );
}