import { InputField } from "@/components/forms/InputField";
import { SectionLabel } from "@/components/forms/SectionLabel";
import { DiaryEntry } from "@/models/DiaryEntry";
import { useAppServices } from "@/utils/useRepository/useAppServiceProvider";
import * as Crypto from "expo-crypto";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { theme } from "@/styling/theme";

export default function CreateDiaryEntryScreen() {
  const { dayId } = useLocalSearchParams<{
    dayId?: string;
  }>();

  const { diaryEntryServices } = useAppServices();

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);

  async function handleAddPhoto() {
    if (photos.length >= 3) {
      Alert.alert(
        "Photo limit",
        "A diary entry can contain up to three photos."
      );
      return;
    }

    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permission required",
        "Please allow access to your photos to add pictures to your diary."
      );
      return;
    }

    const result =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 0.85,
      });

    if (result.canceled) {
      return;
    }

    const uri = result.assets[0]?.uri;

    if (!uri) {
      return;
    }

    setPhotos((current) => [...current, uri]);
  }

  function handleRemovePhoto(index: number) {
    setPhotos((current) =>
      current.filter((_, photoIndex) => photoIndex !== index)
    );
  }

  async function handleSave() {
    if (!title.trim()) {
      Alert.alert(
        "Missing title",
        "Please give your diary entry a title."
      );
      return;
    }

    const now = new Date().toISOString();

    const newEntry: DiaryEntry = {
      id: Crypto.randomUUID(),
      dayId: dayId ?? null,
      title: title.trim(),
      text: text.trim() || null,

      photo1: photos[0] ?? null,
      photo2: photos[1] ?? null,
      photo3: photos[2] ?? null,

      createdAt: now,
      updatedAt: now,
    };

    try {
      await diaryEntryServices.createDiaryEntry(newEntry);
      router.back();
    } catch {
      Alert.alert(
        "Could not save diary entry",
        "Something went wrong while saving your diary entry."
      );
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>NEW DIARY ENTRY</Text>

        <SectionLabel title="ENTRY" />

        <InputField
          label="Title"
          value={title}
          onChangeText={setTitle}
          placeholder="A day worth remembering"
        />

        <View style={styles.textContainer}>
          <Text style={styles.textLabel}>Story</Text>

          <Text
            style={styles.optional}
          >
            OPTIONAL
          </Text>

          <View style={styles.textInputWrapper}>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="What happened today?"
              placeholderTextColor={theme.colours.textMuted}
              multiline
              textAlignVertical="top"
              style={styles.textInput}
            />
          </View>
        </View>

        <SectionLabel title="PHOTOS" />

        <View style={styles.photoGrid}>
          {photos.map((uri, index) => (
            <View
              key={`${uri}-${index}`}
              style={styles.photoContainer}
            >
              <Image
                source={{ uri }}
                style={styles.photo}
              />

              <Pressable
                onPress={() => handleRemovePhoto(index)}
                style={styles.removeButton}
              >
                <Text style={styles.removeText}>×</Text>
              </Pressable>
            </View>
          ))}

          {photos.length < 3 && (
            <Pressable
              onPress={handleAddPhoto}
              style={({ pressed }) => [
                styles.addPhoto,
                pressed && styles.addPhotoPressed,
              ]}
            >
              <Text style={styles.addPhotoIcon}>+</Text>
              <Text style={styles.addPhotoText}>
                ADD PHOTO
              </Text>
            </Pressable>
          )}
        </View>

        <Text style={styles.photoHint}>
          {photos.length}/3 photos
        </Text>

        <Pressable
          onPress={handleSave}
          style={({ pressed }) => [
            styles.saveButton,
            pressed && styles.saveButtonPressed,
          ]}
        >
          <Text style={styles.saveText}>
            SAVE ENTRY
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

import { Image, TextInput } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colours.background,
  },

  content: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },

  title: {
    fontFamily: theme.fonts.displayBold,
    fontSize: theme.fontSize.xl,
    color: theme.colours.text,
    marginBottom: theme.spacing.lg,
  },

  textContainer: {
    marginTop: theme.spacing.md,
  },

  textLabel: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: theme.fontSize.sm,
    color: theme.colours.text,
  },

  optional: {
    position: "absolute",
    right: 0,
    top: 2,
    fontFamily: theme.fonts.bodyBold,
    fontSize: theme.fontSize.xs,
    letterSpacing: 1,
    color: theme.colours.textMuted,
  },

  textInputWrapper: {
    marginTop: theme.spacing.xs,
    minHeight: 140,
    borderWidth: 1,
    borderColor: theme.colours.border,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colours.surface,
  },

  textInput: {
    flex: 1,
    minHeight: 140,
    padding: theme.spacing.md,
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSize.md,
    color: theme.colours.text,
  },

  photoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },

  photoContainer: {
    width: 100,
    height: 100,
    position: "relative",
  },

  photo: {
    width: "100%",
    height: "100%",
    borderRadius: theme.radius.md,
  },

  removeButton: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colours.background,
    borderWidth: 1,
    borderColor: theme.colours.border,
  },

  removeText: {
    fontFamily: theme.fonts.displayBold,
    fontSize: theme.fontSize.md,
    color: theme.colours.text,
    lineHeight: 22,
  },

  addPhoto: {
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: theme.colours.border,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colours.surface,
  },

  addPhotoPressed: {
    backgroundColor: theme.colours.surfaceRaised,
    borderColor: theme.colours.accent,
  },

  addPhotoIcon: {
    fontFamily: theme.fonts.displayBold,
    fontSize: theme.fontSize.xl,
    color: theme.colours.accent,
  },

  addPhotoText: {
    marginTop: 2,
    fontFamily: theme.fonts.bodyBold,
    fontSize: theme.fontSize.xs,
    letterSpacing: 1,
    color: theme.colours.textSecondary,
  },

  photoHint: {
    marginTop: theme.spacing.xs,
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSize.xs,
    color: theme.colours.textMuted,
  },

  saveButton: {
    marginTop: theme.spacing.xl,
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.md,
    backgroundColor: theme.colours.accent,
  },

  saveButtonPressed: {
    opacity: 0.75,
  },

  saveText: {
    fontFamily: theme.fonts.displayBold,
    fontSize: theme.fontSize.md,
    letterSpacing: 1.5,
    color: theme.colours.background,
  },
});
