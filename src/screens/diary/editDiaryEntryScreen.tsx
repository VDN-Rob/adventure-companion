import { InputField } from "@/components/forms/InputField";
import { SectionLabel } from "@/components/forms/SectionLabel";
import { getTranslations } from "@/i18n";
import { DiaryEntry } from "@/models/DiaryEntry";
import { useAppSettings } from "@/providers/AppSettingsProvider";
import { theme } from "@/styling/theme";
import { useAppServices } from "@/utils/useRepository/useAppServiceProvider";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditDiaryEntryScreen() {
	const { diaryEntryId } = useLocalSearchParams<{diaryEntryId: string;}>();

	const { diaryEntryServices } = useAppServices();

	const [entry, setEntry] = useState<DiaryEntry | null>(null);

	const [title, setTitle] = useState("");
	const [text, setText] = useState("");
	const [photos, setPhotos] = useState<string[]>([]);

	const { settings } = useAppSettings();
	const t = getTranslations(settings.language);

	useEffect(() => {
    async function loadEntry() {
        if (!diaryEntryId) {
            return;
        }

        try {
            const result =
                await diaryEntryServices.getDiaryEntryById(
                    diaryEntryId,
                );

            if (!result) {
                Alert.alert(
                    t.alerts.diaryEntryNotFound.title,
                    t.alerts.diaryEntryNotFound.message,
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
                    (photo): photo is string =>
                        photo !== null,
                ),
            );
        } catch {
            Alert.alert(
                t.alerts.couldNotLoadDiaryEntry.title,
                t.alerts.couldNotLoadDiaryEntry.message,
            );

            router.back();
        }
    }

    loadEntry();
}, [diaryEntryId]);

async function handleAddPhoto() {
    if (photos.length >= 3) {
        Alert.alert(
            t.alerts.photoLimit.title,
            t.alerts.photoLimit.message,
        );
        return;
    }

    const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
        Alert.alert(
            t.alerts.photoPermissionRequired.title,
            t.alerts.photoPermissionRequired.message,
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

    setPhotos((current) => [
        ...current,
        uri,
    ]);
}

function handleRemovePhoto(index: number) {
    setPhotos((current) =>
        current.filter(
            (_, photoIndex) =>
                photoIndex !== index,
        ),
    );
}

async function handleSave() {
    if (!entry) {
        return;
    }

    if (!title.trim()) {
        Alert.alert(
            t.alerts.missingDiaryTitle.title,
            t.alerts.missingDiaryTitle.message,
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
        await diaryEntryServices.updateDiaryEntry(
            updatedEntry,
        );

        router.back();
    } catch {
        Alert.alert(
            t.alerts.couldNotSaveDiaryEntryChanges.title,
            t.alerts.couldNotSaveDiaryEntryChanges.message,
        );
    }
}

function handleDelete() {
    Alert.alert(
        t.diary.deleteConfirmation.title,
        t.diary.deleteConfirmation.message,
        [
            {
                text: t.diary.deleteConfirmation.cancel,
                style: "cancel",
            },
            {
                text: t.diary.deleteConfirmation.confirm,
                style: "destructive",
                onPress: deleteEntry,
            },
        ],
    );
}

async function deleteEntry() {
    if (!diaryEntryId) {
        return;
    }

    try {
        await diaryEntryServices.deleteDiaryEntry(
            diaryEntryId,
        );

        router.back();
    } catch {
        Alert.alert(
            t.alerts.couldNotDeleteDiaryEntry.title,
            t.alerts.couldNotDeleteDiaryEntry.message,
        );
    }
}

if (!entry) {
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.loading}>
                {t.diary.loading}
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
            <Text style={styles.title}>
                {t.diary.editEntry}
            </Text>

            <SectionLabel title={t.diary.entry} />

            <InputField
                label={t.diary.title}
                value={title}
                onChangeText={setTitle}
                placeholder={
                    t.diary.titlePlaceholder
                }
            />

            <View style={styles.textContainer}>
                <Text style={styles.textLabel}>
                    {t.diary.story}
                </Text>

                <Text style={styles.optional}>
                    {t.diary.optional}
                </Text>

                <View style={styles.textInputWrapper}>
                    <TextInput
                        value={text}
                        onChangeText={setText}
                        placeholder={
                            t.diary.storyPlaceholder
                        }
                        placeholderTextColor={
                            theme.colours.textMuted
                        }
                        multiline
                        textAlignVertical="top"
                        style={styles.textInput}
                    />
                </View>
            </View>

            <SectionLabel title={t.diary.photos} />

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
                            pressed &&
                                styles.addPhotoPressed,
                        ]}
                    >
                        <Text style={styles.addPhotoIcon}>
                            +
                        </Text>

                        <Text style={styles.addPhotoText}>
                            {t.diary.addPhoto}
                        </Text>
                    </Pressable>
                )}
            </View>

            <Text style={styles.photoHint}>
                {t.diary.photoCount(photos.length)}
            </Text>

            <Pressable
                onPress={handleSave}
                style={({ pressed }) => [
                    styles.saveButton,
                    pressed &&
                        styles.saveButtonPressed,
                ]}
            >
                <Text style={styles.saveText}>
                    {t.diary.saveChanges}
                </Text>
            </Pressable>

            <Pressable
                onPress={handleDelete}
                style={({ pressed }) => [
                    styles.deleteButton,
                    pressed &&
                        styles.deleteButtonPressed,
                ]}
            >
                <Text style={styles.deleteText}>
                    {t.diary.deleteEntry}
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