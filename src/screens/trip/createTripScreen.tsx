import { InputField } from "@/components/forms/InputField";
import { SectionLabel } from "@/components/forms/SectionLabel";
import { StartEndDateSelector } from "@/components/reusableUI/combinations/startEndDateSelector";
import { getTranslations } from "@/i18n";
import { Trip } from "@/models/Trip";
import { useAppSettings } from "@/providers/AppSettingsProvider";
import { theme } from "@/styling/theme";
import { dateStringToLocalDate, dateToDateString } from "@/utils/date";
import { useAppServices } from "@/utils/useRepository/useAppServiceProvider";
import { validateTripFields } from "@/utils/validation/tripValidation";
import * as Crypto from "expo-crypto";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function CreateTripScreen() {
    const { settings } = useAppSettings();
    const t = getTranslations(settings.language);

    // State
    const [name, setName] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [description, setDescription] = useState("");
    const [budget, setBudget] = useState("");
    const [budgetCurrency, setBudgetCurrency] = useState("EUR");

    // Access application layer
    const { tripServices } = useAppServices();

    function handleStartDateChange(selectedDate: Date) {
      setStartDate(dateToDateString(selectedDate));
    }

    async function handleSaveTrip() {
		const errors = validateTripFields({
			name,
			startDate,
			endDate,
			budget,
			budgetCurrency,
		});
		
		const firstError = Object.values(errors)[0];
		
		if (firstError) {
			Alert.alert(t.alerts.invalidAdventure.title, firstError);
			return;
		}
		
		const trimmedName = name.trim();
		const trimmedStartDate = startDate.trim();
		const trimmedEndDate = endDate.trim();
		const trimmedDescription = description.trim();
		const trimmedBudgetCurrency = budgetCurrency.trim();
		
		const checkedBudget = budget.trim() === "" ? null : Number(budget);
		
		const newTrip: Trip = {
			id: Crypto.randomUUID(),
			name: trimmedName,
			startDate: trimmedStartDate,
			endDate: trimmedEndDate === "" ? null : trimmedEndDate,
			description: trimmedDescription === "" ? null : trimmedDescription,
			budget: checkedBudget,
			budgetCurrency: trimmedBudgetCurrency === "" ? "EUR" : trimmedBudgetCurrency,
		};
		
		const result = await tripServices.createTrip(newTrip);
		
		if (!result.success) {
			const firstServiceError = Object.values(result.errors)[0];
		
			Alert.alert(t.alerts.savingAdventureError.title, firstServiceError ?? t.alerts.savingAdventureError.message);
		
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
					<Text style={styles.backArrow}>
					←
					</Text>
				</Pressable>
		
				<View>
					<Text style={styles.eyebrow}>
						{t.adventures.adventureSystem.toUpperCase()}
					</Text>
		
					<Text style={styles.headerTitle}>
						{t.adventures.newAdventure}
					</Text>
				</View>
				</View>
		
				{/* INTRO */}
				<View style={styles.intro}>
				<Text style={styles.introTitle}>
					{t.adventures.planJourney.toUpperCase()}
				</Text>
		
				<Text style={styles.introText}>
					{t.adventures.planJourneyDesc}
				</Text>
				</View>
		
				{/* DETAILS */}
				<SectionLabel title={t.adventures.detailsAdventure.toUpperCase()} />
		
				{/* NAME */}
				<InputField
				label={t.common.title.toUpperCase()}
				value={name}
				onChangeText={setName}
				placeholder={t.adventures.defaultAdventure}
				/>
		
				{/* DATES */}
				<StartEndDateSelector
					startDate={startDate ? dateStringToLocalDate(startDate) : new Date()}
					endDate={endDate ? dateStringToLocalDate(endDate) : null}
					onStartDateChange={handleStartDateChange}
					onEndDateChange={(date) => {
						setEndDate(date ? dateToDateString(date) : "");
					}}
				/>
		
				{/* DESCRIPTION */}
				<View style={styles.notesContainer}>
				<Text style={styles.label}>
					{t.common.description.toUpperCase()}
				</Text>
		
				<TextInput
					value={description}
					onChangeText={setDescription}
					placeholder={t.adventures.descPlaceholder}
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
		
				{/* CREATE */}
				<Pressable
				style={styles.createButton}
				onPress={handleSaveTrip}
				>
				<View>
					<Text style={styles.createEyebrow}>
						{t.adventures.beginPlanning}
					</Text>
		
					<Text style={styles.createText}>
						{t.adventures.createAdventure}
					</Text>
				</View>
		
				<Text style={styles.createArrow}>
					→
				</Text>
				</Pressable>
			</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
      );
}

const styles = StyleSheet.create({
	dateButton: {
        minHeight: 64,
        alignItems: "center",
        paddingVertical: theme.spacing.sm,
        borderWidth: 1,
        borderColor: theme.colours.border,
        borderRadius: theme.radius.md,
        backgroundColor: theme.colours.surface,
    },
	
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
  
    intro: {
      padding: theme.spacing.md,
  
      marginBottom: theme.spacing.xl,
  
      backgroundColor: theme.colours.surface,
  
      borderLeftWidth: 3,
      borderLeftColor: theme.colours.accent,
  
      borderRadius: theme.radius.sm,
    },
  
    introTitle: {
      fontFamily: theme.fonts.displayBold,
      fontSize: theme.fontSize.lg,
  
      color: theme.colours.text,
  
      letterSpacing: 1,
    },
  
    introText: {
      marginTop: theme.spacing.xs,
  
      fontFamily: theme.fonts.body,
      fontSize: theme.fontSize.xs,
  
      lineHeight: 18,
  
      color: theme.colours.textMuted,
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
	  columnGap: theme.spacing.sm
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
  
    createButton: {
      minHeight: 70,
  
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
  
      paddingHorizontal: theme.spacing.md,
  
      marginTop: theme.spacing.xl,
  
      backgroundColor: theme.colours.accent,
  
      borderRadius: theme.radius.md,
    },
  
    createEyebrow: {
      fontFamily: theme.fonts.bodyBold,
      fontSize: 8,
  
      color: theme.colours.background,
  
      letterSpacing: 1.5,
    },
  
    createText: {
      marginTop: 2,
  
      fontFamily: theme.fonts.displayBold,
      fontSize: theme.fontSize.lg,
  
      color: theme.colours.background,
  
      letterSpacing: 1,
    },
  
    createArrow: {
      fontFamily: theme.fonts.displayBold,
      fontSize: theme.fontSize.xxl,
  
      color: theme.colours.background,
    },
  });