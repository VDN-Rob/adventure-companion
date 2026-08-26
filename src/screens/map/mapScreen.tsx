import { POI } from "@/models/POI";
import { calculateBounds } from "@/utils/calculateMapBounds";
import { useAppServices } from "@/utils/useAppServiceProvider";
import { Camera, Map, Marker } from "@maplibre/maplibre-react-native";
import * as Location from "expo-location";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";


export default function MapScreen() {
    // Retrieve id from parameters
    const { dayId } = useLocalSearchParams<{ dayId: string }>();
    
    // Load databank
    const { poiServices } = useAppServices();
    const [pois, setPois] = useState<POI[]>([]);
    const [zoom, setZoom] = useState<number>(1);
    const [bounds, setBounds] = useState<{ minLat: number; maxLat: number; minLng: number; maxLng: number; }|null>(null)
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    
    
    useEffect(() => {
        async function requestLocation() {
          const { status } =
            await Location.requestForegroundPermissionsAsync();
      
          if (status !== "granted") {
            console.log("Location permission denied");
            return;
          }

          try {
            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });
    
            console.log("LOCATION:", location.coords);
    
            setLocation(location);
            } catch (error) {
                console.error("Location error:", error);
            }
        }

        let subscription: Location.LocationSubscription | null = null;

        async function startLocationTracking() {
            const { status } =
                await Location.requestForegroundPermissionsAsync();

            if (status !== "granted") {
                return;
            }

            subscription = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    distanceInterval: 10,
                },
                (location) => {
                    setLocation(location);
                }
            );
        }

        async function loadElements() {
            if (!dayId) return;

            const pois = await poiServices.getPOIsForDay(dayId);
            setPois(pois);

            const coordinates = pois
                .filter(poi => poi.latitude !== null && poi.longitude !== null)
                .map(poi => ({
                    latitude: poi.latitude!,
                    longitude: poi.longitude!,
                }));

            setBounds(calculateBounds(coordinates));
        }
      
        requestLocation();
        startLocationTracking();
        loadElements()

        return () => {
            subscription?.remove();
        };
      }, [dayId]);
    
      return (
        <Map
            style={{ flex: 1 }}
            mapStyle="https://demotiles.maplibre.org/style.json"
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