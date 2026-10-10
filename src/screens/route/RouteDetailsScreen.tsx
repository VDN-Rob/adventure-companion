import { ChoiceModal } from "@/components/modals/ChoiceModal";
import { SectionLabel } from "@/components/UI/SectionLabel";
import { MAP_STYLE } from "@/constants/map";
import { Route } from "@/models/Route";
import { theme } from "@/styling/theme";
import { calculateBounds } from "@/utils/map/calculateMapBounds";
import { useAppServices } from "@/utils/useRepository/useAppServiceProvider";
import {
    Camera,
    GeoJSONSource,
    Layer,
    Map,
} from "@maplibre/maplibre-react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

function formatDate(value: string): string {
	const date = new Date(value);

	if (Number.isNaN(date.getTime())) {
		return value;
	}

	return date.toLocaleDateString();
}

export default function RouteDetailsScreen() {
	const router = useRouter();

	const { routeId } =
		useLocalSearchParams<{ routeId: string }>();

	const { routeService } = useAppServices();

	const [route, setRoute] = useState<Route | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

    const [deleteModalVisible, setDeleteModalVisible] = useState(false);

	useEffect(() => {
		async function loadRoute() {
			if (!routeId) {
				setError("No route ID was provided");
				setIsLoading(false);
				return;
			}

			try {
				setIsLoading(true);
				setError(null);

				const route =
					await routeService.getRouteById(
						routeId
					);

				if (!route) {
					setError("Route not found");
					return;
				}

				setRoute(route);
			} catch (error) {
				console.error(
					"Failed to load route:",
					error
				);

				setError("Unable to load route");
			} finally {
				setIsLoading(false);
			}
		}

		loadRoute();
	}, [routeId, routeService]);

	const routeGeoJSON = useMemo(() => {
		if (!route || route.trackPoints.length < 2) {
			return {
				type: "FeatureCollection" as const,
				features: [],
			};
		}

		return {
			type: "FeatureCollection" as const,
			features: [
				{
					type: "Feature" as const,
					properties: {
						routeId: route.id,
					},
					geometry: {
						type: "LineString" as const,
						coordinates:
							route.trackPoints.map(
								(point) => [
									point.longitude,
									point.latitude,
								]
							),
					},
				},
			],
		};
	}, [route]);

	const routeBounds = useMemo(() => {
		if (!route || route.trackPoints.length === 0) {
			return null;
		}

		return calculateBounds(
			route.trackPoints.map((point) => ({
				latitude: point.latitude,
				longitude: point.longitude,
			}))
		);
	}, [route]);

	if (isLoading) {
		return (
			<View style={styles.centered}>
				<ActivityIndicator
					size="small"
					color={theme.colours.accent}
				/>

				<Text style={styles.loadingText}>
					Loading route...
				</Text>
			</View>
		);
	}

	if (error || !route) {
		return (
			<View style={styles.centered}>
				<Text style={styles.errorTitle}>
					Route not found
				</Text>

				<Text style={styles.errorText}>
					{error ?? "Unable to load route"}
				</Text>

				<Pressable
					style={styles.backButton}
					onPress={() => router.back()}
				>
					<Text style={styles.backButtonText}>
						Go back
					</Text>
				</Pressable>
			</View>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.header}>
				<Pressable
					onPress={() => router.back()}
					style={styles.backButtonSmall}
				>
					<Text style={styles.backArrow}>
						←
					</Text>
				</Pressable>

				<View style={styles.headerText}>
					<Text style={styles.eyebrow}>
						GPX ROUTE
					</Text>

					<Text
						style={styles.title}
						numberOfLines={1}
					>
						{route.name ??
							"Unnamed route"}
					</Text>
				</View>
			</View>

			<View style={styles.mapContainer}>
				<Map
					style={styles.map}
					mapStyle={MAP_STYLE}
				>
					{routeBounds && (
						<Camera
							bounds={[
								routeBounds.minLng,
								routeBounds.minLat,
								routeBounds.maxLng,
								routeBounds.maxLat,
							]}
							padding={{
								top: 40,
								bottom: 40,
								left: 40,
								right: 40,
							}}
						/>
					)}

					<GeoJSONSource
						id="route-details"
						data={routeGeoJSON}
					>
						<Layer
							id="route-details-line"
							type="line"
							style={{
								lineColor:
									"#007AFF",
								lineWidth: 5,
								lineCap:
									"round",
								lineJoin:
									"round",
							}}
						/>
					</GeoJSONSource>
				</Map>
			</View>

			<View style={styles.content}>
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

					<View style={styles.statDivider} />

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

					<View style={styles.statDivider} />

					<View style={styles.stat}>
						<Text style={styles.statValue}>
							{formatElevation(
								route.elevationLossMeters
							)}
						</Text>

						<Text style={styles.statLabel}>
							DESCENT
						</Text>
					</View>
				</View>

				<View style={styles.details}>
					<View style={styles.detailRow}>
						<Text style={styles.detailLabel}>
							TRACK POINTS
						</Text>

						<Text style={styles.detailValue}>
							{route.trackPoints.length}
						</Text>
					</View>

					<View style={styles.detailRow}>
						<Text style={styles.detailLabel}>
							IMPORTED
						</Text>

						<Text style={styles.detailValue}>
							{formatDate(
								route.importedAt
							)}
						</Text>
					</View>
				</View>

				<Pressable
					style={styles.navigationButton}
					onPress={() => {
						router.push({
							pathname: "/map/map",
							params: {
								dayId: route.dayId,
								routeId: route.id,
							},
						});
					}}
				>
					<Text style={styles.navigationButtonText}>
						Start navigation
					</Text>

					<Text style={styles.navigationButtonArrow}>
						→
					</Text>
				</Pressable>
			</View>
            
            {/* DANGER ZONE */}
            <View style={styles.dangerSection}>
                <SectionLabel title="DANGER ZONE" />
        
                <Text style={styles.dangerDescription}>
                    Permanently remove this route and its associated data.
                </Text>
        
                <Pressable
                    style={styles.deleteButton}
                    onPress={() => setDeleteModalVisible(true)}
                >
                <Text style={styles.deleteText}>
                    Delete route
                </Text>
        
                <Text style={styles.deleteSymbol}>
                    ×
                </Text>
                </Pressable>
            </View>
            <ChoiceModal
                visible={deleteModalVisible}
                title="Delete route?"
                message="This route will be permanently deleted. This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                destructive
                onCancel={() => setDeleteModalVisible(false)}
                onConfirm={async () => {
                    if (!routeId) return;

                    setDeleteModalVisible(false);

                    await routeService.deleteRoute(routeId);

                    router.dismiss(1);
                }}
            />
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.colours.background,
	},

	centered: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		padding: theme.spacing.lg,
		backgroundColor: theme.colours.background,
	},

	loadingText: {
		marginTop: theme.spacing.sm,

		fontFamily: theme.fonts.bodyBold,
		fontSize: theme.fontSize.xs,

		color: theme.colours.textMuted,

		letterSpacing: 1.5,
	},

	errorTitle: {
		fontFamily: theme.fonts.displayBold,
		fontSize: theme.fontSize.xl,

		color: theme.colours.accent,

		letterSpacing: 1.5,
	},

	errorText: {
		marginTop: theme.spacing.sm,

		fontFamily: theme.fonts.body,
		fontSize: theme.fontSize.sm,

		color: theme.colours.textMuted,

		textAlign: "center",
	},

	backButton: {
		marginTop: theme.spacing.lg,

		minHeight: 44,
		paddingHorizontal: theme.spacing.lg,

		alignItems: "center",
		justifyContent: "center",

		borderWidth: 1,
		borderColor: theme.colours.border,

		borderRadius: theme.radius.md,
	},

	backButtonText: {
		fontFamily: theme.fonts.bodyBold,
		fontSize: theme.fontSize.sm,

		color: theme.colours.text,
	},

	header: {
		flexDirection: "row",
		alignItems: "center",

		paddingHorizontal: theme.spacing.md,
		paddingTop: theme.spacing.sm,
		paddingBottom: theme.spacing.md,
	},

	backButtonSmall: {
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

	headerText: {
		flex: 1,
	},

	eyebrow: {
		fontFamily: theme.fonts.bodyBold,
		fontSize: theme.fontSize.xs,

		color: theme.colours.accent,

		letterSpacing: 2,
	},

	title: {
		marginTop: 2,

		fontFamily: theme.fonts.displayBold,
		fontSize: theme.fontSize.xxl,

		color: theme.colours.text,
	},

	mapContainer: {
		height: 300,

		marginHorizontal: theme.spacing.md,

		overflow: "hidden",

		borderRadius: theme.radius.md,

		borderWidth: 1,
		borderColor: theme.colours.border,
	},

	map: {
		flex: 1,
	},

	content: {
		flex: 1,

		padding: theme.spacing.md,
	},

	stats: {
		flexDirection: "row",

		minHeight: 90,

		backgroundColor: theme.colours.surface,

		borderWidth: 1,
		borderColor: theme.colours.border,

		borderRadius: theme.radius.md,
	},

	stat: {
		flex: 1,

		justifyContent: "center",

		paddingHorizontal: theme.spacing.sm,
	},

	statDivider: {
		width: 1,

		marginVertical: theme.spacing.md,

		backgroundColor: theme.colours.border,
	},

	statValue: {
		fontFamily: theme.fonts.displayBold,
		fontSize: theme.fontSize.lg,

		color: theme.colours.text,

		textAlign: "center",
	},

	statLabel: {
		marginTop: 4,

		fontFamily: theme.fonts.bodyBold,
		fontSize: 8,

		color: theme.colours.textMuted,

		letterSpacing: 1,

		textAlign: "center",
	},

	details: {
		marginTop: theme.spacing.md,

		paddingHorizontal: theme.spacing.md,

		backgroundColor: theme.colours.surface,

		borderWidth: 1,
		borderColor: theme.colours.border,

		borderRadius: theme.radius.md,
	},

	detailRow: {
		minHeight: 48,

		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",

		borderBottomWidth: 1,
		borderBottomColor: theme.colours.border,
	},

	detailLabel: {
		fontFamily: theme.fonts.bodyBold,
		fontSize: 9,

		color: theme.colours.textMuted,

		letterSpacing: 1.5,
	},

	detailValue: {
		fontFamily: theme.fonts.bodyBold,
		fontSize: theme.fontSize.sm,

		color: theme.colours.text,
	},

	navigationButton: {
		minHeight: 58,

		marginTop: theme.spacing.md,

		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",

		backgroundColor: theme.colours.accent,

		borderRadius: theme.radius.md,
	},

	navigationButtonText: {
		fontFamily: theme.fonts.bodyBold,
		fontSize: theme.fontSize.sm,

		color: theme.colours.background,

		letterSpacing: 1.5,
	},

	navigationButtonArrow: {
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