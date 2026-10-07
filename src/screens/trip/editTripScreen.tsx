import { Trip } from "@/models/Trip";
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

import { InputField } from "@/components/forms/InputField";
import { SectionLabel } from "@/components/forms/SectionLabel";
import { GameModal } from "@/components/GameModal";
import { getTranslations } from "@/i18n";
import { useAppSettings } from "@/providers/AppSettingsProvider";
import { theme } from "@/styling/theme";
import { capitalize } from "@/utils/string/capitalize";
import { validateTripFields } from "@/utils/validation/tripValidation";
import { SafeAreaView } from "react-native-safe-area-context";

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
    const [budget, setBudget] = useState("");
    const [budgetCurrency, setBudgetCurrency] = useState("EUR");

    const [deleteModalVisible, setDeleteModalVisible] = useState(false);

	const { settings } = useAppSettings();
	const t = getTranslations(settings.language)
	
    // Load the right trip when screen finishes loading
    useEffect(() => {
        async function loadTrip() {
			if (!id) return;
			
			const trip = await tripServices.getTripById(id);

			if (!trip) return;

			setTrip(trip);
			setName(trip.name);
			setStartDate(trip.startDate);
			setEndDate(trip.endDate ?? "");
			setDescription(trip.description ?? "");
        }

        loadTrip()
    }, [id]);

    async function handleSave() {
		if (!trip) return;


		const errors = validateTripFields({
			name,
			startDate,
			endDate,
			budget,
			budgetCurrency,
		});
		
		const firstError = Object.values(errors)[0];
		
		if (firstError) {
			Alert.alert(t.alerts.invalidAdventure, firstError);
			return;
		}

		const trimmedName = name.trim();
		const trimmedStartDate = startDate.trim();
		const trimmedEndDate = endDate.trim();
		const trimmedDescription = description.trim();
		const trimmedBudgetCurrency = budgetCurrency.trim();
		
		const checkedBudget = budget.trim() === "" ? null : Number(budget);
		
		const updatedTrip: Trip = {
			...trip,
			name: trimmedName,
			startDate: trimmedStartDate,
			endDate: trimmedEndDate === "" ? null : trimmedEndDate,
			description: trimmedDescription === "" ? null : trimmedDescription,
			budget: checkedBudget,
			budgetCurrency: trimmedBudgetCurrency === "" ? "EUR" : trimmedBudgetCurrency,
		};
		
		const result = await tripServices.updateTrip(updatedTrip);
		
		if (!result.success) {
			const firstServiceError = Object.values(result.errors)[0];
		
			Alert.alert(
			t.alerts.savingAdventureError,
			firstServiceError ?? t.alerts.savingAdventureErrorDesc
			);
		
			return;
		}
		
		router.back();
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
						{t.adventures.adventureSystem.toUpperCase()}
					</Text>
			
					<Text style={styles.headerTitle}>
						{t.adventures.editAdventure.toUpperCase()}
					</Text>
					</View>
				</View>
			
				{/* CURRENT ADVENTURE */}
				<View style={styles.currentTrip}>
					<Text style={styles.currentLabel}>
						{t.adventures.currentAdventure.toUpperCase()}
					</Text>
			
					<Text style={styles.currentName}>
					{trip?.name}
					</Text>
				</View>
			
				{/* DETAILS */}
				<SectionLabel title={t.adventures.details.toUpperCase()} />
			
				<InputField
					label={t.common.title.toUpperCase()}
					value={name}
					onChangeText={setName}
					placeholder={capitalize(t.adventures.adventureTitle)}
				/>
			
				{/* DATES */}
				<View style={styles.row}>
					<View style={styles.half}>
					<InputField
						label={t.adventures.startDate.toUpperCase()}
						value={startDate}
						onChangeText={setStartDate}
						placeholder="2026-08-08"
						keyboardType="numbers-and-punctuation"
					/>
					</View>
			
					<View style={styles.rowGap} />
			
					<View style={styles.half}>
					<InputField
						label={t.adventures.endDate.toUpperCase()}
						value={endDate}
						onChangeText={setEndDate}
						placeholder={capitalize(t.common.optional)}
						keyboardType="numbers-and-punctuation"
					/>
					</View>
				</View>
			
				{/* DESCRIPTION */}
				<View style={styles.notesContainer}>
					<Text style={styles.label}>
						{t.common.description.toUpperCase()}
					</Text>
			
					<TextInput
					value={description}
					onChangeText={setDescription}
					placeholder={t.adventures.adventureDesc}
					placeholderTextColor={theme.colours.textMuted}
					multiline
					textAlignVertical="top"
					style={[
						styles.input,
						styles.descriptionInput,
					]}
					/>
				</View>

				{/* BUDGET */}
				<View style={styles.row}>
					<View style={styles.half}>
					<InputField
						label={t.finance.budget.toUpperCase()}
						value={budget}
						onChangeText={setBudget}
						placeholder="0.00"
						keyboardType="numbers-and-punctuation"
					/>
					</View>
			
					<View style={styles.rowGap} />
			
					<View style={styles.half}>
					<InputField
						label={t.finance.currency.toUpperCase()}
						value={budgetCurrency}
						onChangeText={setBudgetCurrency}
						placeholder={settings.currency}
					/>
					</View>
				</View>
			
				{/* SAVE */}
				<Pressable
					style={styles.saveButton}
					onPress={handleSave}
				>
					<Text style={styles.saveText}>
						{t.common.save.toUpperCase()}
					</Text>
			
					<Text style={styles.saveArrow}>
					✓
					</Text>
				</Pressable>
			
				{/* DANGER ZONE */}
				<View style={styles.dangerSection}>
					<SectionLabel title={t.common.dangerZone.toUpperCase()} />
			
					<Text style={styles.dangerDescription}>
						{t.adventures.delDesc}
					</Text>
			
					<Pressable
					style={styles.deleteButton}
					onPress={() => setDeleteModalVisible(true)}
					>
					<Text style={styles.deleteText}>
						{t.adventures.delAdventure}
					</Text>
			
					<Text style={styles.deleteSymbol}>
						×
					</Text>
					</Pressable>
				</View>
				</ScrollView>
				<GameModal
				visible={deleteModalVisible}
				title={t.adventures.delAdventure + "?"}
				message={t.adventures.delAdventureDesc}
				confirmText={t.common.delete.toUpperCase()}
				cancelText={t.common.cancel.toUpperCase()}
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