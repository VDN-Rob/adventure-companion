import { POI, POIType } from "@/models/POI";
import { usePoisRepository } from "@/utils/usePoisRepository";
import { Picker } from "@react-native-picker/picker";
import * as Crypto from "expo-crypto";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
    Button,
    SafeAreaView,
    Text,
    TextInput
} from "react-native";

export default function CreatePoiScreen() {
    // Retrieve id from parameters
    const { dayId } = useLocalSearchParams<{ dayId: string }>();
    
    const [name, setName] = useState("");
    const [type, setType] = useState<POIType>("other");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [notes, setNotes] = useState("");

    const poiRepository = usePoisRepository();

    async function handleSaveDay() {
        // Saving
        const newPoi: POI = {
            id: Crypto.randomUUID(),
            dayId: dayId,
            name: name,
            type: type,
            latitude: latitude === "" ? null : Number(latitude),
            longitude: longitude === "" ? null : Number(longitude),
            notes: notes || null,
        }

        await poiRepository.createPOI(newPoi);
        router.back()
    }
    
    return (
        <SafeAreaView>
        <Text>Create new day</Text>

        <Text>Day title</Text>
        <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Day title"
        />

        <Text>Date</Text>
        <Picker
            selectedValue={type}
            onValueChange={(value) => setType(value as POIType)}
            >
            <Picker.Item label="Food" value="food" />
            <Picker.Item label="Water" value="water" />
            <Picker.Item label="Supermarket" value="supermarket" />
            <Picker.Item label="Accommodation" value="accommodation" />
            <Picker.Item label="Other" value="other" />
        </Picker>

        <Text>Notes</Text>
        <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Notes"
        />


        <Text>Planned Elevation</Text>
        <TextInput
            value={latitude}
            onChangeText={setLatitude}
            keyboardType="numeric"
        />

        <Text>Planned Distance</Text>
        <TextInput
            value={longitude}
            onChangeText={setLongitude}
            keyboardType="decimal-pad"
        />

        <Button
            title="Save trip"
            onPress={handleSaveDay}
        />
        </SafeAreaView>
    );
}