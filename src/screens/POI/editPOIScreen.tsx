import { POI, POIType } from "@/models/POI";
import { useAppServices } from "@/utils/useAppServiceProvider";
import { Picker } from "@react-native-picker/picker";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Button, SafeAreaView, Text, TextInput } from "react-native";

export default function EditPOIScreen() {
    // Retrieve id from parameters
    const { poiId } = useLocalSearchParams<{ poiId: string }>();

    // Load databank
    const { poiServices } = useAppServices();

    // State
    const [poi, setPoi] = useState<POI | null>(null);
    const [name, setName] = useState("");
    const [type, setType] = useState<POIType>("other");
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);
    const [notes, setNotes] = useState<string | null>(null);

    // Load the right Poi everytime the screen is loaded
    useEffect(() => {
        async function loadPOI() {
            if (!poiId) return;

            const poi = await poiServices.getPOI(poiId);

            if (poi) {
                setPoi(poi);
                setName(poi.name);
                setType(poi.type)
                setLatitude(poi.latitude);
                setLongitude(poi.longitude);
                setNotes(poi.notes)
            }
        }

        loadPOI();
        }, [poiId]
    );
    
    async function handleSave() {
        if (!poi) return;
        
        const updatedPOI: POI = {
        ...poi, // Keep same id
        name: name,
        type: type,
        latitude: latitude,
        longitude: longitude,
        notes: notes
        }
        
        await poiServices.updatePOI(updatedPOI);

        router.back()
    }

    if (!poi) {
        return <Text>Loading...</Text>;
      }

    function handleDeleteTrip(id: string){
            Alert.alert(
              "Delete POI?",
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
            if (!poiId) return;
          
            await poiServices.deletePOI(poiId);
          
            router.back();
          }
        
    return (
        <SafeAreaView>
        <Text>Edit POI</Text>

        <Text>POI name</Text>
        <TextInput
            value={name}
            onChangeText={setName}
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
            value={notes ?? ""}
            onChangeText={setNotes}
            placeholder= "Add new notes"
        />

        <Button
            title="Save changes"
            onPress={handleSave}
        />
        <Button
        title="Delete"
        onPress={() => handleDeleteTrip(poiId)}
        />
        </SafeAreaView>
    );
}