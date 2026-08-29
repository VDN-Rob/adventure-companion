import { InputField } from "@/components/forms/InputField";
import { POITypeSelector } from "@/components/forms/POITypeSelector";
import { SectionLabel } from "@/components/forms/SectionLabel";
import { GameModal } from "@/components/GameModal";
import { POI, POIType } from "@/models/POI";
import { theme } from "@/styling/theme";
import { useAppServices } from "@/utils/useAppServiceProvider";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

const examplePois: POI[] = [
  {
    id: "poi-00",
    dayId: "test-day-01",
    name: "Start in Oignies",
    type: "other",
    latitude: 50.023722,
    longitude: 4.639699,
    notes: "Starting point og the adventure",
    visitedAt: null
  },
  {
    id: "poi-01",
    dayId: "test-day-01",
    name: "Forest Spring",
    type: "water",
    latitude: 49.82,
    longitude: 4.62,
    notes: "Small spring beside the trail.",
    visitedAt: null
  },
  {
    id: "poi-02",
    dayId: "test-day-01",
    name: "La Petite Boulangerie",
    type: "food",
    latitude: 49.78,
    longitude: 4.71,
    notes: "Good place for breakfast and coffee.",
    visitedAt: null
  },
  {
    id: "poi-03",
    dayId: "test-day-01",
    name: "Intermarché",
    type: "supermarket",
    latitude: 49.75,
    longitude: 4.83,
    notes: "Last reliable resupply before the hills.",
    visitedAt: null
  },
  {
    id: "poi-04",
    dayId: "test-day-01",
    name: "Camping des Pins",
    type: "accommodation",
    latitude: 49.68,
    longitude: 4.91,
    notes: "Small campsite with showers.",
    visitedAt: null
  },
];

export default function EditPOIScreen() {
    // Retrieve id from parameters
    const { poiId } = useLocalSearchParams<{ poiId: string }>();

    // Load databank
    const { poiServices } = useAppServices();

    // State
    const [poi, setPoi] = useState<POI | null>(null);

    const [name, setName] = useState("");
    const [type, setType] = useState<POIType>("other");

    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");

    const [notes, setNotes] = useState("");

    const [deleteModalVisible, setDeleteModalVisible] = useState(false);

    // Load the right Poi everytime the screen is loaded
    useEffect(() => {
        async function loadPOI() {
            if (!poiId) return;

            const poi = await poiServices.getPOI(poiId);

            if (poi) {
              setPoi(poi);
            
              setName(poi.name);
              setType(poi.type);
            
              setLatitude(
                poi.latitude === null
                  ? ""
                  : String(poi.latitude)
              );
            
              setLongitude(
                poi.longitude === null
                  ? ""
                  : String(poi.longitude)
              );
            
              setNotes(poi.notes ?? "");
            }
        }

        // loadPOI();

        setPoi(examplePois[0]);
        if (poi) {
          setName(poi.name);
              setType(poi.type);
            
              setLatitude(
                poi.latitude === null
                  ? ""
                  : String(poi.latitude)
              );
            
              setLongitude(
                poi.longitude === null
                  ? ""
                  : String(poi.longitude)
              );
            
              setNotes(poi.notes ?? "");
            }
        }, [poiId]
    );
    
    async function handleSave() {
      if (!poi) return;
    
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
    
      const updatedPOI: POI = {
        ...poi,
        name: name.trim(),
        type,
    
        latitude: parsedLatitude,
        longitude: parsedLongitude,
    
        notes:
          notes.trim() === ""
            ? null
            : notes.trim(),
      };
    
      await poiServices.updatePOI(updatedPOI);
    
      router.back();
    }

    if (!poi) {
        return <Text>Loading...</Text>;
      }

      async function deletePOI() {
        if (!poiId) return;
      
        setDeleteModalVisible(false);
      
        await poiServices.deletePOI(poiId);
      
        router.back();
      }
        
      return (
        <KeyboardAvoidingView
          style={styles.container}
          behavior={
            Platform.OS === "ios"
              ? "padding"
              : undefined
          }
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
                  EDIT POI
                </Text>
              </View>
            </View>
      
            {/* DETAILS */}
      
            <SectionLabel title="WAYPOINT DETAILS" />
      
            <InputField
              label="NAME"
              value={name}
              onChangeText={setName}
              placeholder="Mountain café"
            />
      
            {/* TYPE */}
      
            <SectionLabel title="WAYPOINT TYPE" />
      
            <POITypeSelector
              value={type}
              onChange={setType}
            />
      
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
              Coordinates are optional.
            </Text>
      
            {/* NOTES */}
      
            <SectionLabel title="NOTES" />
      
            <View style={styles.notesWrapper}>
              <TextInput
                value={notes}
                onChangeText={setNotes}
                placeholder="What should you remember about this place?"
                placeholderTextColor={theme.colours.textMuted}
                multiline
                textAlignVertical="top"
                style={styles.notesInput}
              />
            </View>
      
            {/* SAVE */}
      
            <Pressable
              style={styles.saveButton}
              onPress={handleSave}
            >
              <View>
                <Text style={styles.saveEyebrow}>
                  WAYPOINT DATA
                </Text>
      
                <Text style={styles.saveText}>
                  SAVE CHANGES
                </Text>
              </View>
      
              <Text style={styles.saveSymbol}>
                ✓
              </Text>
            </Pressable>
      
            {/* DELETE */}
      
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
                    DELETE POI
                  </Text>
      
                  <Text style={styles.deleteDescription}>
                    Permanently remove this waypoint.
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
            title="DELETE POI?"
            message="This point of interest will be permanently removed from the day. This action cannot be undone."
            confirmText="DELETE"
            cancelText="KEEP POI"
            destructive
            onCancel={() => setDeleteModalVisible(false)}
            onConfirm={deletePOI}
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

  locationHint: {
    marginTop: -theme.spacing.xs,
    marginBottom: theme.spacing.lg,

    fontFamily: theme.fonts.body,
    fontSize: 9,

    color: theme.colours.textMuted,
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
    marginTop: theme.spacing.xl,

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
});