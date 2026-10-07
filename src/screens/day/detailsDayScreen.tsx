import { POICard } from "@/components/card/POICard";
import { SectionLabel } from "@/components/forms/SectionLabel";
import { getTranslations } from "@/i18n";
import { Day } from "@/models/Day";
import { POI } from "@/models/POI";
import { useAppSettings } from "@/providers/AppSettingsProvider";
import { theme } from "@/styling/theme";
import { useAppServices } from "@/utils/useRepository/useAppServiceProvider";
import NetInfo from "@react-native-community/netinfo";
import * as DocumentPicker from "expo-document-picker";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function DayDetailsScreen() {
	// Retrieve id from parameters
	const { dayId } = useLocalSearchParams<{ dayId: string }>();

	// Load databank
	const { dayServices, poiServices, mapServices, tripMapServices, routeService } = useAppServices();

	// State
	const [day, setDay] = useState<Day | null>(null);
	const [pois, setPois] = useState<POI[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const { settings } = useAppSettings();
	const t = getTranslations(settings.language);

	// Load the right day everytime the screen is loaded
	useFocusEffect(
		useCallback(() => {
		async function loadData() {
			if (!dayId) {
			setError("No day ID was provided");
			setIsLoading(false);
			return;
			}

			try {
			setIsLoading(true);
			setError(null);

			const day = await dayServices.getDayById(dayId);
		
			if (!day) {
				setError("Day not Found");
				return;
			}

			setDay(day);

			const pois = await poiServices.getPOIsForDay(dayId);
			setPois(pois);
			} catch {
			setError("Unable to load day");
			} finally {
			setIsLoading(false);
			}
		}

		loadData();
		}, [dayId])
	);

	async function handleDayMapDownload() {
		try {
			const networkState = await NetInfo.fetch();

			if (!networkState.isConnected) {
				Alert.alert(t.alerts.noInternetConnection.title, t.alerts.noInternetConnection.message);
				return;
			}

			if (!dayId) {
				Alert.alert(t.alerts.downloadFailedNoDay.title, t.alerts.downloadFailedNoDay.message);
				return;
			}

			const region = await tripMapServices.getDayMapRegion(dayId);

			if (!region) {
				Alert.alert(t.alerts.noMapData.title, t.alerts.noMapData.message);
				return;
			}

			const downloadedMaps =
				await mapServices.downloadRequiredRegions([region]);

			if (downloadedMaps.length === 0) {
				Alert.alert(t.alerts.mapAlreadyDownloaded.title, t.alerts.mapAlreadyDownloaded.message);
				return;
			}

			Alert.alert(t.alerts.downloadComplete.title, t.alerts.downloadComplete.message);
		} catch (error) {
			console.error(
				"Failed to download day map:",
				error
			);

			Alert.alert(t.alerts.downloadFailed.title, t.alerts.downloadFailed.message);
		}
	}

	async function handleImportGPX() {
		try {
			const result =
				await DocumentPicker.getDocumentAsync({
					type: [
						"application/gpx+xml",
						"application/xml",
						"text/xml",
						"*/*",
					],
					copyToCacheDirectory: true,
					multiple: false,
				});
	
			if (result.canceled) {
				return;
			}
	
			const file = result.assets[0];
	
			await routeService.importGPX(
				dayId,
				file.uri
			);
	
			Alert.alert(t.alerts.gpxImported.title, t.alerts.gpxImported.message);
		} catch (error) {
			console.error(
				"Failed to import GPX:",
				error
			);
	
			Alert.alert(t.alerts.importFailed.title, t.alerts.importFailed.message);
		}
	}

	if (isLoading) {
		return (
		<View style={styles.centered}>
			<ActivityIndicator
			size="small"
			color={theme.colours.accent}
			/>

			<Text style={styles.loadingText}>
				{t.day.loading}
			</Text>
		</View>
		);
	}

	if (error || !day) {
		return (
		<View style={styles.centered}>
			<Text style={styles.errorTitle}>
				{t.day.notFound}
			</Text>

			<Text style={styles.errorText}>
			{error ?? t.day.unableToLoad}
			</Text>
		</View>
		);
	}

	return (
		<SafeAreaView style={styles.container}>
		<FlatList
			data={pois}
			keyExtractor={(poi) => poi.id}
			renderItem={({ item }) => (
			<POICard
				poi={item}
				onPress={() => editPOI(item.id)}
			/>
			)}
			contentContainerStyle={styles.listContent}
			showsVerticalScrollIndicator={false}
			ItemSeparatorComponent={() => (
			<View style={styles.poiSeparator} />
			)}
			ListHeaderComponent={
			<>
				{/* HEADER */}
				<View style={styles.header}>
				<Pressable
					onPress={() => router.back()}
					style={styles.backButton}
				>
					<Text style={styles.backArrow}>
					←
					</Text>
				</Pressable>

				<View>
					<Text style={styles.eyebrow}>
						{t.day.day.toUpperCase()}
					</Text>

					<Text style={styles.dayNumber}>
					{day.date}
					</Text>
				</View>
				</View>

				{/* TITLE */}
				<View style={styles.titleSection}>
				<Text style={styles.title}>
					{day.title ?? t.day.untitledDay}
				</Text>
				</View>

				{/* STATS */}
				<View style={styles.stats}>
				<View style={styles.stat}>
					<Text style={styles.statValue}>
					{day.plannedDistance !== null
						? `${day.plannedDistance}`
						: "—"}
					</Text>

					<Text style={styles.statUnit}>
						{t.units.kmAbr.toUpperCase()}
					</Text>

					<Text style={styles.statLabel}>
						{t.day.plannedDistance}
					</Text>
				</View>

				<View style={styles.statDivider} />

				<View style={styles.stat}>
					<Text style={styles.statValue}>
					{day.plannedElevation !== null
						? `${day.plannedElevation}`
						: "—"}
					</Text>

					<Text style={styles.statUnit}>
						{t.units.mAbr.toUpperCase()}
					</Text>

					<Text style={styles.statLabel}>
						{t.common.elevation.toUpperCase()}
					</Text>
				</View>
				</View>

				{/* NOTES */}
				{day.notes && (
				<View style={styles.notesSection}>
					<SectionLabel title={t.day.notes} />

					<Text style={styles.notes}>
						{day.notes}
					</Text>
				</View>
				)}

				{/* POIS */}
				<SectionLabel title={t.day.pointsOfInterest} />

				{pois.length === 0 && (
				<View style={styles.emptyPois}>
					<Text style={styles.emptyTitle}>
						{t.day.noWaypoints}
					</Text>

					<Text style={styles.emptyText}>
						{t.day.nothingPlanned}
					</Text>
				</View>
				)}
			</>
			}
			ListFooterComponent={
			<View style={styles.footer}>
				<Pressable
				style={styles.addPoiButton}
				onPress={() => {
					router.push({
					pathname: "/poi/createPoi",
					params: { dayId },
					});
				}}
				>
				<Text style={styles.addPoiPlus}>
					+
				</Text>

				<Text style={styles.addPoiText}>
					{t.day.addPointOfInterest}
				</Text>
				</Pressable>

				<Pressable
				style={styles.mapButton}
				onPress={() => {
					router.push({
					pathname: "/map/map",
					params: { dayId },
					});
				}}
				>
				<Text style={styles.mapButtonText}>
					{t.day.openMap}
				</Text>

				<Text style={styles.mapArrow}>
					→
				</Text>
				</Pressable>

				<Pressable
					style={styles.mapButton}
					onPress={handleDayMapDownload}
				>
					<Text style={styles.mapButtonText}>
						{t.day.downloadOfflineMap}
					</Text>

					<Text style={styles.mapArrow}>
						↓
					</Text>
				</Pressable>
				<Pressable
					style={styles.mapButton}
					onPress={handleImportGPX}
				>
					<Text style={styles.mapButtonText}>
						{t.day.loadGPX}
					</Text>
				</Pressable>

				<Pressable
				style={styles.editButton}
				onPress={() => {
					router.push({
					pathname: "/day/editDay",
					params: { dayId },
					});
				}}
				>
				<Text style={styles.editButtonText}>
					{t.day.editDay}
				</Text>
				</Pressable>
			</View>
			}
		/>
		</SafeAreaView>
	);
}

function editPOI(poiId: string){
	router.push({
		pathname: "/poi/editPOI",
		params: {poiId}
	})
}

const styles = StyleSheet.create({
	container: {
		flex: 1,

		backgroundColor: theme.colours.background,
	},

	listContent: {
		paddingHorizontal: theme.spacing.md,
		paddingTop: theme.spacing.lg,
		paddingBottom: 140,
	},

	header: {
		flexDirection: "row",
		alignItems: "center",

		marginBottom: theme.spacing.lg,
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

	dayNumber: {
		marginTop: 1,

		fontFamily: theme.fonts.body,
		fontSize: theme.fontSize.xs,

		color: theme.colours.textMuted,
	},

	titleSection: {
		marginBottom: theme.spacing.lg,
	},

	title: {
		fontFamily: theme.fonts.displayBold,
		fontSize: theme.fontSize.xxxl,

		color: theme.colours.text,

		letterSpacing: 1,
	},

	stats: {
		flexDirection: "row",

		minHeight: 88,

		marginBottom: theme.spacing.xl,

		backgroundColor: theme.colours.surface,

		borderWidth: 1,
		borderColor: theme.colours.border,

		borderRadius: theme.radius.md,
	},

	stat: {
		flex: 1,

		justifyContent: "center",

		paddingHorizontal: theme.spacing.md,
	},

	statDivider: {
		width: 1,

		marginVertical: theme.spacing.md,

		backgroundColor: theme.colours.border,
	},

	statValue: {
		fontFamily: theme.fonts.displayBold,
		fontSize: theme.fontSize.xxl,

		color: theme.colours.text,
	},

	statUnit: {
		position: "absolute",

		top: 16,
		right: 16,

		fontFamily: theme.fonts.bodyBold,
		fontSize: theme.fontSize.xs,

		color: theme.colours.accent,
	},

	statLabel: {
		marginTop: 1,

		fontFamily: theme.fonts.bodyBold,
		fontSize: 9,

		color: theme.colours.textMuted,

		letterSpacing: 1,
	},

	notesSection: {
		marginBottom: theme.spacing.xl,
	},

	notes: {
		marginTop: theme.spacing.sm,

		fontFamily: theme.fonts.body,
		fontSize: theme.fontSize.sm,

		lineHeight: 20,

		color: theme.colours.textSecondary,
	},

	sectionHeader: {
		flexDirection: "row",
		alignItems: "center",

		marginBottom: theme.spacing.sm,

		gap: theme.spacing.sm,
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

	poiSeparator: {
		height: theme.spacing.sm,
	},

	emptyPois: {
		paddingVertical: theme.spacing.lg,
		paddingHorizontal: theme.spacing.md,

		marginBottom: theme.spacing.md,

		backgroundColor: theme.colours.surface,

		borderWidth: 1,
		borderColor: theme.colours.border,

		borderRadius: theme.radius.md,

		alignItems: "center",
	},

	emptyTitle: {
		fontFamily: theme.fonts.bodyBold,
		fontSize: theme.fontSize.sm,

		color: theme.colours.textMuted,

		letterSpacing: 1.5,
	},

	emptyText: {
		marginTop: theme.spacing.xs,

		fontFamily: theme.fonts.body,
		fontSize: theme.fontSize.xs,

		color: theme.colours.textMuted,

		textAlign: "center",
	},

	footer: {
		marginTop: theme.spacing.lg,

		gap: theme.spacing.sm,
	},

	addPoiButton: {
		minHeight: 52,

		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",

		borderWidth: 1,
		borderColor: theme.colours.border,

		borderStyle: "dashed",

		borderRadius: theme.radius.md,
	},

	addPoiPlus: {
		fontFamily: theme.fonts.displayBold,
		fontSize: theme.fontSize.xl,

		color: theme.colours.accent,

		marginRight: theme.spacing.sm,
	},

	addPoiText: {
		fontFamily: theme.fonts.bodyBold,
		fontSize: theme.fontSize.xs,

		color: theme.colours.text,

		letterSpacing: 1.5,
	},

	mapButton: {
		minHeight: 58,

		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",

		backgroundColor: theme.colours.surface,

		borderWidth: 1,
		borderColor: theme.colours.accent,

		borderRadius: theme.radius.md,
	},

	mapButtonText: {
		fontFamily: theme.fonts.bodyBold,
		fontSize: theme.fontSize.sm,

		color: theme.colours.text,

		letterSpacing: 2,
	},

	mapArrow: {
		marginLeft: theme.spacing.sm,

		fontFamily: theme.fonts.displayBold,
		fontSize: theme.fontSize.lg,

		color: theme.colours.accent,
	},

	editButton: {
		minHeight: 44,

		alignItems: "center",
		justifyContent: "center",
	},

	editButtonText: {
		fontFamily: theme.fonts.bodyBold,
		fontSize: theme.fontSize.xs,

		color: theme.colours.textMuted,

		letterSpacing: 1.5,
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
});