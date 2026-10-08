import { Route } from "@/models/Route";
import { theme } from "@/styling/theme";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface RouteCardProps {
	route: Route;
	onPress: () => void;
}

function formatDistance(meters?: number): string {
	if (meters == null) {
		return "—";
	}

	if (meters >= 1000) {
		return `${(meters / 1000).toFixed(1)} km`;
	}

	return `${Math.round(meters)} m`;
}

function formatElevation(meters?: number): string {
	if (meters == null) {
		return "—";
	}

	return `${Math.round(meters)} m`;
}

export function RouteCard({
	route,
	onPress,
}: RouteCardProps) {
	return (
		<Pressable
			style={({ pressed }) => [
				styles.container,
				pressed && styles.pressed,
			]}
			onPress={onPress}
		>
			<View style={styles.header}>
				<View style={styles.titleContainer}>
					<Text
						style={styles.title}
						numberOfLines={1}
					>
						{route.name ??
							"Unnamed route"}
					</Text>

					<Text
						style={styles.filename}
						numberOfLines={1}
					>
						{route.filePath}
					</Text>
				</View>

				<Text style={styles.arrow}>
					→
				</Text>
			</View>

			<View style={styles.stats}>
				<View style={styles.stat}>
					<Text style={styles.statValue}>
						{formatDistance(
							route.distanceMeters
						)}
					</Text>

					<Text style={styles.statLabel}>
						DISTANCE
					</Text>
				</View>

				<View style={styles.divider} />

				<View style={styles.stat}>
					<Text style={styles.statValue}>
						{formatElevation(
							route.elevationGainMeters
						)}
					</Text>

					<Text style={styles.statLabel}>
						ASCENT
					</Text>
				</View>

				<View style={styles.divider} />

				<View style={styles.stat}>
					<Text style={styles.statValue}>
						{route.trackPoints.length}
					</Text>

					<Text style={styles.statLabel}>
						POINTS
					</Text>
				</View>
			</View>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: theme.spacing.md,

		backgroundColor: theme.colours.surface,

		borderWidth: 1,
		borderColor: theme.colours.border,

		borderRadius: theme.radius.md,
	},

	pressed: {
		opacity: 0.7,
	},

	header: {
		flexDirection: "row",
		alignItems: "center",
	},

	titleContainer: {
		flex: 1,
	},

	title: {
		fontFamily: theme.fonts.bodyBold,
		fontSize: theme.fontSize.md,

		color: theme.colours.text,
	},

	filename: {
		marginTop: 3,

		fontFamily: theme.fonts.body,
		fontSize: theme.fontSize.xs,

		color: theme.colours.textMuted,
	},

	arrow: {
		marginLeft: theme.spacing.sm,

		fontFamily: theme.fonts.displayBold,
		fontSize: theme.fontSize.lg,

		color: theme.colours.accent,
	},

	stats: {
		flexDirection: "row",

		marginTop: theme.spacing.md,
	},

	stat: {
		flex: 1,
	},

	divider: {
		width: 1,

		marginHorizontal: theme.spacing.sm,

		backgroundColor: theme.colours.border,
	},

	statValue: {
		fontFamily: theme.fonts.bodyBold,
		fontSize: theme.fontSize.sm,

		color: theme.colours.text,
	},

	statLabel: {
		marginTop: 2,

		fontFamily: theme.fonts.bodyBold,
		fontSize: 8,

		color: theme.colours.textMuted,

		letterSpacing: 1,
	},
});