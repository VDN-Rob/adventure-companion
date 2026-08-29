import { Trip } from "@/models/Trip";
import { useAppServices } from "@/utils/useAppServiceProvider";
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

import { theme } from "@/app/theme";
import { InputField } from "@/components/forms/InputField";
import { SectionLabel } from "@/components/forms/SectionLabel";
import { GameModal } from "@/components/GameModal";

export default function EditTripScreen() {
    // Retrieve id from parameters
    const { id } = useLocalSearchParams<{ id: string }>();

    // Load databank
    const { tripServices } = useAppServices();

    // State
    const [trip, setTrip] = useState<Trip>();
    const [name, setName] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [description, setDescription] = useState("");
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);

    // Load the right trip when screen finishes loading
    useEffect(() => {
        async function loadTrip() {
          if (trip) {
            setTrip(trip);
            setName(trip.name);
            setStartDate(trip.startDate);
            setEndDate(trip.endDate ?? "");
            setDescription(trip.description ?? "");
          }
        }

        loadTrip()
    }, [id]);

    async function handleSave() {
      if (!trip) return;
    
      if (name.trim() === "") {
        Alert.alert(
          "Missing adventure name",
          "Your adventure needs a name."
        );
        return;
      }
    
      if (startDate.trim() === "") {
        Alert.alert(
          "Missing start date",
          "Please enter a start date."
        );
        return;
      }
    
      if (
        endDate.trim() !== "" &&
        endDate.trim() < startDate.trim()
      ) {
        Alert.alert(
          "Invalid dates",
          "The end date cannot be before the start date."
        );
        return;
      }
    
      const updatedTrip: Trip = {
        ...trip,
        name: name.trim(),
        startDate: startDate.trim(),
        endDate: endDate.trim() === "" ? null : endDate.trim(),
        description: description.trim() === "" ? null : description.trim(),
      };
    
      await tripServices.updateTrip(updatedTrip);
    
      router.back();
    }

    function handleDeleteTrip() {
      Alert.alert(
        "DELETE ADVENTURE?",
        "All days, points of interest and other data belonging to this adventure will be deleted. This cannot be undone.",
        [
          {
            text: "CANCEL",
            style: "cancel",
          },
          {
            text: "DELETE",
            style: "destructive",
            onPress: async () => {
              if (!id) return;
    
              await tripServices.deleteTrip(id);
    
              router.dismiss(2);
            },
          },
        ]
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
              <Text style={styles.backArrow}>←</Text>
            </Pressable>
    
            <View>
              <Text style={styles.eyebrow}>
                ADVENTURE SYSTEM
              </Text>
    
              <Text style={styles.headerTitle}>
                EDIT ADVENTURE
              </Text>
            </View>
          </View>
    
          {/* CURRENT ADVENTURE */}
          <View style={styles.currentTrip}>
            <Text style={styles.currentLabel}>
              CURRENT ADVENTURE
            </Text>
    
            <Text style={styles.currentName}>
              {trip?.name}
            </Text>
          </View>
    
          {/* DETAILS */}
          <SectionLabel title="ADVENTURE DETAILS" />
    
          <InputField
            label="NAME"
            value={name}
            onChangeText={setName}
            placeholder="Adventure name"
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
              placeholder="Describe this adventure..."
              placeholderTextColor={theme.colours.textMuted}
              multiline
              textAlignVertical="top"
              style={[
                styles.input,
                styles.descriptionInput,
              ]}
            />
          </View>
    
          {/* SAVE */}
          <Pressable
            style={styles.saveButton}
            onPress={handleSave}
          >
            <Text style={styles.saveText}>
              SAVE CHANGES
            </Text>
    
            <Text style={styles.saveArrow}>
              ✓
            </Text>
          </Pressable>
    
          {/* DANGER ZONE */}
          <View style={styles.dangerSection}>
            <SectionLabel title="DANGER ZONE" />
    
            <Text style={styles.dangerDescription}>
              Permanently remove this adventure and
              its associated data.
            </Text>
    
            <Pressable
              style={styles.deleteButton}
              onPress={() => setDeleteModalVisible(true)}
            >
              <Text style={styles.deleteText}>
                DELETE ADVENTURE
              </Text>
    
              <Text style={styles.deleteSymbol}>
                ×
              </Text>
            </Pressable>
          </View>
        </ScrollView>
        <GameModal
          visible={deleteModalVisible}
          title="DELETE ADVENTURE?"
          message="This adventure and its planned days, POIs and other data will be permanently removed. This action cannot be undone."
          confirmText="DELETE"
          cancelText="KEEP IT"
          destructive
          onCancel={() => setDeleteModalVisible(false)}
          onConfirm={async () => {
            if (!id) return;

            setDeleteModalVisible(false);

            await tripServices.deleteTrip(id);

            router.dismiss(2);
          }}
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

  currentTrip: {
    padding: theme.spacing.md,

    marginBottom: theme.spacing.xl,

    backgroundColor: theme.colours.surface,

    borderWidth: 1,
    borderColor: theme.colours.border,

    borderRadius: theme.radius.md,
  },

  currentLabel: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: 8,

    color: theme.colours.textMuted,

    letterSpacing: 1.5,
  },

  currentName: {
    marginTop: theme.spacing.xs,

    fontFamily: theme.fonts.displayBold,
    fontSize: theme.fontSize.xl,

    color: theme.colours.text,
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

  dangerSection: {
    marginTop: theme.spacing.xxl,
  },

  dangerDescription: {
    marginBottom: theme.spacing.sm,

    fontFamily: theme.fonts.body,
    fontSize: theme.fontSize.xs,

    lineHeight: 18,

    color: theme.colours.textMuted,
  },

  deleteButton: {
    minHeight: 52,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1,
    borderColor: theme.colours.border,

    borderRadius: theme.radius.md,
  },

  deleteText: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: theme.fontSize.xs,

    color: theme.colours.textMuted,

    letterSpacing: 1.5,
  },

  deleteSymbol: {
    marginLeft: theme.spacing.sm,

    fontFamily: theme.fonts.displayBold,
    fontSize: theme.fontSize.xl,

    color: theme.colours.textMuted,
  },
});