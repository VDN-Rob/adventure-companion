import { POI } from "@/models/POI";
import { calculateBounds } from "@/utils/calculateMapBounds";
import { useAppServices } from "@/utils/useAppServiceProvider";
import { Camera, Map, Marker } from "@maplibre/maplibre-react-native";
import * as Location from "expo-location";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";

import { MAP_STYLE } from "@/constants/map";
import { Day } from "@/models/Day";

const exampleDay: Day = {
  id: "test-day-01",
  tripId: "test-trip-01",
  date: "2026-08-28",
  title: "Through the Ardennes",
  notes:
    "A long climbing day through forest roads and small villages. Water is limited after the second climb.",
  plannedElevation: 820,
  plannedDistance: 68.5,
};
const examplePois: POI[] = [
    {
        id: "poi-00",
        dayId: "test-day-01",
        name: "Start in Oignies",
        type: "other",
        latitude: 50.023722,
        longitude: 4.639699,
        notes: "Starting point of the adventure",
        visitedAt: null
    },
  {
      id: "poi-01",
      dayId: "test-day-01",
      name: "Forest Spring",
      type: "water",
      latitude: 49.82,
      longitude: 4.62,
      notes: "Small spring beside the trail.",
      visitedAt: null
  },
  {
      id: "poi-02",
      dayId: "test-day-01",
      name: "La Petite Boulangerie",
      type: "food",
      latitude: 49.78,
      longitude: 4.71,
      notes: "Good place for breakfast and coffee.",
      visitedAt: null
  },
  {
      id: "poi-03",
      dayId: "test-day-01",
      name: "Intermarché",
      type: "supermarket",
      latitude: 49.75,
      longitude: 4.83,
      notes: "Last reliable resupply before the hills.",
      visitedAt: null
  },
  {
      id: "poi-04",
      dayId: "test-day-01",
      name: "Camping des Pins",
      type: "accommodation",
      latitude: 49.68,
      longitude: 4.91,
      notes: "Small campsite with showers.",
      visitedAt: null
  },
];

export default function MapScreen() {
    // Retrieve id from parameters
    const { dayId } = useLocalSearchParams<{ dayId: string }>();
    
    // Load databank
    const { poiServices } = useAppServices();
    const [pois, setPois] = useState<POI[]>([]);
    const [bounds, setBounds] = useState<{ minLat: number; maxLat: number; minLng: number; maxLng: number; }|null>(null)
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    
    
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
            // if (!dayId) return;

            // const pois = await poiServices.getPOIsForDay(dayId);
            // setPois(pois);

            setPois(examplePois);

            const coordinates = examplePois
            .filter(
                (poi) =>
                poi.latitude !== null &&
                poi.longitude !== null
            )
            .map((poi) => ({
                latitude: poi.latitude!,
                longitude: poi.longitude!,
            }));

            setBounds(calculateBounds(coordinates));

            setBounds(calculateBounds(coordinates));
            console.log("bounds set");
        }
      
        setupLocationTracking();
        loadElements()

        return () => {
            subscription?.remove();
        };
      }, [dayId]);
    
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
        </Map>
      );
    }

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});