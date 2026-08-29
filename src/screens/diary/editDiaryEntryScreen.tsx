import { InputField } from "@/components/forms/InputField";
import { SectionLabel } from "@/components/forms/SectionLabel";
import { DiaryEntry } from "@/models/DiaryEntry";
import { useAppServices } from "@/utils/useAppServiceProvider";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    Image,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { theme } from "@/app/theme";

export default function EditDiaryEntryScreen() {
  const { diaryEntryId } =
    useLocalSearchParams<{
      diaryEntryId: string;
    }>();

  const { diaryEntryServices } = useAppServices();

  const [entry, setEntry] =
    useState<DiaryEntry | null>(null);

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);

  useEffect(() => {
    async function loadEntry() {
      if (!diaryEntryId) {
        return;
      }

      try {
        const result =
          await diaryEntryServices.getDiaryEntry(diaryEntryId);

        if (!result) {
          Alert.alert(
            "Diary entry not found",
            "This diary entry could not be found."
          );
          router.back();
          return;
        }

        setEntry(result);
        setTitle(result.title);
        setText(result.text ?? "");

        setPhotos(
          [
            result.photo1,
            result.photo2,
            result.photo3,
          ].filter(
            (photo): photo is string => photo !== null
          )
        );
      } catch {
        Alert.alert(
          "Could not load diary entry",
          "Something went wrong while loading the diary entry."
        );
        router.back();
      }
    }

    loadEntry();
  }, [diaryEntryId]);

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
    if (!entry) {
      return;
    }

    if (!title.trim()) {
      Alert.alert(
        "Missing title",
        "Please give your diary entry a title."
      );
      return;
    }

    const updatedEntry: DiaryEntry = {
      ...entry,

      title: title.trim(),
      text: text.trim() || null,

      photo1: photos[0] ?? null,
      photo2: photos[1] ?? null,
      photo3: photos[2] ?? null,

      updatedAt: new Date().toISOString(),
    };

    try {
      await diaryEntryServices.updateDiaryEntry(updatedEntry);
      router.back();
    } catch {
      Alert.alert(
        "Could not save diary entry",
        "Something went wrong while saving your changes."
      );
    }
  }

  function handleDelete() {
    Alert.alert(
      "Delete diary entry?",
      "This memory will be permanently deleted.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: deleteEntry,
        },
      ]
    );
  }

  async function deleteEntry() {
    if (!diaryEntryId) {
      return;
    }

    try {
      await diaryEntryServices.deleteDiaryEntry(
        diaryEntryId
      );

      router.back();
    } catch {
      Alert.alert(
        "Could not delete diary entry",
        "Something went wrong while deleting the entry."
      );
    }
  }

  if (!entry) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loading}>
          Loading...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>EDIT DIARY ENTRY</Text>

        <SectionLabel title="ENTRY" />

        <InputField
          label="Title"
          value={title}
          onChangeText={setTitle}
          placeholder="A day worth remembering"
        />

        <View style={styles.textContainer}>
          <Text style={styles.textLabel}>Story</Text>

          <Text style={styles.optional}>
            OPTIONAL
          </Text>

          <View style={styles.textInputWrapper}>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="What happened today?"
              placeholderTextColor={
                theme.colours.textMuted
              }
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
                onPress={() =>
                  handleRemovePhoto(index)
                }
                style={styles.removeButton}
              >
                <Text style={styles.removeText}>
                  ×
                </Text>
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
              <Text style={styles.addPhotoIcon}>
                +
              </Text>

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
            SAVE CHANGES
          </Text>
        </Pressable>

        <Pressable
          onPress={handleDelete}
          style={({ pressed }) => [
            styles.deleteButton,
            pressed && styles.deleteButtonPressed,
          ]}
        >
          <Text style={styles.deleteText}>
            DELETE ENTRY
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

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

  loading: {
    margin: theme.spacing.md,
    fontFamily: theme.fonts.body,
    color: theme.colours.textSecondary,
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

  deleteButton: {
    marginTop: theme.spacing.md,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.colours.border,
    borderRadius: theme.radius.md,
  },

  deleteButtonPressed: {
    opacity: 0.6,
  },

  deleteText: {
    fontFamily: theme.fonts.displayBold,
    fontSize: theme.fontSize.sm,
    letterSpacing: 1.5,
    color: theme.colours.textMuted,
  },
});