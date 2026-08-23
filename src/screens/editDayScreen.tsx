import { Day } from "@/models/Day";
import { useDaysRepository } from "@/utils/useDaysRepository";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Button, SafeAreaView, Text, TextInput } from "react-native";

export default function EditDayScreen() {
    // Retrieve id from parameters
    const { dayId } = useLocalSearchParams<{ dayId: string }>();

    // Load databank
    const daysRepository = useDaysRepository();

    // State
    const [day, setDay] = useState<Day>();
    const [date, setDate] = useState("");
    const [title, setTitle] = useState<string | null>(null);
    const [notes, setNotes] = useState<string | null>(null);
    const [plannedElevation, setPlannedElevation] = useState("");
    const [plannedDistance, setPlannedDistance] = useState("");
    
    // Load the right trip when screen finishes loading
    useEffect(() => {
        async function loadTrip() {
            if (!dayId) return;
            
            const day = await daysRepository.getDayById(dayId);

            if (day) {
                setDay(day);
                setDate(day.date);
                setTitle(day.title);
                setNotes(day.notes);
                setPlannedElevation(
                    day.plannedElevation === null
                      ? ""
                      : String(day.plannedElevation)
                  );
                  setPlannedDistance(
                    day.plannedDistance === null
                      ? ""
                      : String(day.plannedDistance)
                  );
            }
        }

        loadTrip()
    }, [dayId]);

    async function handleSave() {
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

        if (!day) return;
        
        const updatedDay: Day = {
            ...day,
            date: date,
            title: title || null,
            notes: notes || null,
            plannedElevation: plannedElevation === "" ? null : Number(plannedElevation),
            plannedDistance: plannedDistance === "" ? null : Number(plannedDistance),
        }
        
        await daysRepository.updateDay(updatedDay);

        router.back();
    }

    function handleDeleteDay(id: string){
        Alert.alert(
          "Delete day?",
          "This action cannot be undone.",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Delete",
              style: "destructive",
              onPress: deleteDay,
            },
          ]
        );
      }
    
    async function deleteDay() {
        if (!dayId) return;
      
        await daysRepository.deleteDay(dayId);
      
        router.replace("/");
      }
    
    return (
        <SafeAreaView>
        <Text>Edit day</Text>

        <Text>Date: </Text>
        <TextInput
            value={date}
            onChangeText={setDate}
        />

        <Text>Title: </Text>
        <TextInput
            value={title ?? ""}
            onChangeText={setTitle}
        />

        <Text>Notes: </Text>
        <TextInput
            value={notes ?? ""}
            onChangeText={setNotes}
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
            title="Save changes"
            onPress={handleSave}
        />
        <Button
        title="Delete"
        onPress={() => handleDeleteDay(dayId)}
        />
        </SafeAreaView>
    );
}