import { theme } from "@/app/theme";
import { InputField } from "@/components/forms/InputField";
import { Day } from "@/models/Day";
import { useAppServices } from "@/utils/useAppServiceProvider";
import * as Crypto from "expo-crypto";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
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
        if (date.trim() === "") {
            Alert.alert(
                "Invalid date",
                "Please fill in date"
            );
            return;
        }

        const elevation = (plannedElevation === "" ? null : Number(plannedElevation));
        const distance = (plannedDistance === "" ? null : Number(plannedDistance));

        if (elevation !== null && Number.isNaN(elevation)) {
            Alert.alert(
              "Invalid elevation",
              "Please enter a valid number."
            );
            return;
        }
    
        if (distance !== null && Number.isNaN(distance)) {
            Alert.alert(
                "Invalid distance",
                "Please enter a valid number."
            );
            return;
        }

        if (elevation !== null && elevation < 0) {
            Alert.alert(
            "Invalid elevation",
            "Elevation cannot be negative."
            );
            return;
        }

        if (distance !== null && distance < 0) {
            Alert.alert(
            "Invalid distance",
            "Distance cannot be negative."
            );
            return;
        }

        // Saving
        const newDay: Day = {
            id: Crypto.randomUUID(),
            tripId: tripId,
            date: date.trim(),
            title: title.trim() || null,
            notes: notes.trim() || null,
            plannedElevation: elevation,
            plannedDistance: distance,
        };

        await dayServices.createDay(newDay);

        router.back()
    }
    
    return (
  <KeyboardAvoidingView
    style={styles.container}
    behavior={Platform.OS === "ios" ? "padding" : undefined}
  >
    <ScrollView
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backArrow}>←</Text>
        </Pressable>

        <View>
          <Text style={styles.eyebrow}>
            ADVENTURE PLANNER
          </Text>

          <Text style={styles.headerTitle}>
            PLAN DAY
          </Text>
        </View>
      </View>

      {/* SECTION */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          DAY DETAILS
        </Text>

        <View style={styles.sectionLine} />
      </View>

      {/* TITLE */}
      <InputField
        label="DAY TITLE"
        value={title}
        onChangeText={setTitle}
        placeholder="Through the Ardennes"
      />

      {/* DATE */}
      <InputField
        label="DATE"
        value={date}
        onChangeText={setDate}
        placeholder="2026-08-28"
        keyboardType="numbers-and-punctuation"
      />

      {/* DISTANCE + ELEVATION */}
      <View style={styles.row}>
        <View style={styles.half}>
          <InputField
            label="DISTANCE"
            value={plannedDistance}
            onChangeText={setPlannedDistance}
            placeholder="68.5"
            keyboardType="decimal-pad"
            suffix="KM"
          />
        </View>

        <View style={styles.rowGap} />

        <View style={styles.half}>
          <InputField
            label="ELEVATION"
            value={plannedElevation}
            onChangeText={setPlannedElevation}
            placeholder="820"
            keyboardType="numeric"
            suffix="M"
          />
        </View>
      </View>

      {/* NOTES */}
      <View style={styles.notesContainer}>
        <Text style={styles.label}>
          NOTES
        </Text>

        <TextInput
          value={notes}
          onChangeText={setNotes}
          placeholder="Anything important about this day..."
          placeholderTextColor={theme.colours.textMuted}
          multiline
          textAlignVertical="top"
          style={[
            styles.input,
            styles.notesInput,
          ]}
        />
      </View>

      {/* SAVE */}
      <Pressable
        style={styles.saveButton}
        onPress={handleSaveDay}
      >
        <Text style={styles.saveText}>
          SAVE DAY
        </Text>

        <Text style={styles.saveArrow}>
          →
        </Text>
      </Pressable>
    </ScrollView>
  </KeyboardAvoidingView>
);
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colours.background,
    },
  
    content: {
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.lg,
      paddingBottom: 100,
    },
  
    header: {
      flexDirection: "row",
      alignItems: "center",
  
      marginBottom: theme.spacing.xl,
    },
  
    backButton: {
      width: 42,
      height: 42,
  
      alignItems: "center",
      justifyContent: "center",
  
      marginRight: theme.spacing.sm,
  
      borderWidth: 1,
      borderColor: theme.colours.border,
      borderRadius: theme.radius.sm,
    },
  
    backArrow: {
      fontFamily: theme.fonts.displayBold,
      fontSize: theme.fontSize.xl,
  
      color: theme.colours.text,
    },
  
    eyebrow: {
      fontFamily: theme.fonts.bodyBold,
      fontSize: theme.fontSize.xs,
  
      color: theme.colours.accent,
  
      letterSpacing: 2,
    },
  
    headerTitle: {
      marginTop: 2,
  
      fontFamily: theme.fonts.displayBold,
      fontSize: theme.fontSize.xxl,
  
      color: theme.colours.text,
  
      letterSpacing: 1,
    },
  
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
  
      gap: theme.spacing.sm,
  
      marginBottom: theme.spacing.lg,
    },
  
    sectionTitle: {
      fontFamily: theme.fonts.bodyBold,
      fontSize: theme.fontSize.xs,
  
      color: theme.colours.accent,
  
      letterSpacing: 2,
    },
  
    sectionLine: {
      flex: 1,
  
      height: 1,
  
      backgroundColor: theme.colours.border,
    },
  
    inputContainer: {
      marginBottom: theme.spacing.md,
    },
  
    label: {
      marginBottom: theme.spacing.xs,
  
      fontFamily: theme.fonts.bodyBold,
      fontSize: theme.fontSize.xs,
  
      color: theme.colours.textMuted,
  
      letterSpacing: 1.5,
    },
  
    inputWrapper: {
      flexDirection: "row",
      alignItems: "center",
  
      minHeight: 52,
  
      backgroundColor: theme.colours.surface,
  
      borderWidth: 1,
      borderColor: theme.colours.border,
  
      borderRadius: theme.radius.md,
    },
  
    input: {
      flex: 1,
  
      minHeight: 50,
  
      paddingHorizontal: theme.spacing.md,
  
      fontFamily: theme.fonts.body,
      fontSize: theme.fontSize.sm,
  
      color: theme.colours.text,
    },
  
    suffix: {
      paddingRight: theme.spacing.md,
  
      fontFamily: theme.fonts.bodyBold,
      fontSize: theme.fontSize.xs,
  
      color: theme.colours.accent,
  
      letterSpacing: 1,
    },
  
    row: {
      flexDirection: "row",
  
      alignItems: "flex-start",
    },
  
    half: {
      flex: 1,
    },
  
    rowGap: {
      width: theme.spacing.sm,
    },
  
    notesContainer: {
      marginTop: theme.spacing.sm,
    },
  
    notesInput: {
      height: 130,
  
      paddingTop: theme.spacing.md,
  
      textAlignVertical: "top",
    },
  
    saveButton: {
      minHeight: 58,
  
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
  
      marginTop: theme.spacing.xl,
  
      backgroundColor: theme.colours.accent,
  
      borderRadius: theme.radius.md,
    },
  
    saveText: {
      fontFamily: theme.fonts.bodyBold,
      fontSize: theme.fontSize.sm,
  
      color: theme.colours.background,
  
      letterSpacing: 2,
    },
  
    saveArrow: {
      marginLeft: theme.spacing.sm,
  
      fontFamily: theme.fonts.displayBold,
      fontSize: theme.fontSize.lg,
  
      color: theme.colours.background,
    },
  });