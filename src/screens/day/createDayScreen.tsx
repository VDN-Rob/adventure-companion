import { DateSelector } from "@/components/forms/DateSelector";
import { InputField } from "@/components/forms/InputField";
import { getTranslations } from "@/i18n";
import { Day } from "@/models/Day";
import { Trip } from "@/models/Trip";
import { useAppSettings } from "@/providers/AppSettingsProvider";
import { theme } from "@/styling/theme";
import { dateStringToLocalDate, dateToDateString } from "@/utils/date";
import { useAppServices } from "@/utils/useRepository/useAppServiceProvider";
import { validateDayFields } from "@/utils/validation/dayValidation";
import * as Crypto from "expo-crypto";
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
	View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreateDayScreen() {
    // Retrieve id from parameters
    const { tripId } = useLocalSearchParams<{ tripId: string }>();
    
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [notes, setNotes] = useState("");
    const [plannedElevation, setPlannedElevation] = useState("");
    const [plannedDistance, setPlannedDistance] = useState("");

    const { dayServices, tripServices } = useAppServices();

    const { settings } = useAppSettings();
    const t = getTranslations(settings.language);

	const [trip, setTrip] = useState<Trip | null>(null);
	const selectedDate = date ? dateStringToLocalDate(date) : undefined;

	useEffect(() => {
		let cancelled = false;

		async function loadTrip() {
			if (!tripId) {
				return;
			}

			try {
				const loadedTrip = await tripServices.getTripById(tripId);

				if (cancelled) {
					return;
				}

				if (!loadedTrip) {
					Alert.alert(
						"Adventure not found",
						"The selected adventure could not be found."
					);
					return;
				}

				setTrip(loadedTrip);

				// Default the new Day to the start of the adventure.
				setDate(loadedTrip.startDate);
			} catch (error) {
				console.error(
					"Failed to load adventure:",
					error
				);

				Alert.alert(
					"Unable to load adventure",
					"The adventure details could not be loaded."
				);
			}
		}

		loadTrip();

		return () => {
			cancelled = true;
		};
	}, [tripId, tripServices]);
	
	function handleDateChange(selectedDate: Date) {
		setDate(dateToDateString(selectedDate));
	}
	
    async function handleSaveDay() {
		const errors = validateDayFields({
			title,
			date,
			plannedElevation,
			plannedDistance
		});

		const firstError = Object.values(errors)[0];

		if (firstError) {
			Alert.alert("Invalid day creation", firstError)
			return;
		}

		const elevation = (plannedElevation === "" ? null : Number(plannedElevation));
		const distance = (plannedDistance === "" ? null : Number(plannedDistance));

		// Saving
		const newDay: Day = {
			id: Crypto.randomUUID(),
			tripId: tripId,
			date: date.trim(),
			title: title.trim() || null,
			notes: notes.trim() || null,
			plannedElevation: elevation,
			plannedDistance: distance,
		};

		await dayServices.createDay(newDay);

		router.back()
    }
    
    return (
		<SafeAreaView style={styles.container}>
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
					{t.day.adventurePlanner}
				</Text>

				<Text style={styles.headerTitle}>
					{t.day.planDay}
				</Text>
				</View>
			</View>

			{/* SECTION */}
			<View style={styles.sectionHeader}>
				<Text style={styles.sectionTitle}>
					{t.day.details}
				</Text>

				<View style={styles.sectionLine} />
			</View>

			{/* TITLE */}
			<InputField
				label={t.day.title}
				value={title}
				onChangeText={setTitle}
				placeholder={t.day.titlePlaceholder}
			/>

			{/* DATE */}
			{trip && selectedDate && (
				<DateSelector
					label={t.time.date.toUpperCase()}
					date={selectedDate}
					minimumDate={dateStringToLocalDate(trip.startDate)}
					maximumDate={trip.endDate ? dateStringToLocalDate(trip.endDate) : undefined}
					onDateChange={handleDateChange}
				/>
			)}

			{/* DISTANCE + ELEVATION */}
			<View style={styles.row}>
				<View style={styles.half}>
				<InputField
					label={t.common.distance.toUpperCase()}
					value={plannedDistance}
					onChangeText={setPlannedDistance}
					placeholder="68.5"
					keyboardType="decimal-pad"
					suffix={t.units.kmAbr.toUpperCase()}
				/>
				</View>

				<View style={styles.rowGap} />

				<View style={styles.half}>
				<InputField
					label={t.common.elevation.toUpperCase()}
					value={plannedElevation}
					onChangeText={setPlannedElevation}
					placeholder="820"
					keyboardType="numeric"
					suffix={t.units.mAbr.toUpperCase()}
				/>
				</View>
			</View>

			{/* NOTES */}
			<View style={styles.notesContainer}>
				<Text style={styles.label}>
					{t.day.notes.toUpperCase()}
				</Text>

				<TextInput
					value={notes}
					onChangeText={setNotes}
					placeholder={t.day.notesPlaceholder}
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
				style={styles.saveButton}
				onPress={handleSaveDay}
			>
				<Text style={styles.saveText}>
					{t.day.save}
				</Text>

				<Text style={styles.saveArrow}>
				→
				</Text>
			</Pressable>
			</ScrollView>
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
      flexDirection: "row",
      alignItems: "center",
  
      minHeight: 52,
  
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
  
    suffix: {
      paddingRight: theme.spacing.md,
  
      fontFamily: theme.fonts.bodyBold,
      fontSize: theme.fontSize.xs,
  
      color: theme.colours.accent,
  
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
  
    notesContainer: {
      marginTop: theme.spacing.sm,
    },
  
    notesInput: {
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
  });