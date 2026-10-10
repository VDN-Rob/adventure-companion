import { InputField } from "@/components/forms/InputField";
import { ChoiceModal } from "@/components/modals/ChoiceModal";
import { POITypeSelector } from "@/components/oldForms/POITypeSelector";
import { SectionLabel } from "@/components/UI/SectionLabel";
import { getTranslations } from "@/i18n";
import { POI, POIType } from "@/models/POI";
import { useAppSettings } from "@/providers/AppSettingsProvider";
import { theme } from "@/styling/theme";
import { useAppServices } from "@/utils/useRepository/useAppServiceProvider";
import { validatePOIFields } from "@/utils/validation/poiValidation";
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
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditPOIScreen() {
    const { poiId } =
        useLocalSearchParams<{ poiId: string }>();

    const { poiServices } = useAppServices();

    const [poi, setPoi] = useState<POI | null>(null);

    const [name, setName] = useState("");
    const [type, setType] =
        useState<POIType>("other");

    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");

    const [notes, setNotes] = useState("");

    const [deleteModalVisible, setDeleteModalVisible] =
        useState(false);

    const { settings } = useAppSettings();
    const t = getTranslations(settings.language);

    const poiTypeOptions = [
        {
            type: "food" as POIType,
            label: t.poi.types.food.label,
            symbol: "🍴",
            description:
                t.poi.types.food.description,
        },
        {
            type: "water" as POIType,
            label: t.poi.types.water.label,
            symbol: "◆",
            description:
                t.poi.types.water.description,
        },
        {
            type: "supermarket" as POIType,
            label: t.poi.types.supermarket.label,
            symbol: "▣",
            description:
                t.poi.types.supermarket.description,
        },
        {
            type: "accommodation" as POIType,
            label: t.poi.types.accommodation.label,
            symbol: "▲",
            description:
                t.poi.types.accommodation.description,
        },
        {
            type: "other" as POIType,
            label: t.poi.types.other.label,
            symbol: "●",
            description:
                t.poi.types.other.description,
        },
    ];

    useEffect(() => {
        async function loadPOI() {
            if (!poiId) {
                return;
            }

            const loadedPOI =
                await poiServices.getPOIById(poiId);

            if (loadedPOI) {
                setPoi(loadedPOI);

                setName(loadedPOI.name);
                setType(loadedPOI.type);

                setLatitude(
                    loadedPOI.latitude === null
                        ? ""
                        : String(loadedPOI.latitude),
                );

                setLongitude(
                    loadedPOI.longitude === null
                        ? ""
                        : String(loadedPOI.longitude),
                );

                setNotes(loadedPOI.notes ?? "");
            }
        }

        loadPOI();
    }, [poiId, poiServices]);

    async function handleSave() {
        if (!poi) return;

        const errors = validatePOIFields({
            name,
            latitude,
            longitude,
            visitedAt: "",
        });

        const firstError =
            Object.values(errors)[0];

        if (firstError) {
            Alert.alert(
                t.alerts.invalidPoi.title,
                firstError,
            );
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

        const result =
            await poiServices.updatePOI(updatedPOI);

        if (!result.success) {
            const firstServiceError =
                Object.values(result.errors)[0];

            Alert.alert(
                t.alerts.couldNotSavePOI.title,
                firstServiceError ??
                    t.alerts.couldNotSavePOI
                        .fallbackMessage,
            );

            return;
        }

        router.back();
    }

    async function deletePOI() {
        if (!poiId) return;

        setDeleteModalVisible(false);

        await poiServices.deletePOI(poiId);

        router.back();
    }

    if (!poi) {
        return (
            <Text>
                {t.poi.loading}
            </Text>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={
                    Platform.OS === "ios"
                        ? "padding"
                        : undefined
                }
            >
                <ScrollView
                    contentContainerStyle={
                        styles.content
                    }
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* HEADER */}

                    <View style={styles.header}>
                        <Pressable
                            style={styles.backButton}
                            onPress={() =>
                                router.back()
                            }
                        >
                            <Text style={styles.backArrow}>
                                ←
                            </Text>
                        </Pressable>

                        <View>
                            <Text style={styles.eyebrow}>
                                {t.poi.adventurePlanner}
                            </Text>

                            <Text
                                style={
                                    styles.headerTitle
                                }
                            >
                                {t.poi.editPoi}
                            </Text>
                        </View>
                    </View>

                    {/* DETAILS */}

                    <SectionLabel
                        title={t.poi.waypointDetails}
                    />

                    <InputField
                        label={t.poi.name}
                        value={name}
                        onChangeText={setName}
                        placeholder={
                            t.poi.namePlaceholder
                        }
                    />

                    {/* TYPE */}

                    <SectionLabel
                        title={t.poi.waypointType}
                    />

                    <POITypeSelector
                        value={type}
                        onChange={setType}
                        options={poiTypeOptions}
                    />

                    {/* LOCATION */}

                    <SectionLabel
                        title={t.poi.location}
                    />

                    <View style={styles.row}>
                        <View style={styles.half}>
                            <InputField
                                label={t.poi.latitude}
                                value={latitude}
                                onChangeText={
                                    setLatitude
                                }
                                placeholder={
                                    t.poi
                                        .latitudePlaceholder
                                }
                                keyboardType="numbers-and-punctuation"
                            />
                        </View>

                        <View
                            style={styles.rowGap}
                        />

                        <View style={styles.half}>
                            <InputField
                                label={
                                    t.poi.longitude
                                }
                                value={longitude}
                                onChangeText={
                                    setLongitude
                                }
                                placeholder={
                                    t.poi
                                        .longitudePlaceholder
                                }
                                keyboardType="numbers-and-punctuation"
                            />
                        </View>
                    </View>

                    <Text style={styles.locationHint}>
                        {t.poi.locationHintShort}
                    </Text>

                    {/* NOTES */}

                    <SectionLabel
                        title={t.poi.notes}
                    />

                    <View style={styles.notesWrapper}>
                        <TextInput
                            value={notes}
                            onChangeText={setNotes}
                            placeholder={
                                t.poi.notesPlaceholder
                            }
                            placeholderTextColor={
                                theme.colours.textMuted
                            }
                            multiline
                            textAlignVertical="top"
                            style={
                                styles.notesInput
                            }
                        />
                    </View>

                    {/* SAVE */}

                    <Pressable
                        style={styles.saveButton}
                        onPress={handleSave}
                    >
                        <View>
                            <Text
                                style={
                                    styles.saveEyebrow
                                }
                            >
                                {t.poi.waypointData}
                            </Text>

                            <Text style={styles.saveText}>
                                {t.poi.saveChanges}
                            </Text>
                        </View>

                        <Text style={styles.saveSymbol}>
                            ✓
                        </Text>
                    </Pressable>

                    {/* DELETE */}

                    <View style={styles.dangerSection}>
                        <Text style={styles.dangerLabel}>
                            {t.poi.dangerZone}
                        </Text>

                        <Pressable
                            style={
                                styles.deleteButton
                            }
                            onPress={() =>
                                setDeleteModalVisible(
                                    true,
                                )
                            }
                        >
                            <View>
                                <Text
                                    style={
                                        styles.deleteTitle
                                    }
                                >
                                    {t.poi.deletePoi}
                                </Text>

                                <Text
                                    style={
                                        styles.deleteDescription
                                    }
                                >
                                    {
                                        t.poi
                                            .deleteDescription
                                    }
                                </Text>
                            </View>

                            <Text
                                style={
                                    styles.deleteSymbol
                                }
                            >
                                ×
                            </Text>
                        </Pressable>
                    </View>
                </ScrollView>

                <ChoiceModal
                    visible={
                        deleteModalVisible
                    }
                    title={
                        t.poi.deleteConfirmation
                            .title
                    }
                    message={
                        t.poi.deleteConfirmation
                            .message
                    }
                    confirmText={
                        t.poi.deleteConfirmation
                            .confirm
                    }
                    cancelText={
                        t.poi.deleteConfirmation
                            .cancel
                    }
                    destructive
                    onCancel={() =>
                        setDeleteModalVisible(
                            false,
                        )
                    }
                    onConfirm={deletePOI}
                />
            </KeyboardAvoidingView>
        </SafeAreaView>
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