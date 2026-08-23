import { Day } from "@/models/Day";
import { useDaysRepository } from "@/utils/useDaysRepository";
import * as Crypto from "expo-crypto";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
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

    const daysRepository = useDaysRepository();

    async function handleSaveDay() {
        const newDay: Day = {
            id: Crypto.randomUUID(),
            tripId: tripId,
            date: date,
            title: title,
            notes: notes,
            plannedElevation: Number(plannedElevation),
            plannedDistance: Number(plannedDistance),
        }

        await daysRepository.createDay(newDay);
        router.back()
    }
    
    return (
        <SafeAreaView>
        <Text>Create new day</Text>

        <Text>Day title</Text>
        <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="2026 Cycling Trip"
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
            placeholder="Description"
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