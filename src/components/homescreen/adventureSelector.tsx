import { Trip } from "@/models/Trip";
import { theme } from "@/styling/theme";
import { formatDate } from "@/utils/date";
import { useState } from "react";
import {
	Modal,
	Pressable,
	StyleSheet,
	Text,
	View,
} from "react-native";

type AdventureSelectorProps = {
  trips: Trip[];
  selectedTripId: string | null;
  onSelect: (tripId: string) => void;
};

export function AdventureSelector({
  trips,
  selectedTripId,
  onSelect,
}: AdventureSelectorProps) {
	const [visible, setVisible] = useState(false);

	const selectedTrip =
		trips.find((trip) => trip.id === selectedTripId) ?? null;

	function handleSelect(tripId: string) {
		onSelect(tripId);
		setVisible(false);
	}

	return (
		<>
		<Pressable
			style={styles.selector}
			onPress={() => setVisible(true)}
		>
			<View>
			<Text style={styles.selectorLabel}>
				CURRENT ADVENTURE
			</Text>

			<Text style={styles.selectorValue}>
				{selectedTrip?.name ?? "SELECT ADVENTURE"}
			</Text>
			</View>

			<Text style={styles.selectorArrow}>
			▼
			</Text>
		</Pressable>

		<Modal
			visible={visible}
			transparent
			animationType="fade"
			onRequestClose={() => setVisible(false)}
		>
			<Pressable
			style={styles.modalBackdrop}
			onPress={() => setVisible(false)}
			>
			<Pressable
				style={styles.selectorModal}
				onPress={(event) => event.stopPropagation()}
			>
				<Text style={styles.modalTitle}>
				SELECT ADVENTURE
				</Text>

				{trips.map((trip) => {
				const isSelected =
					trip.id === selectedTripId;

				return (
					<Pressable
					key={trip.id}
					style={[
						styles.tripOption,
						isSelected &&
						styles.tripOptionSelected,
					]}
					onPress={() =>
						handleSelect(trip.id)
					}
					>
					<Text
						style={styles.tripOptionIndicator}
					>
						{isSelected ? "●" : "○"}
					</Text>

					<View style={styles.tripOptionContent}>
						<Text style={styles.tripOptionName}>
						{trip.name}
						</Text>

						<Text style={styles.tripOptionDates}>
						{formatDate(trip.startDate)}
						{" → "}
						{trip.endDate
							? formatDate(trip.endDate)
							: "∞"}
						</Text>
					</View>
					</Pressable>
				);
				})}
			</Pressable>
			</Pressable>
		</Modal>
		</>
	);
}

const styles = StyleSheet.create({
	selector: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",

		marginHorizontal: theme.spacing.lg,
		marginTop: theme.spacing.md,
		padding: theme.spacing.md,

		backgroundColor: theme.colours.surface,

		borderWidth: 1,
		borderColor: theme.colours.border,
		borderRadius: theme.radius.md,
	},

	selectorLabel: {
		fontFamily: theme.fonts.bodyBold,
		fontSize: theme.fontSize.xs,
		color: theme.colours.textMuted,
		letterSpacing: 1.5,
	},

	selectorValue: {
		marginTop: theme.spacing.xs,

		fontFamily: theme.fonts.displayBold,
		fontSize: theme.fontSize.md,
		color: theme.colours.text,

		letterSpacing: 0.5,
	},

	selectorArrow: {
		fontFamily: theme.fonts.displayBold,
		fontSize: theme.fontSize.sm,
		color: theme.colours.accent,
	},

	modalBackdrop: {
		flex: 1,

		alignItems: "center",
		justifyContent: "center",

		padding: theme.spacing.lg,

		backgroundColor: "rgba(0, 0, 0, 0.65)",
	},

	selectorModal: {
		width: "100%",

		padding: theme.spacing.md,

		backgroundColor: theme.colours.background,

		borderWidth: 1,
		borderColor: theme.colours.border,
		borderRadius: theme.radius.lg,
	},

	modalTitle: {
		marginBottom: theme.spacing.md,

		fontFamily: theme.fonts.displayBold,
		fontSize: theme.fontSize.lg,
		color: theme.colours.text,

		letterSpacing: 1.5,
	},

	tripOption: {
		flexDirection: "row",
		alignItems: "center",

		padding: theme.spacing.md,

		borderWidth: 1,
		borderColor: theme.colours.border,
		borderRadius: theme.radius.md,

		marginBottom: theme.spacing.sm,
	},

	tripOptionSelected: {
		borderColor: theme.colours.accent,
		backgroundColor: theme.colours.surface,
	},

	tripOptionIndicator: {
		width: 28,

		fontFamily: theme.fonts.displayBold,
		fontSize: theme.fontSize.md,
		color: theme.colours.accent,
	},

	tripOptionContent: {
		flex: 1,
	},

	tripOptionName: {
		fontFamily: theme.fonts.bodyBold,
		fontSize: theme.fontSize.md,
		color: theme.colours.text,
	},

	tripOptionDates: {
		marginTop: 2,

		fontFamily: theme.fonts.body,
		fontSize: theme.fontSize.xs,
		color: theme.colours.textMuted,
	},
});