import { POI } from "@/models/POI";
import { Pressable, Text, View } from "react-native";

type POICardProps = {
    poi: POI;
    onPress: () => void;
}

export function POICard({ poi, onPress }: POICardProps) {
    return (
        <Pressable onPress={onPress}>
            <View>
                <Text>POI: {poi.name}</Text>
                <Text>{poi.type}</Text>
                {poi.latitude !== null && poi.longitude !== null && (
                    <Text>Location: {poi.latitude}, {poi.longitude}</Text>
                )}
                {poi.notes !== null && (
                    <Text>notes: {poi.notes}</Text>
                )}
            </View>
        </Pressable>
    )
}