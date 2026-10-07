import { InputField } from "@/components/forms/InputField";
import { SectionLabel } from "@/components/forms/SectionLabel";
import { getTranslations } from "@/i18n";
import { Expense, ExpenseCategory } from "@/models/Expense";
import { useAppSettings } from "@/providers/AppSettingsProvider";
import { theme } from "@/styling/theme";
import { useAppServices } from "@/utils/useRepository/useAppServiceProvider";
import * as Crypto from "expo-crypto";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreateExpenseScreen() {
	const { tripId, dayId } = useLocalSearchParams<{
		tripId: string;
		dayId?: string;
	}>();

	const { expenseServices } = useAppServices();

	const [amount, setAmount] = useState("");
	const [currency, setCurrency] = useState("EUR");
	const [category, setCategory] = useState<ExpenseCategory>("food");
	const [description, setDescription] = useState("");
	const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

	const { settings } = useAppSettings();
	const t = getTranslations(settings.language);

	const categories: {
		value: ExpenseCategory;
		label: string;
		icon: string;
	}[] = [
		{
			value: "food",
			label: t.finance.categories.food,
			icon: "◆",
		},
		{
			value: "transport",
			label: t.finance.categories.transport,
			icon: "➜",
		},
		{
			value: "accommodation",
			label: t.finance.categories.accommodation,
			icon: "⌂",
		},
		{
			value: "gear",
			label: t.finance.categories.gear,
			icon: "◇",
		},
		{
			value: "other",
			label: t.finance.categories.other,
			icon: "●",
		},
	];
	
	async function handleSave() {
		const numericAmount = Number(amount);

		if (
			!amount ||
			Number.isNaN(numericAmount) ||
			numericAmount <= 0
		) {
			Alert.alert(
				t.alerts.invalidAmount.title,
				t.alerts.invalidAmount.message,
			);
			return;
		}

		if (!currency.trim()) {
			Alert.alert(
				t.alerts.missingCurrency.title,
				t.alerts.missingCurrency.message,
			);
			return;
		}

		if (!date.trim()) {
			Alert.alert(
				t.alerts.missingDate.title,
				t.alerts.missingDate.message,
			);
			return;
		}

		const newExpense: Expense = {
			id: Crypto.randomUUID(),
			tripId,

			amount: numericAmount,
			currency: currency.trim().toUpperCase(),

			category,
			description: description.trim() || null,

			date,
		};

		try {
			await expenseServices.createExpense(
				newExpense,
			);

			router.back();
		} catch (error) {
			console.log(error);

			Alert.alert(
				t.alerts.couldNotSaveExpense.title,
				t.alerts.couldNotSaveExpense.message,
			);
		}
	}

	return (
		<SafeAreaView style={styles.container}>
			<ScrollView
				contentContainerStyle={styles.content}
				keyboardShouldPersistTaps="handled"
			>
				<Text style={styles.title}>
					{t.finance.newExpense}
				</Text>

				<SectionLabel
					title={t.finance.amount}
				/>

				<View style={styles.amountRow}>
					<View style={styles.amountContainer}>
						<InputField
							label={t.finance.amountLabel}
							value={amount}
							onChangeText={setAmount}
							placeholder={
								t.finance.amountPlaceholder
							}
							keyboardType="decimal-pad"
						/>
					</View>

					<View style={styles.currencyContainer}>
						<InputField
							label={t.finance.currency}
							value={currency}
							onChangeText={setCurrency}
							placeholder={settings.currency}
						/>
					</View>
				</View>

				<SectionLabel
					title={t.finance.category}
				/>

				<View style={styles.categoryGrid}>
					{categories.map((item) => {
						const selected =
							category === item.value;

						return (
							<Pressable
								key={item.value}
								onPress={() =>
									setCategory(item.value)
								}
								style={[
									styles.category,
									selected &&
										styles.categorySelected,
								]}
							>
								<Text
									style={[
										styles.categoryIcon,
										selected &&
											styles.categorySelectedText,
									]}
								>
									{item.icon}
								</Text>

								<Text
									style={[
										styles.categoryText,
										selected &&
											styles.categorySelectedText,
									]}
								>
									{item.label}
								</Text>
							</Pressable>
						);
					})}
				</View>

				<SectionLabel
					title={t.finance.details}
				/>

				<InputField
					label={t.finance.description}
					value={description}
					onChangeText={setDescription}
					placeholder={
						t.finance.descriptionPlaceholder
					}
				/>

				<InputField
					label={t.finance.date}
					value={date}
					onChangeText={setDate}
					placeholder={
						t.finance.datePlaceholder
					}
				/>

				<Pressable
					onPress={handleSave}
					style={({ pressed }) => [
						styles.saveButton,
						pressed &&
							styles.saveButtonPressed,
					]}
				>
					<Text style={styles.saveText}>
						{t.finance.saveExpense}
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
		marginBottom: theme.spacing.lg,

		fontFamily: theme.fonts.displayBold,
		fontSize: theme.fontSize.xl,
		letterSpacing: 2,

		color: theme.colours.text,
	},

	amountRow: {
		flexDirection: "row",
		gap: theme.spacing.sm,
	},

	amountContainer: {
		flex: 1,
	},

	currencyContainer: {
		width: 100,
	},

	categoryGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: theme.spacing.sm,

		marginBottom: theme.spacing.lg,
	},

	category: {
		width: "30%",
		minHeight: 76,

		alignItems: "center",
		justifyContent: "center",

		padding: theme.spacing.sm,

		backgroundColor: theme.colours.surface,

		borderWidth: 1,
		borderColor: theme.colours.border,
		borderRadius: theme.radius.md,
	},

	categorySelected: {
		backgroundColor: theme.colours.surfaceRaised,
		borderColor: theme.colours.accent,
	},

	categoryIcon: {
		marginBottom: 4,

		fontFamily: theme.fonts.displayBold,
		fontSize: theme.fontSize.lg,

		color: theme.colours.textMuted,
	},

	categoryText: {
		fontFamily: theme.fonts.bodyBold,
		fontSize: theme.fontSize.xs,
		letterSpacing: 1,

		color: theme.colours.textSecondary,
	},

	categorySelectedText: {
		color: theme.colours.accent,
	},

	saveButton: {
		minHeight: 54,

		alignItems: "center",
		justifyContent: "center",

		marginTop: theme.spacing.lg,

		backgroundColor: theme.colours.accent,

		borderRadius: theme.radius.md,
	},

	saveButtonPressed: {
		opacity: 0.75,
		transform: [{ translateY: 2 }],
	},

	saveText: {
		fontFamily: theme.fonts.displayBold,
		fontSize: theme.fontSize.md,
		letterSpacing: 2,

		color: theme.colours.background,
	},
});