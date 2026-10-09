import { styles } from '@/styling/styles';
import { theme } from '@/styling/theme';
import { StyleSheet, Text, View } from 'react-native';

type AppHeaderProps = {
	appName: string;
	tripName: string;
	currentDay?: number;
	totalDays?: number | string | null;
};

export function AppHeader({
	appName,
	tripName,
	currentDay,
	totalDays,
}: AppHeaderProps) {
	return (
		<View style={localStyles.container}>
			<View style={localStyles.topRow}>
				<View style={styles.simpleContainer}>
					<Text style={styles.headerTitle}>{appName}</Text>
					<View style={localStyles.accentLine} />
				</View>

				{currentDay !== undefined && (
					<View style={localStyles.dayContainer}>
						<Text style={localStyles.dayLabel}>
						DAY
						</Text>

						<Text style={localStyles.dayNumber}>
						{String(currentDay).padStart(2, "0")}
						</Text>

						<Text style={localStyles.dayTotal}>
						/{" "}
						{typeof totalDays === "number"
							? String(totalDays).padStart(2, "0")
							: totalDays}
						</Text>
					</View>
				)}
			</View>

			<Text style={styles.headerSubTitle}>
				{tripName}
			</Text>
		</View>
	);
}

const localStyles = StyleSheet.create({
	container: {
		paddingHorizontal: theme.spacing.lg,
		paddingTop: theme.spacing.md,
		paddingBottom: theme.spacing.lg,

		backgroundColor: theme.colours.background,

		borderBottomWidth: 1,
		borderBottomColor: theme.colours.border,
	},

	topRow: {
		flexDirection: 'row',
		alignItems: 'flex-end',
		justifyContent: 'space-between',
	},

	accentLine: {
		width: 36,
		height: 2,

		marginTop: theme.spacing.xs,

		backgroundColor: theme.colours.accent,
	},

	dayContainer: {
		flexDirection: 'row',
		alignItems: 'baseline',

		marginLeft: theme.spacing.lg,
	},

	dayLabel: {
		marginRight: theme.spacing.xs,

		fontFamily: theme.fonts.bodyMedium,
		fontSize: theme.fontSize.xs,

		color: theme.colours.textMuted,

		letterSpacing: 1.5,
	},

	dayNumber: {
		fontFamily: theme.fonts.displayBold,
		fontSize: theme.fontSize.xl,

		color: theme.colours.accent,

		letterSpacing: 1,
	},

	dayTotal: {
		marginLeft: 2,

		fontFamily: theme.fonts.displayMedium,
		fontSize: theme.fontSize.md,

		color: theme.colours.textMuted,
	},
});