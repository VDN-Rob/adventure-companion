import { POI, POIType } from "@/models/POI";
import { usePoisRepository } from "@/utils/usePoisRepository";
import { Picker } from "@react-native-picker/picker";
import * as Crypto from "expo-crypto";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
    Alert,
    Button,
    SafeAreaView,
    Text,
    TextInput
} from "react-native";

export default function CreatePoiScreen() {
    // Retrieve id from parameters
    const { dayId } = useLocalSearchParams<{ dayId: string }>();
    if (!dayId) {
        Alert.alert("Error", "No day was specified.");
        return;
      }
    
    const [name, setName] = useState("");
    const [type, setType] = useState<POIType>("other");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [notes, setNotes] = useState("");

    const poiRepository = usePoisRepository();

    async function handleSavePOI() {
        if (latitude !== "" && (Number(latitude) < -90 || Number(latitude) > 90)) {
            Alert.alert("Invalid latitude", "Latitude must be between -90 and 90.");
            return;
        }
        
        if (longitude !== "" && (Number(longitude) < -180 || Number(longitude) > 180)) {
            Alert.alert("Invalid longitude", "Longitude must be between -180 and 180.");
            return;
        }
        
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
        <Text>Create new POI</Text>

        <Text>Name</Text>
        <TextInput
            value={name}
            onChangeText={setName}
            placeholder="POI name"
        />

        <Text>Type</Text>
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


        <Text>Latitude</Text>
        <TextInput
            value={latitude}
            onChangeText={setLatitude}
            keyboardType="decimal-pad"
        />

        <Text>Longitude</Text>
        <TextInput
            value={longitude}
            onChangeText={setLongitude}
            keyboardType="decimal-pad"
        />

        <Button
            title="Save POI"
            onPress={handleSavePOI}
        />
        </SafeAreaView>
    );
}