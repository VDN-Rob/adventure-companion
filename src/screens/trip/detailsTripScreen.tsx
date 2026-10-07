import { DayCard } from "@/components/card/DayCard";
import { getTranslations } from "@/i18n";
import { Day } from "@/models/Day";
import { POI } from "@/models/POI";
import { Trip } from "@/models/Trip";
import { useAppSettings } from "@/providers/AppSettingsProvider";
import { theme } from "@/styling/theme";
import { useAppServices } from "@/utils/useRepository/useAppServiceProvider";
import NetInfo from "@react-native-community/netinfo";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TripDetailsScreen() {
	// Retrieve id from parameters
	const { id: tripId } = useLocalSearchParams<{ id: string }>();

	// Use application layer to access databank
	const { tripServices, tripMapServices, mapServices, poiServices } = useAppServices();

	// State
	const [trip, setTrip] = useState<Trip>();
	const [days, setDays] = useState<Day[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [statistics, setStatistics] = useState({
		totalDistance: 0,
		totalElevation: 0,
	});
	const [poisByDay, setPoisByDay] = useState<Record<string, POI[]>>({});
	
	const [isDownloadingMaps, setIsDownloadingMaps] = useState(false);

	const { settings } = useAppSettings();
	const t = getTranslations(settings.language)
	
	// Load the right trip everytime the screen is loaded
	useFocusEffect(
		useCallback(() => {
		async function loadData() {
			if (!tripId) {
				setError("No trip ID was provided.");
				setIsLoading(false);
				return;
			}

			try {
				setIsLoading(true);
				setError(null);

				const result = await tripServices.getTripDetails(tripId);

				if (result === null) {
					setError("Trip not found.");
					return;
				}

				setTrip(result.trip);
				setDays(result.days);

				const loadedPois: Record<string, POI[]> = {};

				for (const day of result.days) {
					loadedPois[day.id] = await poiServices.getPOIsForDay(day.id);

					// Route service isn't implemented yet.
					console.log(
					`[TripDetails] Route loading not implemented for day ${day.id}`
					);
				}

				setPoisByDay(loadedPois);

				const statistics = await tripServices.calculateTripStatistics(tripId);
				setStatistics(statistics);
			} catch {
				setError("Unable to load trip.");
			} finally {
				setIsLoading(false);
			}
		}

		loadData();

		
		}, [tripId])
	);

	if (isLoading) {
		return (
		<View style={styles.centered}>
			<ActivityIndicator
			size="small"
			color={theme.colours.accent}
			/>

			<Text style={styles.loadingText}>
				{t.adventures.loadingAdventure}
			</Text>
		</View>
		);
	}

	if (error || !trip) {
		return (
		<View style={styles.centered}>
			<Text style={styles.errorTitle}>
				{t.adventures.notFound}
			</Text>

			<Text style={styles.errorText}>
			{error ?? t.adventures.notFoundDesc}
			</Text>
		</View>
		);
	}

	async function handleTripMapDownloadByDay() {
		if (isDownloadingMaps) {
			return;
		}
	
		setIsDownloadingMaps(true);
	
		try {
			const networkState = await NetInfo.fetch();

			if (!networkState.isConnected) {
				Alert.alert(t.alerts.noInternetConnection.title, t.alerts.noInternetConnection.message);
	
				return;
			}

			const regions = await tripMapServices.getTripMapRegions(tripId, "day");

			if (regions.length === 0) {
				Alert.alert(t.alerts.noMapData.title, t.alerts.noMapData.message);

				return;
			}

			const downloadedMaps = await mapServices.downloadRequiredRegions(regions);

			if (downloadedMaps.length === 0) {
				Alert.alert(t.alerts.mapAlreadyDownloaded.title, t.alerts.mapAlreadyDownloaded.message);

				return;
			}

			Alert.alert(
				t.alerts.downloadComplete.title,
				`${downloadedMaps.length} map region${
					downloadedMaps.length === 1 ? "" : "s"
				} downloaded.`
			);
		} catch (error) {
			console.error(
				"Failed to download trip day maps:",
				error
			);

			Alert.alert(t.alerts.downloadFailed.title, t.alerts.downloadFailed.message);
		} finally {
			setIsDownloadingMaps(false);
		}
	}

	function tripDownloadWarning() {
		Alert.alert(t.alerts.downloadMaps.title, t.alerts.downloadMaps.message,
			[
				{
					text: t.common.cancel,
					style: "cancel",
				},
				{
					text: t.common.download,
					onPress: handleTripMapDownloadByDay,
				},
			]
		);
	}

	return (
		<SafeAreaView style={styles.container}>
		<FlatList
			data={days}
			keyExtractor={(day) => day.id}
			renderItem={({ item, index }) => (
			<View>
				<DayCard
				day={item}
				pois={poisByDay[item.id] ?? []}
				dayNumber={index + 1}
				onPress={() => handleDetailsDay(item.id)}
				/>
			</View>
			)}
			ItemSeparatorComponent={() => (
			<View style={styles.daySeparator} />
			)}
			showsVerticalScrollIndicator={false}
			contentContainerStyle={styles.content}
			ListHeaderComponent={
			<>
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
							{t.adventures.adventure.toUpperCase()}
						</Text>

						<Text style={styles.headerSubtext}>
							{t.adventures.subHeader.toUpperCase()}
						</Text>
					</View>
				</View>

				{/* TRIP TITLE */}
				<View style={styles.titleSection}>
				<Text style={styles.title}>
					{trip.name}
				</Text>

				<Text style={styles.dates}>
					{trip.startDate}
					{trip.endDate
					? ` ${t.common.to} ${trip.endDate}`
					: ""}
				</Text>
				</View>

				{/* STATISTICS */}
				<View style={styles.stats}>
				<View style={styles.stat}>
					<Text style={styles.statValue}>
					{days.length}
					</Text>

					<Text style={styles.statUnit}>
						{t.day.day.toUpperCase()}
					</Text>

					<Text style={styles.statLabel}>
						{t.adventures.statAdventure.toUpperCase()}
					</Text>
				</View>

				<View style={styles.statDivider} />

				<View style={styles.stat}>
					<Text style={styles.statValue}>
					{statistics.totalDistance}
					</Text>

					<Text style={styles.statUnit}>
						{t.units.kmAbr.toUpperCase()}
					</Text>

					<Text style={styles.statLabel}>
						{t.common.distance.toUpperCase()}
					</Text>
				</View>

				<View style={styles.statDivider} />

				<View style={styles.stat}>
					<Text style={styles.statValue}>
					{statistics.totalElevation}
					</Text>

					<Text style={styles.statUnit}>
						{t.units.mAbr.toUpperCase()}
					</Text>

					<Text style={styles.statLabel}>
						{t.common.elevation.toUpperCase()}
					</Text>
				</View>
				</View>

				{/* DESCRIPTION */}
				{trip.description && (
				<Text style={styles.description}>
					{trip.description}
				</Text>
				)}

				{/* SCHEDULE HEADER */}
				<SectionLabel title={t.adventures.scheduleSectionTitle.toUpperCase()} />

				{days.length === 0 && (
				<View style={styles.emptyDays}>
					<Text style={styles.emptyTitle}>
						{t.adventures.noDays}
					</Text>

					<Text style={styles.emptyText}>
						{t.adventures.noDaysDesc}
					</Text>
				</View>
				)}
			</>
			}
			ListFooterComponent={
			<>
				{/* ADD DAY */}
				<Pressable
				style={styles.addDayButton}
				onPress={() => {
					handleAddDay(trip.id);
				}}
				>
				<Text style={styles.addDayPlus}>
					+
				</Text>
				</Pressable>

				{/* MAP SECTION */}
				<View style={styles.mapSection}>
				<SectionLabel title={t.maps.offlineMaps.toUpperCase()} />

				<Text style={styles.mapDescription}>
					{t.adventures.offlineMapDesc}
				</Text>

				<Pressable
					style={styles.downloadButton}
					onPress={tripDownloadWarning}
					disabled={isDownloadingMaps}
				>
					<Text style={styles.downloadText}>
					{isDownloadingMaps
						? t.maps.downloadingMaps.toUpperCase()
						: t.maps.downloadMaps.toUpperCase()}
					</Text>

					<Text style={styles.downloadArrow}>
					↓
					</Text>
				</Pressable>
				</View>

				{/* EDIT */}
				<Pressable
				style={styles.editButton}
				onPress={() => {
					handleEditTrip(trip.id);
				}}
				>
				<Text style={styles.editText}>
					{t.adventures.editAdventure.toUpperCase()}
				</Text>
				</Pressable>
			</>
			}
		/>
		</SafeAreaView>
	);
}

function SectionLabel({ title }: { title: string }) {
	return (
		<View style={styles.sectionHeader}>
			<Text style={styles.sectionTitle}>
				{title}
			</Text>

			<View style={styles.sectionLine} />
		</View>
	);
}

function handleAddDay(tripId: string){
	router.push({
		pathname: "/day/createDay",
		params: {tripId}
	})
}

function handleDetailsDay(dayId: string){
	router.push({
		pathname: "/day/detailsDay",
		params: {dayId}
	})
}

function handleEditTrip(id: string){
	router.push({
		pathname: "/trip/editTrip",
		params: {id}
	})
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.colours.background,
	},

	content: {
		paddingHorizontal: theme.spacing.md,
		paddingTop: theme.spacing.lg,
		paddingBottom: 140,
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

	headerSubtext: {
		marginTop: 2,

		fontFamily: theme.fonts.body,
		fontSize: 9,

		color: theme.colours.textMuted,

		letterSpacing: 1,
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

	dates: {
		marginTop: theme.spacing.xs,

		fontFamily: theme.fonts.body,
		fontSize: theme.fontSize.sm,

		color: theme.colours.textSecondary,
	},

	stats: {
		flexDirection: "row",

		minHeight: 92,

		marginBottom: theme.spacing.lg,

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
		fontSize: theme.fontSize.xl,

		color: theme.colours.text,
	},

	statUnit: {
		marginTop: -2,

		fontFamily: theme.fonts.bodyBold,
		fontSize: 9,

		color: theme.colours.accent,
	},

	statLabel: {
		marginTop: 3,

		fontFamily: theme.fonts.bodyBold,
		fontSize: 8,

		color: theme.colours.textMuted,

		letterSpacing: 1,
	},

	description: {
		marginBottom: theme.spacing.xl,

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

	daySeparator: {
		height: theme.spacing.sm,
	},

	emptyDays: {
		padding: theme.spacing.lg,

		marginBottom: theme.spacing.md,

		alignItems: "center",

		backgroundColor: theme.colours.surface,

		borderWidth: 1,
		borderColor: theme.colours.border,

		borderRadius: theme.radius.md,
	},

	emptyTitle: {
		fontFamily: theme.fonts.bodyBold,
		fontSize: theme.fontSize.sm,

		color: theme.colours.textMuted,

		letterSpacing: 1.5,
	},

	emptyText: {
		maxWidth: 280,

		marginTop: theme.spacing.xs,

		fontFamily: theme.fonts.body,
		fontSize: theme.fontSize.xs,

		lineHeight: 18,

		color: theme.colours.textMuted,

		textAlign: "center",
	},

	addDayButton: {
		minHeight: 52,

		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",

		marginTop: theme.spacing.md,

		borderWidth: 1,
		borderColor: theme.colours.border,
		borderStyle: "dashed",

		borderRadius: theme.radius.md,
	},

	addDayPlus: {
		marginRight: theme.spacing.sm,

		fontFamily: theme.fonts.displayBold,
		fontSize: theme.fontSize.xl,

		color: theme.colours.accent,
	},

	addDayText: {
		fontFamily: theme.fonts.bodyBold,
		fontSize: theme.fontSize.xs,

		color: theme.colours.text,

		letterSpacing: 1.5,
	},

	mapSection: {
		marginTop: theme.spacing.xxl,
	},

	mapDescription: {
		marginBottom: theme.spacing.sm,

		fontFamily: theme.fonts.body,
		fontSize: theme.fontSize.xs,

		color: theme.colours.textMuted,
	},

	downloadButton: {
		minHeight: 54,

		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",

		backgroundColor: theme.colours.surface,

		borderWidth: 1,
		borderColor: theme.colours.accent,

		borderRadius: theme.radius.md,
	},

	downloadText: {
		fontFamily: theme.fonts.bodyBold,
		fontSize: theme.fontSize.sm,

		color: theme.colours.text,

		letterSpacing: 1.5,
	},

	downloadArrow: {
		marginLeft: theme.spacing.sm,

		fontFamily: theme.fonts.displayBold,
		fontSize: theme.fontSize.lg,

		color: theme.colours.accent,
	},

	editButton: {
		minHeight: 48,

		alignItems: "center",
		justifyContent: "center",

		marginTop: theme.spacing.md,
	},

	editText: {
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