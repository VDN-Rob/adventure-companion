import { Trip } from "@/models/Trip";
import { useTripsRepository } from "@/utils/useTripsRepository";
import * as Crypto from "expo-crypto";
import { router } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import {
    Button,
    SafeAreaView,
    Text,
    TextInput,
} from "react-native";

export default function CreateTripScreen() {
    const [name, setName] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [description, setDescription] = useState("");
    const [trips, setTrips] = useState<Trip[]>([]);
    const db = useSQLiteContext();
    const tripsRepository = useTripsRepository();

    // When screen finishes loading, get the trips
    useEffect(() => {
    async function loadTrips() {
        const loadedTrips = await tripsRepository.getTrips();

        setTrips(loadedTrips);
    }

    loadTrips();
    }, [db]);

    async function handleSaveTrip() {
        const newTrip: Trip = {
            id: Crypto.randomUUID(),
            name: name,
            startDate: startDate,
            endDate: endDate,
            description: description
        }

        await tripsRepository.createTrip(newTrip);
        const trips = await tripsRepository.getTrips();
        
        setTrips(trips);

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