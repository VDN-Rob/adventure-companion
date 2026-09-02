import { GameModal } from "@/components/GameModal";
import { InputField } from "@/components/forms/InputField";
import { SectionLabel } from "@/components/forms/SectionLabel";
import { Day } from "@/models/Day";
import { useAppServices } from "@/utils/useRepository/useAppServiceProvider";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { theme } from "@/styling/theme";

export default function EditDayScreen() {
    // Retrieve id from parameters
    const { dayId } = useLocalSearchParams<{ dayId: string }>();

    // Load databank
    const { dayServices } = useAppServices();

    // State
    const [day, setDay] = useState<Day>();
    const [date, setDate] = useState("");
    const [title, setTitle] = useState("");
    const [notes, setNotes] = useState("");
    const [plannedElevation, setPlannedElevation] = useState("");
    const [plannedDistance, setPlannedDistance] = useState("");
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    
    // Load the right trip when screen finishes loading
    useEffect(() => {
        async function loadDay() {
          if (!dayId) return;
      
          const day = await dayServices.getDay(dayId);
      
          if (day) {
            setDay(day);
            setDate(day.date);
      
            // Database null → empty form field
            setTitle(day.title ?? "");
            setNotes(day.notes ?? "");
      
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
      
        loadDay();
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
            title: title.trim() === "" ? null : title.trim(),
            notes: notes.trim() == "" ? null : notes.trim(),
            plannedElevation: plannedElevation === "" ? null : Number(plannedElevation),
            plannedDistance: plannedDistance === "" ? null : Number(plannedDistance),
        }
        
        await dayServices.updateDay(updatedDay);

        router.back();
    }

    async function deleteDay() {
        if (!dayId) return;
      
        setDeleteModalVisible(false);
      
        await dayServices.deleteDay(dayId);
      
        router.dismiss(2);
    }
    
    if (!day) {
        return (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>
              LOADING DAY...
            </Text>
          </View>
        );
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
                <Text style={styles.backArrow}>
                  ←
                </Text>
              </Pressable>
      
              <View>
                <Text style={styles.eyebrow}>
                  ADVENTURE PLANNER
                </Text>
      
                <Text style={styles.headerTitle}>
                  EDIT DAY
                </Text>
              </View>
            </View>
      
            {/* DAY DETAILS */}
      
            <SectionLabel title="DAY DETAILS" />
      
            <InputField
              label="TITLE"
              value={title ?? ""}
              onChangeText={setTitle}
              placeholder="Riding into the mountains"
            />
      
            <InputField
              label="DATE"
              value={date}
              onChangeText={setDate}
              placeholder="2026-08-08"
            />
      
            {/* PLANNING */}
      
            <SectionLabel title="PLANNING" />
      
            <View style={styles.row}>
              <View style={styles.half}>
                <InputField
                  label="DISTANCE (KM)"
                  value={plannedDistance}
                  onChangeText={setPlannedDistance}
                  placeholder="85"
                  keyboardType="decimal-pad"
                />
              </View>
      
              <View style={styles.rowGap} />
      
              <View style={styles.half}>
                <InputField
                  label="ELEVATION (M)"
                  value={plannedElevation}
                  onChangeText={setPlannedElevation}
                  placeholder="1200"
                  keyboardType="numeric"
                />
              </View>
            </View>
      
            {/* NOTES */}
      
            <SectionLabel title="DAY NOTES" />
      
            <View style={styles.notesContainer}>
              <Text style={styles.label}>
                NOTES
              </Text>
      
              <View style={styles.notesWrapper}>
                <TextInput
                  value={notes ?? ""}
                  onChangeText={setNotes}
                  placeholder="What do you need to remember?"
                  placeholderTextColor={theme.colours.textMuted}
                  multiline
                  textAlignVertical="top"
                  style={styles.notesInput}
                />
              </View>
            </View>
      
            {/* SAVE */}
      
            <Pressable
              style={styles.saveButton}
              onPress={handleSave}
            >
              <View>
                <Text style={styles.saveEyebrow}>
                  ADVENTURE PLANNER
                </Text>
      
                <Text style={styles.saveText}>
                  SAVE CHANGES
                </Text>
              </View>
      
              <Text style={styles.saveSymbol}>
                ✓
              </Text>
            </Pressable>
      
            {/* DANGER ZONE */}
      
            <View style={styles.dangerSection}>
              <Text style={styles.dangerLabel}>
                DANGER ZONE
              </Text>
      
              <Pressable
                style={styles.deleteButton}
                onPress={() => setDeleteModalVisible(true)}
              >
                <View>
                  <Text style={styles.deleteTitle}>
                    DELETE DAY
                  </Text>
      
                  <Text style={styles.deleteDescription}>
                    Permanently remove this day and its POIs.
                  </Text>
                </View>
      
                <Text style={styles.deleteSymbol}>
                  ×
                </Text>
              </Pressable>
            </View>
          </ScrollView>
      
          <GameModal
            visible={deleteModalVisible}
            title="DELETE DAY?"
            message="This day and its planned points of interest will be permanently removed. This action cannot be undone."
            confirmText="DELETE"
            cancelText="KEEP DAY"
            destructive
            onCancel={() => setDeleteModalVisible(false)}
            onConfirm={deleteDay}
          />
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
  
    label: {
      marginBottom: theme.spacing.xs,
  
      fontFamily: theme.fonts.bodyBold,
      fontSize: theme.fontSize.xs,
  
      color: theme.colours.textMuted,
  
      letterSpacing: 1.5,
    },
  
    notesContainer: {
      marginBottom: theme.spacing.md,
    },
  
    notesWrapper: {
      height: 140,
  
      backgroundColor: theme.colours.surface,
  
      borderWidth: 1,
      borderColor: theme.colours.border,
  
      borderRadius: theme.radius.md,
    },
  
    notesInput: {
      flex: 1,
  
      padding: theme.spacing.md,
  
      fontFamily: theme.fonts.body,
      fontSize: theme.fontSize.sm,
  
      lineHeight: 20,
  
      color: theme.colours.text,
  
      textAlignVertical: "top",
    },
  
    saveButton: {
      minHeight: 70,
  
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
  
      paddingHorizontal: theme.spacing.md,
  
      marginTop: theme.spacing.lg,
  
      backgroundColor: theme.colours.accent,
  
      borderRadius: theme.radius.md,
    },
  
    saveEyebrow: {
      fontFamily: theme.fonts.bodyBold,
      fontSize: 8,
  
      color: theme.colours.background,
  
      letterSpacing: 1.5,
    },
  
    saveText: {
      marginTop: 2,
  
      fontFamily: theme.fonts.displayBold,
      fontSize: theme.fontSize.lg,
  
      color: theme.colours.background,
  
      letterSpacing: 1,
    },
  
    saveSymbol: {
      fontFamily: theme.fonts.displayBold,
      fontSize: theme.fontSize.xxl,
  
      color: theme.colours.background,
    },
  
    dangerSection: {
      marginTop: theme.spacing.xxl,
    },
  
    dangerLabel: {
      marginBottom: theme.spacing.sm,
  
      fontFamily: theme.fonts.bodyBold,
      fontSize: theme.fontSize.xs,
  
      color: theme.colours.textMuted,
  
      letterSpacing: 2,
    },
  
    deleteButton: {
      minHeight: 70,
  
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
  
      paddingHorizontal: theme.spacing.md,
  
      backgroundColor: theme.colours.surface,
  
      borderWidth: 1,
      borderColor: theme.colours.border,
  
      borderRadius: theme.radius.md,
    },
  
    deleteTitle: {
      fontFamily: theme.fonts.displayBold,
      fontSize: theme.fontSize.md,
  
      color: theme.colours.text,
  
      letterSpacing: 1,
    },
  
    deleteDescription: {
      marginTop: 3,
  
      fontFamily: theme.fonts.body,
      fontSize: 9,
  
      color: theme.colours.textMuted,
    },
  
    deleteSymbol: {
      fontFamily: theme.fonts.displayBold,
      fontSize: 28,
  
      color: theme.colours.textMuted,
    },
  
    loadingContainer: {
      flex: 1,
  
      alignItems: "center",
      justifyContent: "center",
  
      backgroundColor: theme.colours.background,
    },
  
    loadingText: {
      fontFamily: theme.fonts.displayBold,
      fontSize: theme.fontSize.md,
  
      color: theme.colours.text,
  
      letterSpacing: 2,
    },
  });