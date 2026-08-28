import { POI, POIType } from "@/models/POI";
import { useAppServices } from "@/utils/useAppServiceProvider";
import * as Crypto from "expo-crypto";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { theme } from "@/app/theme";
import { InputField } from "@/components/forms/InputField";
import { SectionLabel } from "@/components/forms/SectionLabel";

const POI_TYPES: {
  type: POIType;
  label: string;
  symbol: string;
  description: string;
}[] = [
  {
    type: "food",
    label: "FOOD",
    symbol: "🍴",
    description: "Restaurant, café or meal stop",
  },
  {
    type: "water",
    label: "WATER",
    symbol: "◆",
    description: "Spring, fountain or refill",
  },
  {
    type: "supermarket",
    label: "SHOP",
    symbol: "▣",
    description: "Supplies and groceries",
  },
  {
    type: "accommodation",
    label: "CAMP",
    symbol: "▲",
    description: "Hotel, campsite or shelter",
  },
  {
    type: "other",
    label: "OTHER",
    symbol: "●",
    description: "Anything else worth marking",
  },
];

export default function CreatePoiScreen() {
    // Retrieve id from parameters
    const { dayId } = useLocalSearchParams<{ dayId: string }>();

    const [name, setName] = useState("");
    const [type, setType] = useState<POIType>("other");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [notes, setNotes] = useState("");

    const { poiServices } = useAppServices();

    async function handleSavePOI() {
        if (!dayId) {
          return;
        }
      
        if (name.trim() === "") {
          return;
        }
      
        const parsedLatitude =
          latitude.trim() === ""
            ? null
            : Number(latitude);
      
        const parsedLongitude =
          longitude.trim() === ""
            ? null
            : Number(longitude);
      
        if (
          parsedLatitude !== null &&
          (
            Number.isNaN(parsedLatitude) ||
            parsedLatitude < -90 ||
            parsedLatitude > 90
          )
        ) {
          return;
        }
      
        if (
          parsedLongitude !== null &&
          (
            Number.isNaN(parsedLongitude) ||
            parsedLongitude < -180 ||
            parsedLongitude > 180
          )
        ) {
          return;
        }
      
        const newPoi: POI = {
          id: Crypto.randomUUID(),
          dayId,
          name: name.trim(),
          type,
          latitude: parsedLatitude,
          longitude: parsedLongitude,
          notes: notes.trim() === ""
            ? null
            : notes.trim(),
        };
      
        await poiServices.createPOI(newPoi);
      
        router.back();
      }
    
      if (!dayId) {
        return (
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>
              NO DAY SELECTED
            </Text>
      
            <Text style={styles.errorText}>
              This point of interest cannot be created
              without a day.
            </Text>
      
            <Pressable
              style={styles.backButtonLarge}
              onPress={() => router.back()}
            >
              <Text style={styles.backButtonText}>
                GO BACK
              </Text>
            </Pressable>
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
                  NEW POI
                </Text>
              </View>
            </View>
      
            {/* INTRO */}
            <View style={styles.intro}>
              <Text style={styles.introTitle}>
                MARK A WAYPOINT
              </Text>
      
              <Text style={styles.introText}>
                Add something worth remembering along
                today's route.
              </Text>
            </View>
      
            {/* NAME */}
            <SectionLabel title="WAYPOINT DETAILS" />
      
            <InputField
              label="NAME"
              value={name}
              onChangeText={setName}
              placeholder="Mountain café"
            />
      
            {/* TYPE */}
            <View style={styles.typeSection}>
              <Text style={styles.label}>
                TYPE
              </Text>
      
              <View style={styles.typeGrid}>
                {POI_TYPES.map((poiType) => {
                  const selected = type === poiType.type;
      
                  return (
                    <Pressable
                      key={poiType.type}
                      onPress={() => setType(poiType.type)}
                      style={[
                        styles.typeCard,
                        selected && styles.typeCardSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.typeSymbol,
                          selected && styles.typeSymbolSelected,
                        ]}
                      >
                        {poiType.symbol}
                      </Text>
      
                      <Text
                        style={[
                          styles.typeLabel,
                          selected && styles.typeLabelSelected,
                        ]}
                      >
                        {poiType.label}
                      </Text>
      
                      <Text
                        style={[
                          styles.typeDescription,
                          selected &&
                            styles.typeDescriptionSelected,
                        ]}
                      >
                        {poiType.description}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
      
            {/* LOCATION */}
            <SectionLabel title="LOCATION" />
      
            <View style={styles.row}>
              <View style={styles.half}>
                <InputField
                  label="LATITUDE"
                  value={latitude}
                  onChangeText={setLatitude}
                  placeholder="50.1234"
                  keyboardType="numbers-and-punctuation"
                />
              </View>
      
              <View style={styles.rowGap} />
      
              <View style={styles.half}>
                <InputField
                  label="LONGITUDE"
                  value={longitude}
                  onChangeText={setLongitude}
                  placeholder="4.5678"
                  keyboardType="numbers-and-punctuation"
                />
              </View>
            </View>
      
            <Text style={styles.locationHint}>
              Coordinates are optional. You can add them
              later when the route/map is ready.
            </Text>
      
            {/* NOTES */}
            <View style={styles.notesContainer}>
              <Text style={styles.label}>
                NOTES
              </Text>
      
              <TextInput
                value={notes}
                onChangeText={setNotes}
                placeholder="What should you remember about this place?"
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
              style={[
                styles.saveButton,
                name.trim() === "" && styles.saveButtonDisabled,
              ]}
              onPress={handleSavePOI}
              disabled={name.trim() === ""}
            >
              <View>
                <Text style={styles.saveEyebrow}>
                  ADD TO TODAY
                </Text>
      
                <Text style={styles.saveText}>
                  MARK WAYPOINT
                </Text>
              </View>
      
              <Text style={styles.saveArrow}>
                +
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
  
    /* POI TYPE SELECTOR */
  
    typeSection: {
      marginBottom: theme.spacing.xl,
    },
  
    typeGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
  
      gap: theme.spacing.sm,
    },
  
    typeCard: {
      width: "48%",
  
      minHeight: 125,
  
      padding: theme.spacing.sm,
  
      justifyContent: "center",
  
      backgroundColor: theme.colours.surface,
  
      borderWidth: 1,
      borderColor: theme.colours.border,
  
      borderRadius: theme.radius.md,
    },
  
    typeCardSelected: {
      borderColor: theme.colours.accent,
  
      backgroundColor: theme.colours.background,
    },
  
    typeSymbol: {
      marginBottom: 4,
  
      fontFamily: theme.fonts.displayBold,
      fontSize: 25,
  
      color: theme.colours.textMuted,
    },
  
    typeSymbolSelected: {
      color: theme.colours.accent,
    },
  
    typeLabel: {
      fontFamily: theme.fonts.displayBold,
      fontSize: theme.fontSize.md,
  
      color: theme.colours.textMuted,
  
      letterSpacing: 1,
    },
  
    typeLabelSelected: {
      color: theme.colours.text,
    },
  
    typeDescription: {
      marginTop: 3,
  
      fontFamily: theme.fonts.body,
      fontSize: 9,
  
      lineHeight: 13,
  
      color: theme.colours.textMuted,
    },
  
    typeDescriptionSelected: {
      color: theme.colours.textMuted,
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
  
    locationHint: {
      marginTop: -theme.spacing.xs,
      marginBottom: theme.spacing.lg,
  
      fontFamily: theme.fonts.body,
      fontSize: 9,
      lineHeight: 14,
  
      color: theme.colours.textMuted,
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
      minHeight: 70,
  
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
  
      paddingHorizontal: theme.spacing.md,
  
      marginTop: theme.spacing.xl,
  
      backgroundColor: theme.colours.accent,
  
      borderRadius: theme.radius.md,
    },
  
    saveButtonDisabled: {
      opacity: 0.35,
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
  
    saveArrow: {
      fontFamily: theme.fonts.displayBold,
      fontSize: theme.fontSize.xxl,
  
      color: theme.colours.background,
    },
  
    /* ERROR */
  
    errorContainer: {
      flex: 1,
  
      alignItems: "center",
      justifyContent: "center",
  
      padding: theme.spacing.xl,
  
      backgroundColor: theme.colours.background,
    },
  
    errorTitle: {
      fontFamily: theme.fonts.displayBold,
      fontSize: theme.fontSize.xl,
  
      color: theme.colours.text,
      letterSpacing: 1,
    },
  
    errorText: {
      marginTop: theme.spacing.sm,
      marginBottom: theme.spacing.lg,
  
      fontFamily: theme.fonts.body,
      fontSize: theme.fontSize.sm,
  
      textAlign: "center",
  
      color: theme.colours.textMuted,
    },
  
    backButtonLarge: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
  
      borderWidth: 1,
      borderColor: theme.colours.border,
      borderRadius: theme.radius.sm,
    },
  
    backButtonText: {
      fontFamily: theme.fonts.bodyBold,
      fontSize: theme.fontSize.xs,
  
      color: theme.colours.text,
  
      letterSpacing: 1.5,
    },
  });