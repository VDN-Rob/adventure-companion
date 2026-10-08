import { MapNavigationControls } from "@/components/map/MapNavigationControls";
import { RouteNavigationInfo } from "@/components/map/RouteNavigationInfo";
import { MAP_STYLE } from "@/constants/map";
import { POI } from "@/models/POI";
import { Route } from "@/models/Route";
import { RouteProgress } from "@/services/RouteNavigationService";
import { calculateBounds } from "@/utils/map/calculateMapBounds";
import { useAppServices } from "@/utils/useRepository/useAppServiceProvider";
import {
	Camera,
	GeoJSONSource,
	Layer,
	Map,
	Marker,
} from "@maplibre/maplibre-react-native";
import * as Location from "expo-location";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function formatDistance(meters: number): string {
	if (meters >= 1000) {
		return `${(meters / 1000).toFixed(1)} km`;
	}

	return `${Math.round(meters)} m`;
}

export default function MapScreen() {
	// Retrieve id from parameters
	const { dayId } = useLocalSearchParams<{ dayId: string }>();

	// Load services
	const {
		poiServices,
		routeService,
		routeNavigationService,
	} = useAppServices();

	const [pois, setPois] = useState<POI[]>([]);
	const [bounds, setBounds] = useState<{
		minLat: number;
		maxLat: number;
		minLng: number;
		maxLng: number;
	} | null>(null);

	const [location, setLocation] =
		useState<Location.LocationObject | null>(null);

	const [routes, setRoutes] = useState<Route[]>([]);
	const [activeRoute, setActiveRoute] =
		useState<Route | null>(null);
	const [routeProgress, setRouteProgress] =
		useState<RouteProgress | null>(null);

	const [isFollowingUser, setIsFollowingUser] =
		useState(false);

	const routeGeoJSON = {
		type: "FeatureCollection" as const,
		features: routes
			.filter(
				(route) =>
					route.trackPoints.length >= 2,
			)
			.map((route) => ({
				type: "Feature" as const,

				properties: {
					routeId: route.id,
					name: route.name ?? "Route",
				},

				geometry: {
					type: "LineString" as const,

					coordinates: route.trackPoints.map(
						(point) => [
							point.longitude,
							point.latitude,
						],
					),
				},
			})),
	};

	useEffect(() => {
		let subscription:
			| Location.LocationSubscription
			| null = null;

		async function setupLocationTracking() {
			const { status } =
				await Location.requestForegroundPermissionsAsync();

			if (status !== "granted") {
				console.log(
					"Location permission denied",
				);
				return;
			}

			try {
				const currentLocation =
					await Location.getCurrentPositionAsync({
						accuracy: Location.Accuracy.High,
					});

				console.log(
					"LOCATION:",
					currentLocation.coords,
				);

				setLocation(currentLocation);

				subscription =
					await Location.watchPositionAsync(
						{
							accuracy:
								Location.Accuracy.High,
							distanceInterval: 10,
						},
						(location) => {
							setLocation(location);
						},
					);
			} catch (error) {
				console.error(
					"Location error:",
					error,
				);
			}
		}

		async function loadElements() {
			if (!dayId) {
				return;
			}

			const pois =
				await poiServices.getPOIsForDay(dayId);

			setPois(pois);

			const routes =
				await routeService.getRoutesForDay(dayId);

			setRoutes(routes);

			const coordinates = [
				...pois
					.filter(
						(poi) =>
							poi.latitude !== null &&
							poi.longitude !== null,
					)
					.map((poi) => ({
						latitude: poi.latitude!,
						longitude: poi.longitude!,
					})),

				...routes.flatMap((route) =>
					route.trackPoints.map(
						(point) => ({
							latitude:
								point.latitude,
							longitude:
								point.longitude,
						}),
					),
				),
			];

			setBounds(
				calculateBounds(coordinates),
			);
		}

		setupLocationTracking();
		loadElements();

		return () => {
			subscription?.remove();
		};
	}, [
		dayId,
		poiServices,
		routeService,
	]);

	useEffect(() => {
		if (!activeRoute || !location) {
			setRouteProgress(null);
			return;
		}

		const progress =
			routeNavigationService.calculateProgress(
				activeRoute,
				{
					latitude:
						location.coords.latitude,
					longitude:
						location.coords.longitude,
				},
			);

		setRouteProgress(progress);
	}, [
		activeRoute,
		location,
		routeNavigationService,
	]);

	return (
		<View style={styles.container}>
			<Map
				style={styles.map}
				mapStyle={MAP_STYLE}
				onRegionWillChange={(event) => {
					if (
						isFollowingUser &&
						event.nativeEvent
							.userInteraction
					) {
						setIsFollowingUser(false);
					}
				}}
			>
				{isFollowingUser ? (
					<Camera
						trackUserLocation="course"
					/>
				) : (
					bounds && (
						<Camera
							bounds={[
								bounds.minLng,
								bounds.minLat,
								bounds.maxLng,
								bounds.maxLat,
							]}
							padding={{
								top: 50,
								bottom: 50,
								left: 50,
								right: 50,
							}}
						/>
					)
				)}

				{pois.map((poi) => {
					if (
						poi.latitude === null ||
						poi.longitude === null
					) {
						return null;
					}

					return (
						<Marker
							key={poi.id}
							id={poi.id}
							lngLat={[
								poi.longitude,
								poi.latitude,
							]}
							onPress={() =>
								Alert.alert(
									poi.name,
									poi.type +
										poi.notes,
								)
							}
						>
							<View
								style={
									styles.poiMarker
								}
							/>
						</Marker>
					);
				})}

				{location && (
					<Marker
						id="current-location"
						lngLat={[
							location.coords
								.longitude,
							location.coords
								.latitude,
						]}
					>
						<View
							style={
								styles.locationMarker
							}
						/>
					</Marker>
				)}

				<GeoJSONSource
					id="imported-routes"
					data={routeGeoJSON}
				>
					<Layer
						id="imported-routes-line"
						type="line"
						style={{
							lineColor: "#007AFF",
							lineWidth: 4,
							lineCap: "round",
							lineJoin: "round",
						}}
					/>
				</GeoJSONSource>
			</Map>

			<SafeAreaView
				pointerEvents="box-none"
				style={styles.overlay}
			>
				{!activeRoute && routes.length > 0 && (
					<View style={styles.routeSelector}>
						<Text style={styles.routeSelectorTitle}>
							Routes
						</Text>

						{routes.map((route) => (
							<Pressable
								key={route.id}
								style={styles.routeButton}
								onPress={() => {
									routeNavigationService.reset(
										route.id,
									);
									setActiveRoute(route);
									setIsFollowingUser(true);
								}}
							>
								<View style={styles.routeButtonContent}>
									<View style={styles.routeButtonText}>
										<Text
											style={
												styles.routeName
											}
											numberOfLines={1}
										>
											{route.name ??
												"Unnamed route"}
										</Text>

										{route.distanceMeters !=
											null && (
											<Text
												style={
													styles.routeDistance
												}
											>
												{formatDistance(
													route.distanceMeters,
												)}
											</Text>
										)}
									</View>

									<Text
										style={
											styles.startRouteText
										}
									>
										Start
									</Text>
								</View>
							</Pressable>
						))}
					</View>
				)}
				{activeRoute && (
					<MapNavigationControls
						isFollowingUser={
							isFollowingUser
						}
						onRecenter={() => {
							setIsFollowingUser(
								true,
							);
						}}
						onStop={() => {
							routeNavigationService.reset(
								activeRoute.id,
							);

							setActiveRoute(null);
							setRouteProgress(
								null,
							);
							setIsFollowingUser(
								false,
							);
						}}
					/>
				)}

				<RouteNavigationInfo
					routeName={activeRoute?.name}
					progress={routeProgress}
				/>
			</SafeAreaView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},

	map: {
		...StyleSheet.absoluteFill,
	},

	overlay: {
		...StyleSheet.absoluteFill,
	},

	poiMarker: {
		width: 30,
		height: 30,
		backgroundColor: "red",
		borderRadius: 15,
		borderWidth: 2,
		borderColor: "white",
	},

	locationMarker: {
		width: 30,
		height: 30,
		backgroundColor: "blue",
		borderRadius: 15,
		borderWidth: 2,
		borderColor: "white",
	},

	routeSelector: {
		position: "absolute",
		left: 16,
		right: 16,
		bottom: 24,
		padding: 16,
		borderRadius: 16,
		backgroundColor: "white",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 4,
		},
		shadowOpacity: 0.2,
		shadowRadius: 8,
		elevation: 5,
	},

	routeSelectorTitle: {
		marginBottom: 12,
		fontSize: 18,
		fontWeight: "700",
	},

	routeButton: {
		paddingVertical: 12,
		borderTopWidth: 1,
		borderTopColor: "#E5E5E5",
	},

	routeButtonContent: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},

	routeButtonText: {
		flex: 1,
		marginRight: 12,
	},

	routeName: {
		fontSize: 16,
		fontWeight: "600",
	},

	routeDistance: {
		marginTop: 3,
		fontSize: 13,
		color: "#777",
	},

	startRouteText: {
		paddingHorizontal: 14,
		paddingVertical: 8,
		borderRadius: 16,
		backgroundColor: "#007AFF",
		color: "white",
		fontSize: 14,
		fontWeight: "600",
	},
});