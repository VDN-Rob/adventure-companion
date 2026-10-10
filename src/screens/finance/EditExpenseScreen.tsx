import { SectionLabel } from "@/components/UI/SectionLabel";
import { InputField } from "@/components/forms/InputField";
import { Expense, ExpenseCategory } from "@/models/Expense";
import { useAppServices } from "@/utils/useRepository/useAppServiceProvider";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { getTranslations } from "@/i18n";
import { useAppSettings } from "@/providers/AppSettingsProvider";
import { theme } from "@/styling/theme";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditExpenseScreen() {
	const { expenseId } = useLocalSearchParams<{ expenseId: string }>();

	const { expenseServices } = useAppServices();

	const [expense, setExpense] = useState<Expense | null>(null);

	const [amount, setAmount] = useState("");
	const [currency, setCurrency] = useState("EUR");
	const [category, setCategory] = useState<ExpenseCategory>("food");
	const [description, setDescription] = useState("");
	const [date, setDate] = useState("");

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

	useEffect(() => {
		async function loadExpense() {
			if (!expenseId) return;

			const result = await expenseServices.getExpenseById(expenseId);

			if (!result) return;

			setExpense(result);

			setAmount(String(result.amount));
			setCurrency(result.currency);
			setCategory(result.category);
			setDescription(result.description ?? "");
			setDate(result.date);
		}

		loadExpense();
	}, [expenseId]);

	async function handleSave() {
		if (!expense) {
			return;
		}

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

		const updatedExpense: Expense = {
			...expense,

			amount: numericAmount,
			currency: currency.trim().toUpperCase(),

			category,
			description: description.trim() || null,

			date,
		};

		try {
			await expenseServices.updateExpense(
				updatedExpense,
			);

			router.back();
		} catch {
			Alert.alert(
				t.alerts.couldNotSaveExpense.title,
				t.alerts.couldNotSaveExpense.message,
			);
		}
	}

	function handleDelete() {
		Alert.alert(
			t.finance.deleteConfirmation.title,
			t.finance.deleteConfirmation.message,
			[
				{
					text: t.finance.deleteConfirmation.cancel,
					style: "cancel",
				},
				{
					text: t.finance.deleteConfirmation.confirm,
					style: "destructive",
					onPress: deleteExpense,
				},
			],
		);
	}

	async function deleteExpense() {
		if (!expenseId) {
			return;
		}

		try {
			await expenseServices.deleteExpense(
				expenseId,
			);

			router.back();
		} catch {
			Alert.alert(
				t.alerts.couldNotDeleteExpense.title,
				t.alerts.couldNotDeleteExpense.message,
			);
		}
	}

	if (!expense) {
		return (
			<SafeAreaView style={styles.container}>
				<Text style={styles.loading}>
					{t.finance.loadingExpense}
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
					{t.finance.editExpense}
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
						{t.finance.saveChanges}
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
						{t.finance.deleteExpense}
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

	loading: {
		padding: theme.spacing.md,

		fontFamily: theme.fonts.displayBold,
		fontSize: theme.fontSize.md,
		letterSpacing: 2,

		color: theme.colours.textMuted,
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

	deleteButton: {
		minHeight: 48,

		alignItems: "center",
		justifyContent: "center",

		marginTop: theme.spacing.md,

		backgroundColor: "transparent",

		borderWidth: 1,
		borderColor: theme.colours.border,
		borderRadius: theme.radius.md,
	},

	deleteButtonPressed: {
		opacity: 0.6,
		borderColor: theme.colours.accent,
	},

	deleteText: {
		fontFamily: theme.fonts.displayBold,
		fontSize: theme.fontSize.sm,
		letterSpacing: 1.5,

		color: theme.colours.textMuted,
	},
});