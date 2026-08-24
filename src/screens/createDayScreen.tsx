import { Day } from "@/models/Day";
import { useAppServices } from "@/utils/useAppServiceProvider";
import * as Crypto from "expo-crypto";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
    Alert,
    Button,
    SafeAreaView,
    Text,
    TextInput,
} from "react-native";

export default function CreateDayScreen() {
    // Retrieve id from parameters
    const { tripId } = useLocalSearchParams<{ tripId: string }>();
    
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [notes, setNotes] = useState("");
    const [plannedElevation, setPlannedElevation] = useState("");
    const [plannedDistance, setPlannedDistance] = useState("");

    const { dayServices} = useAppServices();

    async function handleSaveDay() {
        // Validation
        if (date === "") {
            Alert.alert(
                "Invalid date",
                "Please fill in date"
            );
            return;
        }

        if (plannedElevation !== "" && Number(plannedElevation) < 0) {
            Alert.alert(
                "Invalid planned elevation",
                "Elevation must be positive"
            );
            return;
        }

        if (plannedDistance !== "" && Number(plannedDistance) < 0) {
            Alert.alert(
                "Invalid planned distance",
                "Distance must be positive"
            );
            return;
        }

        // Saving
        const newDay: Day = {
            id: Crypto.randomUUID(),
            tripId: tripId,
            date: date,
            title: title || null,
            notes: notes || null,
            plannedElevation: plannedElevation === "" ? null : Number(plannedElevation),
            plannedDistance: plannedDistance === "" ? null : Number(plannedDistance),
        }

        await dayServices.createDay(newDay);
        router.back()
    }
    
    return (
        <SafeAreaView>
        <Text>Create new day</Text>

        <Text>Day title</Text>
        <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Day title"
        />

        <Text>Date</Text>
        <TextInput
            value={date}
            onChangeText={setDate}
            placeholder="2026-08-08"
        />

        <Text>Notes</Text>
        <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Notes"
        />


        <Text>Planned Elevation</Text>
        <TextInput
            value={plannedElevation}
            onChangeText={setPlannedElevation}
            keyboardType="numeric"
        />

        <Text>Planned Distance</Text>
        <TextInput
            value={plannedDistance}
            onChangeText={setPlannedDistance}
            keyboardType="decimal-pad"
        />

        <Button
            title="Save trip"
            onPress={handleSaveDay}
        />
        </SafeAreaView>
    );
}