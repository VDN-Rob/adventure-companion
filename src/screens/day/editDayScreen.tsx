import { InputField } from "@/components/forms/InputField";
import { ChoiceModal } from "@/components/modals/ChoiceModal";
import { SectionLabel } from "@/components/UI/SectionLabel";
import { Day } from "@/models/Day";
import { useAppServices } from "@/utils/useRepository/useAppServiceProvider";
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

import { DateSelector } from "@/components/forms/DateSelector";
import { getTranslations } from "@/i18n";
import { Trip } from "@/models/Trip";
import { useAppSettings } from "@/providers/AppSettingsProvider";
import { theme } from "@/styling/theme";
import { dateStringToLocalDate, dateToDateString } from "@/utils/date";
import { validateDayFields } from "@/utils/validation/dayValidation";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditDayScreen() {
	// Retrieve id from parameters
	const { dayId, tripId } = useLocalSearchParams<{ dayId: string, tripId: string }>();

	// Load databank
	const { dayServices, tripServices } = useAppServices();

	// State
	const [day, setDay] = useState<Day>();
	const [date, setDate] = useState("");
	const [title, setTitle] = useState("");
	const [notes, setNotes] = useState("");
	const [plannedElevation, setPlannedElevation] = useState("");
	const [plannedDistance, setPlannedDistance] = useState("");
	const [deleteModalVisible, setDeleteModalVisible] = useState(false);
	
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

	useEffect(() => {
		async function loadDay() {
			if (!dayId) return;
		
			const day = await dayServices.getDayById(dayId);
		
			if (day) {
				setDay(day);
				setDate(day.date);
		
				// Database null → empty form field
				setTitle(day.title ?? "");
				setNotes(day.notes ?? "");
		
				setPlannedElevation(
				day.plannedElevation === null
					? ""
					: String(day.plannedElevation)
				);
		
				setPlannedDistance(
				day.plannedDistance === null
					? ""
					: String(day.plannedDistance)
				);
			}
			}
		
			loadDay();
		}, [dayId]);

		async function handleSave() {
		if (!day) return;

		const errors = validateDayFields({
			title,
			date,
			plannedElevation,
			plannedDistance
		});

		const firstError = Object.values(errors)[0];

		if (firstError) {
			Alert.alert(t.alerts.invalidDayChange.title, firstError);
			return;
		}

		const updatedDay: Day = {
			...day,
			date: date,
			title: title.trim() === "" ? null : title.trim(),
			notes: notes.trim() == "" ? null : notes.trim(),
			plannedElevation: plannedElevation === "" ? null : Number(plannedElevation),
			plannedDistance: plannedDistance === "" ? null : Number(plannedDistance),
		}
		
		const result = await dayServices.updateDay(updatedDay);

		if (!result.success) {
			const firstServiceError = Object.values(result.errors)[0];
			console.log(firstServiceError);
		
			Alert.alert(t.alerts.couldNotSaveDay.title, firstServiceError ?? t.alerts.couldNotSaveDay.fallbackMessage);
		
			return;
		}

		router.back();
	}

	async function deleteDay() {
		if (!dayId) return;
	
		setDeleteModalVisible(false);
	
		await dayServices.deleteDay(dayId);
	
		router.dismiss(2);
	}
	
	if (!day) {
		return (
		<View style={styles.loadingContainer}>
			<Text style={styles.loadingText}>
				{t.day.loading}
			</Text>
		</View>
		);
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
					<Text style={styles.backArrow}>
					←
					</Text>
				</Pressable>
		
				<View>
					<Text style={styles.eyebrow}>
						{t.day.adventurePlanner}
					</Text>
		
					<Text style={styles.headerTitle}>
						{t.day.editDay}
					</Text>
				</View>
				</View>
		
				{/* DAY DETAILS */}
		
				<SectionLabel title={t.day.details} />
		
				<InputField
				label={t.day.title}
				value={title ?? ""}
				onChangeText={setTitle}
				placeholder={t.day.titlePlaceholder}
				/>
		
				{trip && selectedDate && (
					<DateSelector
						label={t.time.date.toUpperCase()}
						date={selectedDate}
						minimumDate={dateStringToLocalDate(trip.startDate)}
						maximumDate={trip.endDate ? dateStringToLocalDate(trip.endDate) : undefined}
						onDateChange={handleDateChange}
					/>
				)}
		
				{/* PLANNING */}
		
				<SectionLabel title={t.day.planning} />
		
				<View style={styles.row}>
				<View style={styles.half}>
					<InputField
						label={t.day.distance + "(" + t.units.kmAbr.toUpperCase() + ")"}
						value={plannedDistance}
						onChangeText={setPlannedDistance}
						placeholder={t.day.distancePlaceholder}
						keyboardType="decimal-pad"
					/>
				</View>
		
				<View style={styles.rowGap} />
		
				<View style={styles.half}>
					<InputField
					label={t.day.elevation + "(" + t.units.mAbr.toUpperCase() + ")"}
					value={plannedElevation}
					onChangeText={setPlannedElevation}
					placeholder={t.day.elevationPlaceholder}
					keyboardType="numeric"
					/>
				</View>
				</View>
		
				{/* NOTES */}
		
				<SectionLabel title={t.day.notesSection} />
		
				<View style={styles.notesContainer}>
				<Text style={styles.label}>
					{t.day.notes}
				</Text>
		
				<View style={styles.notesWrapper}>
					<TextInput
					value={notes ?? ""}
					onChangeText={setNotes}
					placeholder={t.day.notesPlaceholder}
					placeholderTextColor={theme.colours.textMuted}
					multiline
					textAlignVertical="top"
					style={styles.notesInput}
					/>
				</View>
				</View>
		
				{/* SAVE */}
		
				<Pressable
				style={styles.saveButton}
				onPress={handleSave}
				>
				<View>
					<Text style={styles.saveEyebrow}>
						{t.day.adventurePlanner}
					</Text>
		
					<Text style={styles.saveText}>
						{t.day.saveChanges}
					</Text>
				</View>
		
				<Text style={styles.saveSymbol}>
					✓
				</Text>
				</Pressable>
		
				{/* DANGER ZONE */}
		
				<View style={styles.dangerSection}>
				<Text style={styles.dangerLabel}>
					{t.day.dangerZone}
				</Text>
		
				<Pressable
					style={styles.deleteButton}
					onPress={() => setDeleteModalVisible(true)}
				>
					<View>
					<Text style={styles.deleteTitle}>
						{t.day.deleteDay}
					</Text>
		
					<Text style={styles.deleteDescription}>
						{t.day.deleteDescription}
					</Text>
					</View>
		
					<Text style={styles.deleteSymbol}>
					×
					</Text>
				</Pressable>
				</View>
			</ScrollView>
		
			<ChoiceModal
				visible={deleteModalVisible}
				title={t.day.deleteConfirmation.title}
				message={t.day.deleteConfirmation.message}
				confirmText={t.day.deleteConfirmation.confirm}
				cancelText={t.day.deleteConfirmation.cancel}
				destructive
				onCancel={() => setDeleteModalVisible(false)}
				onConfirm={deleteDay}
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
  
    label: {
      marginBottom: theme.spacing.xs,
  
      fontFamily: theme.fonts.bodyBold,
      fontSize: theme.fontSize.xs,
  
      color: theme.colours.textMuted,
  
      letterSpacing: 1.5,
    },
  
    notesContainer: {
      marginBottom: theme.spacing.md,
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
  
      marginTop: theme.spacing.lg,
  
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
  
    loadingContainer: {
      flex: 1,
  
      alignItems: "center",
      justifyContent: "center",
  
      backgroundColor: theme.colours.background,
    },
  
    loadingText: {
      fontFamily: theme.fonts.displayBold,
      fontSize: theme.fontSize.md,
  
      color: theme.colours.text,
  
      letterSpacing: 2,
    },
  });