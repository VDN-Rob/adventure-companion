import { POI } from "@/models/POI";
import { calculateBounds } from "@/utils/map/calculateMapBounds";
import { useAppServices } from "@/utils/useRepository/useAppServiceProvider";
import { Camera, GeoJSONSource, Layer, Map, Marker } from "@maplibre/maplibre-react-native";
import * as Location from "expo-location";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Button, StyleSheet, View } from "react-native";

import { RouteNavigationInfo } from "@/components/map/RouteNavigationInfo";
import { MAP_STYLE } from "@/constants/map";
import { Route } from "@/models/Route";
import { RouteProgress } from "@/services/RouteNavigationService";

export default function MapScreen() {
	// Retrieve id from parameters
	const { dayId } = useLocalSearchParams<{ dayId: string }>();
	
	// Load databank
	const { poiServices, routeService, routeNavigationService } = useAppServices();
	const [pois, setPois] = useState<POI[]>([]);
	const [bounds, setBounds] = useState<{ minLat: number; maxLat: number; minLng: number; maxLng: number; }|null>(null)
	const [location, setLocation] = useState<Location.LocationObject | null>(null);

	const [routes, setRoutes] = useState<Route[]>([]);
	const [activeRoute, setActiveRoute] = useState<Route | null>(null);
	const [routeProgress, setRouteProgress] = useState<RouteProgress | null>(null);
	
	const routeGeoJSON = {
		type: "FeatureCollection" as const,
		features: routes
			.filter(
				(route) =>
					route.trackPoints.length >= 2
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
						]
					),
				},
			})),
	};

	useEffect(() => {
		let subscription: Location.LocationSubscription | null = null;

		async function setupLocationTracking() {
			const { status } =
			await Location.requestForegroundPermissionsAsync();
		
			if (status !== "granted") {
			console.log("Location permission denied");
			return;
			}
		
			try {
			const currentLocation =
				await Location.getCurrentPositionAsync({
				accuracy: Location.Accuracy.High,
				});
		
			console.log("LOCATION:", currentLocation.coords);
		
			// Set the initial position immediately
			setLocation(currentLocation);
		
			// Then keep it updated
			subscription = await Location.watchPositionAsync(
				{
					accuracy: Location.Accuracy.High,
					distanceInterval: 10,
				},
					(location) => {
					setLocation(location);
				}
			);
			} catch (error) {
			console.error("Location error:", error);
			}
		}

		async function loadElements() {
			if (!dayId) return;

			const pois = await poiServices.getPOIsForDay(dayId);
			setPois(pois);

			const routes = await routeService.getRoutesForDay(dayId);
			setRoutes(routes)

			const coordinates = [
				...pois
					.filter(
						(poi) =>
							poi.latitude !== null &&
							poi.longitude !== null
					)
					.map((poi) => ({
						latitude: poi.latitude!,
						longitude: poi.longitude!,
					})),
			
				...routes.flatMap((route) =>
					route.trackPoints.map((point) => ({
						latitude: point.latitude,
						longitude: point.longitude,
					}))
				),
			];
			
			setBounds(calculateBounds(coordinates));
		}
	
		setupLocationTracking();
		loadElements()

		return () => {
			subscription?.remove();
		};
	}, [dayId, poiServices, routeService]);
	
	useEffect(() => {
		if (!activeRoute || !location) {
			setRouteProgress(null);
			return;
		}
	
		const progress = routeNavigationService.calculateProgress(
			activeRoute,
			{latitude: location.coords.latitude, longitude: location.coords.longitude},
		);
	
		setRouteProgress(progress);
	}, [activeRoute, location, routeNavigationService]);

	return (
		<Map
			style={{ flex: 1 }}
			mapStyle={MAP_STYLE}
			>
			{bounds && (
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
			)}

			{pois.map((poi) => {
				if (poi.latitude === null || poi.longitude === null) {
					return null;
				}

				return (
					<Marker
						key={poi.id}
						id={poi.id}
						lngLat={[poi.longitude, poi.latitude]}
						onPress={() => Alert.alert(poi.name, poi.type + poi.notes)}
					>
						<View
							style={{
								width: 30,
								height: 30,
								backgroundColor: "red",
								borderRadius: 15,
								borderWidth: 2,
								borderColor: "white",
							}}
						/>
					</Marker>
				);
			})}

			{location && (
				<Marker
					id="current-location"
					lngLat={[
						location.coords.longitude,
						location.coords.latitude,
					]}
				>
					<View
						style={{
							width: 30,
							height: 30,
							backgroundColor: "blue",
							borderRadius: 15,
							borderWidth: 2,
							borderColor: "white",
						}}
					/>
				</Marker>
			)}

			{/* <Button
				title="Zoom in"
				onPress={() => setZoom(zoom+1)}
			/>
			<Button
				title="Zoom out"
				onPress={() => setZoom(zoom-1)}
			/> */}

			{routes.map((route) => (
				<Button
					key={route.id}
					title={
						activeRoute?.id === route.id
							? `Following ${route.name ?? "route"}`
							: route.name ?? "Follow route"
					}
					onPress={() => {
						routeNavigationService.reset(route.id);
						setActiveRoute(route);
						setRouteProgress(null);
					}}
				/>
			))}

			{activeRoute && (
				<Button
					title="Stop navigation"
					onPress={() => {
						routeNavigationService.reset(activeRoute.id);
						setActiveRoute(null);
						setRouteProgress(null);
					}}
				/>
			)}
			<RouteNavigationInfo progress={routeProgress} />
			
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
	);
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});