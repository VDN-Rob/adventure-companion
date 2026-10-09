import { POIType } from "@/models/POI";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { theme } from "@/styling/theme";

type POITypeOption = {
    type: POIType;
    label: string;
    symbol: string;
    description: string;
};

type POITypeSelectorProps = {
    value: POIType;
    onChange: (value: POIType) => void;
    options: POITypeOption[];
};


export function POITypeSelector({
  value,
  onChange,
  options
}: POITypeSelectorProps) {
	return (
		<View style={styles.typeGrid}>
		{options.map((poiType) => {
			const selected = value === poiType.type;

			return (
			<Pressable
				key={poiType.type}
				onPress={() => onChange(poiType.type)}
				style={[
				styles.typeCard,
				selected && styles.typeCardSelected,
				]}
			>
				<Text
				style={[
					styles.typeSymbol,
					selected && styles.typeSymbolSelected,
				]}
				>
				{poiType.symbol}
				</Text>

				<Text
				style={[
					styles.typeLabel,
					selected && styles.typeLabelSelected,
				]}
				>
				{poiType.label}
				</Text>

				<Text
				style={[
					styles.typeDescription,
					selected && styles.typeDescriptionSelected,
				]}
				>
				{poiType.description}
				</Text>
			</Pressable>
			);
		})}
		</View>
	);
}

const styles = StyleSheet.create({
	typeGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: theme.spacing.sm,
	},

	typeCard: {
		width: "48%",
		minHeight: 125,

		padding: theme.spacing.sm,

		justifyContent: "center",

		backgroundColor: theme.colours.surface,

		borderWidth: 1,
		borderColor: theme.colours.border,

		borderRadius: theme.radius.md,
	},

	typeCardSelected: {
		borderColor: theme.colours.accent,
		backgroundColor: theme.colours.background,
	},

	typeSymbol: {
		marginBottom: 4,

		fontFamily: theme.fonts.displayBold,
		fontSize: 25,

		color: theme.colours.textMuted,
	},

	typeSymbolSelected: {
		color: theme.colours.accent,
	},

	typeLabel: {
		fontFamily: theme.fonts.displayBold,
		fontSize: theme.fontSize.md,

		color: theme.colours.textMuted,

		letterSpacing: 1,
	},

	typeLabelSelected: {
		color: theme.colours.text,
	},

	typeDescription: {
		marginTop: 3,

		fontFamily: theme.fonts.body,
		fontSize: 9,
		lineHeight: 13,

		color: theme.colours.textMuted,
	},

	typeDescriptionSelected: {
		color: theme.colours.textMuted,
	},
});