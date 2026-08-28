import { theme } from "@/app/theme";
import { InputField } from "@/components/forms/InputField";
import { SectionLabel } from "@/components/forms/SectionLabel";
import { Trip } from "@/models/Trip";
import { useAppServices } from "@/utils/useAppServiceProvider";
import * as Crypto from "expo-crypto";
import { router } from "expo-router";
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


export default function CreateTripScreen() {
    // State
    const [name, setName] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [description, setDescription] = useState("");
    
    // Access application layer
    const { tripServices } = useAppServices();

    async function handleSaveTrip() {
        const trimmedName = name.trim();
        const trimmedStartDate = startDate.trim();
        const trimmedEndDate = endDate.trim();
        const trimmedDescription = description.trim();
      
        if (trimmedName === "") {
          Alert.alert(
            "Missing adventure name",
            "Give your adventure a name before saving it."
          );
          return;
        }
      
        if (trimmedStartDate === "") {
          Alert.alert(
            "Missing start date",
            "Please enter a start date."
          );
          return;
        }
      
        if (
          trimmedEndDate !== "" &&
          trimmedEndDate < trimmedStartDate
        ) {
          Alert.alert(
            "Invalid dates",
            "The end date cannot be before the start date."
          );
          return;
        }
      
        const newTrip: Trip = {
          id: Crypto.randomUUID(),
          name: trimmedName,
          startDate: trimmedStartDate,
          endDate: trimmedEndDate === "" ? null : trimmedEndDate,
          description: trimmedDescription === "" ? null : trimmedDescription,
        };
      
        await tripServices.createTrip(newTrip);
      
        router.replace("/trips");
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
                  ADVENTURE SYSTEM
                </Text>
      
                <Text style={styles.headerTitle}>
                  NEW ADVENTURE
                </Text>
              </View>
            </View>
      
            {/* INTRO */}
            <View style={styles.intro}>
              <Text style={styles.introTitle}>
                PLAN YOUR NEXT JOURNEY
              </Text>
      
              <Text style={styles.introText}>
                Set the basics now. You can add days,
                routes, points of interest and diary
                entries later.
              </Text>
            </View>
      
            {/* DETAILS */}
            <SectionLabel title="ADVENTURE DETAILS" />
      
            {/* NAME */}
            <InputField
              label="NAME"
              value={name}
              onChangeText={setName}
              placeholder="2026 Cycling Trip"
            />
      
            {/* DATES */}
            <View style={styles.row}>
              <View style={styles.half}>
                <InputField
                  label="START DATE"
                  value={startDate}
                  onChangeText={setStartDate}
                  placeholder="2026-08-08"
                  keyboardType="numbers-and-punctuation"
                />
              </View>
      
              <View style={styles.rowGap} />
      
              <View style={styles.half}>
                <InputField
                  label="END DATE"
                  value={endDate}
                  onChangeText={setEndDate}
                  placeholder="Optional"
                  keyboardType="numbers-and-punctuation"
                />
              </View>
            </View>
      
            {/* DESCRIPTION */}
            <View style={styles.notesContainer}>
              <Text style={styles.label}>
                DESCRIPTION
              </Text>
      
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="A few words about this adventure..."
                placeholderTextColor={theme.colours.textMuted}
                multiline
                textAlignVertical="top"
                style={[
                  styles.input,
                  styles.descriptionInput,
                ]}
              />
            </View>
      
            {/* CREATE */}
            <Pressable
              style={styles.createButton}
              onPress={handleSaveTrip}
            >
              <View>
                <Text style={styles.createEyebrow}>
                  BEGIN PLANNING
                </Text>
      
                <Text style={styles.createText}>
                  CREATE ADVENTURE
                </Text>
              </View>
      
              <Text style={styles.createArrow}>
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
  
    intro: {
      padding: theme.spacing.md,
  
      marginBottom: theme.spacing.xl,
  
      backgroundColor: theme.colours.surface,
  
      borderLeftWidth: 3,
      borderLeftColor: theme.colours.accent,
  
      borderRadius: theme.radius.sm,
    },
  
    introTitle: {
      fontFamily: theme.fonts.displayBold,
      fontSize: theme.fontSize.lg,
  
      color: theme.colours.text,
  
      letterSpacing: 1,
    },
  
    introText: {
      marginTop: theme.spacing.xs,
  
      fontFamily: theme.fonts.body,
      fontSize: theme.fontSize.xs,
  
      lineHeight: 18,
  
      color: theme.colours.textMuted,
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
      flex: 1,
  
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
      minHeight: 52,
  
      justifyContent: "center",
  
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
  
    descriptionInput: {
      height: 130,
  
      paddingTop: theme.spacing.md,
  
      textAlignVertical: "top",
    },
  
    createButton: {
      minHeight: 70,
  
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
  
      paddingHorizontal: theme.spacing.md,
  
      marginTop: theme.spacing.xl,
  
      backgroundColor: theme.colours.accent,
  
      borderRadius: theme.radius.md,
    },
  
    createEyebrow: {
      fontFamily: theme.fonts.bodyBold,
      fontSize: 8,
  
      color: theme.colours.background,
  
      letterSpacing: 1.5,
    },
  
    createText: {
      marginTop: 2,
  
      fontFamily: theme.fonts.displayBold,
      fontSize: theme.fontSize.lg,
  
      color: theme.colours.background,
  
      letterSpacing: 1,
    },
  
    createArrow: {
      fontFamily: theme.fonts.displayBold,
      fontSize: theme.fontSize.xxl,
  
      color: theme.colours.background,
    },
  });