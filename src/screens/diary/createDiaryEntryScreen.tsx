import { InputField } from "@/components/forms/InputField";
import { SectionLabel } from "@/components/forms/SectionLabel";
import { formatDate, getTodayDate } from "@/utils/date";
import { useAppServices } from "@/utils/useRepository/useAppServiceProvider";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
	Alert,
	Image,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	View,
} from "react-native";

import { getTranslations } from "@/i18n";
import { Trip } from "@/models/Trip";
import { useAppSettings } from "@/providers/AppSettingsProvider";
import { theme } from "@/styling/theme";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreateDiaryEntryScreen() {
	const { tripId } = useLocalSearchParams<{tripId?: string;}>();

	const { diaryEntryServices, tripServices } = useAppServices();

	const [trip, setTrip] = useState<Trip | null>(null);
	const [title, setTitle] = useState("");
	const [text, setText] = useState("");
	const [photos, setPhotos] = useState<string[]>([]);
	const [date, setDate] = useState<string>(getTodayDate());
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [isLoadingTrip, setIsLoadingTrip] = useState(true);

	const { settings } = useAppSettings();
	const t = getTranslations(settings.language);
	
	useEffect(() => {
		let cancelled = false;

		async function loadTrip() {
		if (!tripId) {
			setIsLoadingTrip(false);
			return;
		}

		try {
			const trips = await tripServices.getAllTrips();

			const selectedTrip = trips.find((item) => item.id === tripId) ?? null;

			if (cancelled) {
				return;
			}

			setTrip(selectedTrip);

			if (selectedTrip) {
				setDate(
					getDefaultDiaryDate(
					selectedTrip
					)
				);
			}
		} catch (error) {
			console.error(
			"Failed to load adventure:",
			error
			);
		} finally {
			if (!cancelled) {
				setIsLoadingTrip(false);
			}
		}
		}

		loadTrip();

		return () => {
			cancelled = true;
		};
	}, [tripId, tripServices]);

	async function handleAddPhoto() {
        if (photos.length >= 3) {
            Alert.alert(t.alerts.photoLimit.title, t.alerts.photoLimit.message);
            return;
        }

        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permission.granted) {
            Alert.alert(t.alerts.photoPermissionRequired.title, t.alerts.photoPermissionRequired.message);
            return;
        }

        const result =
            await ImagePicker.launchImageLibraryAsync(
                {
                    mediaTypes: ["images"],
                    allowsEditing: true,
                    quality: 0.85,
                },
            );

        if (result.canceled) {
            return;
        }

        const uri =
            result.assets[0]?.uri;

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
			photoIndex !== index
		)
		);
	}

	function handleDateChange(_: unknown, selectedDate: Date) {
		setDate(dateToDateString(selectedDate));

		setShowDatePicker(false);
	}

	function handleDateDismiss() {
		setShowDatePicker(false);
	}

	async function handleSave() {
        if (!tripId) {
            Alert.alert(t.alerts.missingAdventure.title,t.alerts.missingAdventure.message);
            return;
        }

        if (!trip) {
            Alert.alert(t.alerts.adventureUnavailable.title,t.alerts.adventureUnavailable.message);
            return;
        }

        if (!title.trim()) {
            Alert.alert(t.alerts.missingDiaryTitle.title,t.alerts.missingDiaryTitle.message);
            return;
        }

        if (date < trip.startDate || (trip.endDate !== null &&date > trip.endDate)) {
            Alert.alert(t.alerts.invalidDiaryDate.title,t.alerts.invalidDiaryDate.message);
            return;
        }

        try {
            setIsSaving(true);

            await diaryEntryServices.createDiaryEntry(
                {
                    tripId,
                    date,

                    title: title.trim(),
                    text: text.trim() || null,

                    photo1: photos[0] ?? null,
                    photo2: photos[1] ?? null,
                    photo3: photos[2] ?? null,
                },
            );

            router.back();
        } catch (error) {
            const message =error instanceof Error ? error.message : t.alerts.couldNotSaveDiaryEntry.message;

            if (message ==="A diary entry already exists for this date.") {
                Alert.alert(t.alerts.diaryEntryAlreadyExists.title, t.alerts.diaryEntryAlreadyExists.message);
				return;
            }

            console.error("Failed to create diary entry:", error);

            Alert.alert(t.alerts.couldNotSaveDiaryEntry.title, t.alerts.couldNotSaveDiaryEntry.message);
        } finally {
            setIsSaving(false);
        }
    }


	if (isLoadingTrip) {
		return (
		<SafeAreaView style={styles.container}>
			<View style={styles.loading}>
			<Text style={styles.loadingText}>
				{t.diary.loadingAdventure}
			</Text>
			</View>
		</SafeAreaView>
		);
	}

	if (!trip) {
		return (
		<SafeAreaView style={styles.container}>
			<View style={styles.loading}>
			<Text style={styles.error}>
				{t.diary.adventureNotFound}
			</Text>
			</View>
		</SafeAreaView>
		);
	}

	const minimumDate = dateStringToLocalDate(trip.startDate);

	const maximumDate = trip.endDate !== null ? dateStringToLocalDate(trip.endDate) : undefined;

	const selectedDate = dateStringToLocalDate(date);

	return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                contentContainerStyle={
                    styles.content
                }
                keyboardShouldPersistTaps="handled"
            >
                <Pressable
                    onPress={() =>
                        router.back()
                    }
                    style={styles.backButton}
                >
                    <Text style={styles.backText}>
                        ← {t.diary.back}
                    </Text>
                </Pressable>

                <Text style={styles.kicker}>
                    {trip.name}
                </Text>

                <Text style={styles.title}>
                    {t.diary.newEntry}
                </Text>

                <SectionLabel
                    title={t.diary.date}
                />

                <Pressable
                    onPress={() =>
                        setShowDatePicker(true)
                    }
                    style={({ pressed }) => [
                        styles.dateButton,
                        pressed &&
                            styles.dateButtonPressed,
                    ]}
                >
                    <View>
                        <Text
                            style={
                                styles.dateLabel
                            }
                        >
                            {t.diary.entryDate}
                        </Text>

                        <Text
                            style={
                                styles.dateValue
                            }
                        >
                            {formatDate(date)}
                        </Text>
                    </View>

                    <Text
                        style={
                            styles.dateArrow
                        }
                    >
                        ▼
                    </Text>
                </Pressable>

                {showDatePicker && (
                    <View
                        style={
                            styles.datePicker
                        }
                    >
                        <DateTimePicker
                            value={
                                selectedDate
                            }
                            mode="date"
                            display="default"
                            minimumDate={
                                minimumDate
                            }
                            maximumDate={
                                maximumDate
                            }
                            onValueChange={
                                handleDateChange
                            }
                            onDismiss={
                                handleDateDismiss
                            }
                        />
                    </View>
                )}

                <SectionLabel
                    title={t.diary.entry}
                />

                <InputField
                    label={t.diary.title}
                    value={title}
                    onChangeText={setTitle}
                    placeholder={
                        t.diary
                            .titlePlaceholder
                    }
                />

                <View
                    style={
                        styles.textContainer
                    }
                >
                    <Text
                        style={
                            styles.textLabel
                        }
                    >
                        {t.diary.story}
                    </Text>

                    <Text
                        style={
                            styles.optional
                        }
                    >
                        {t.diary.optional}
                    </Text>

                    <View
                        style={
                            styles.textInputWrapper
                        }
                    >
                        <TextInput
                            value={text}
                            onChangeText={setText}
                            placeholder={
                                t.diary
                                    .storyPlaceholder
                            }
                            placeholderTextColor={
                                theme.colours
                                    .textMuted
                            }
                            multiline
                            textAlignVertical="top"
                            style={
                                styles.textInput
                            }
                        />
                    </View>
                </View>

                <SectionLabel
                    title={t.diary.photos}
                />

                <View style={styles.photoGrid}>
                    {photos.map(
                        (uri, index) => (
                            <View
                                key={`${uri}-${index}`}
                                style={
                                    styles.photoContainer
                                }
                            >
                                <Image
                                    source={{
                                        uri,
                                    }}
                                    style={
                                        styles.photo
                                    }
                                />

                                <Pressable
                                    onPress={() =>
                                        handleRemovePhoto(
                                            index,
                                        )
                                    }
                                    style={
                                        styles.removeButton
                                    }
                                >
                                    <Text
                                        style={
                                            styles.removeText
                                        }
                                    >
                                        ×
                                    </Text>
                                </Pressable>
                            </View>
                        ),
                    )}

                    {photos.length < 3 && (
                        <Pressable
                            onPress={
                                handleAddPhoto
                            }
                            style={({
                                pressed,
                            }) => [
                                styles.addPhoto,
                                pressed &&
                                    styles.addPhotoPressed,
                            ]}
                        >
                            <Text
                                style={
                                    styles.addPhotoIcon
                                }
                            >
                                +
                            </Text>

                            <Text
                                style={
                                    styles.addPhotoText
                                }
                            >
                                {t.diary.addPhoto}
                            </Text>
                        </Pressable>
                    )}
                </View>

                <Text style={styles.photoHint}>
                    {t.diary.photoCount(
                        photos.length,
                    )}
                </Text>

                <Pressable
                    onPress={handleSave}
                    disabled={isSaving}
                    style={({
                        pressed,
                    }) => [
                        styles.saveButton,
                        pressed &&
                            styles.saveButtonPressed,
                        isSaving &&
                            styles.saveButtonDisabled,
                    ]}
                >
                    <Text style={styles.saveText}>
                        {isSaving
                            ? t.diary.saving
                            : t.diary.saveEntry}
                    </Text>
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    );
}

function getDefaultDiaryDate(trip: Trip): string {
	const today = getTodayDate();

	if (
		today >= trip.startDate &&
		(trip.endDate === null ||
		today <= trip.endDate)
	) {
		return today;
	}

	if (today < trip.startDate) {
		return trip.startDate;
	}

	return trip.endDate ?? today;
}

function dateStringToLocalDate(value: string): Date {
	const [
		year,
		month,
		day,
	] = value
		.split("-")
		.map(Number);

	return new Date(
		year,
		month - 1,
		day
	);
}

function dateToDateString(value: Date): string {
	const year = value.getFullYear();

	const month = String(value.getMonth() + 1).padStart(2, "0");

	const day = String(value.getDate()).padStart(2, "0");

	return `${year}-${month}-${day}`;
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor:
		theme.colours.background,
	},

	content: {
		padding: theme.spacing.md,
		paddingBottom: theme.spacing.xl,
	},

	backButton: {
		alignSelf: "flex-start",
		marginBottom: theme.spacing.lg,
	},

	backText: {
		fontFamily: theme.fonts.bodyBold,
		fontSize: theme.fontSize.xs,
		letterSpacing: 1.2,
		color: theme.colours.accent,
	},

	kicker: {
		marginBottom: theme.spacing.xs,
		fontFamily: theme.fonts.bodyBold,
		fontSize: theme.fontSize.xs,
		letterSpacing: 1.5,
		color: theme.colours.accent,
	},

	title: {
		marginBottom: theme.spacing.lg,
		fontFamily: theme.fonts.displayBold,
		fontSize: theme.fontSize.xl,
		color: theme.colours.text,
	},

	dateButton: {
		minHeight: 64,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: theme.spacing.md,
		paddingHorizontal: theme.spacing.md,
		paddingVertical: theme.spacing.sm,
		borderWidth: 1,
		borderColor: theme.colours.border,
		borderRadius: theme.radius.md,
		backgroundColor:
		theme.colours.surface,
	},

	dateButtonPressed: {
		backgroundColor:
		theme.colours.surfaceRaised,
		borderColor:
		theme.colours.accent,
	},

	dateLabel: {
		marginBottom: 2,
		fontFamily: theme.fonts.bodyBold,
		fontSize: theme.fontSize.xs,
		letterSpacing: 1,
		color: theme.colours.textMuted,
	},

	dateValue: {
		fontFamily: theme.fonts.displayBold,
		fontSize: theme.fontSize.lg,
		color: theme.colours.text,
	},

	dateArrow: {
		fontFamily: theme.fonts.displayBold,
		fontSize: theme.fontSize.sm,
		color: theme.colours.textMuted,
	},

	datePicker: {
		alignItems: "center",
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
		backgroundColor:
		theme.colours.surface,
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
		backgroundColor:
		theme.colours.background,
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
		backgroundColor:
		theme.colours.surface,
	},

	addPhotoPressed: {
		backgroundColor:
		theme.colours.surfaceRaised,
		borderColor:
		theme.colours.accent,
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
		backgroundColor:
		theme.colours.accent,
	},

	saveButtonPressed: {
		opacity: 0.75,
	},

	saveButtonDisabled: {
		opacity: 0.5,
	},

	saveText: {
		fontFamily: theme.fonts.displayBold,
		fontSize: theme.fontSize.md,
		letterSpacing: 1.5,
		color: theme.colours.background,
	},

	loading: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		padding: theme.spacing.md,
	},

	loadingText: {
		fontFamily: theme.fonts.body,
		fontSize: theme.fontSize.sm,
		color: theme.colours.textSecondary,
	},

	error: {
		fontFamily: theme.fonts.body,
		fontSize: theme.fontSize.sm,
		textAlign: "center",
		color: theme.colours.textSecondary,
	},
});