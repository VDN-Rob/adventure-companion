import { Trip } from "@/models/Trip";
import { Pressable, Text, View } from "react-native";

type TripCardProps = {
  trip: Trip;
  onPress: () => void;
};

export function TripCard({ trip, onPress }: TripCardProps) {
    return (
      <Pressable onPress={onPress}>
        <View>
          <Text>Trip: {trip.name}</Text>
          <Text>Starting on {trip.startDate} to 
          {trip.endDate!==null && (<Text>{trip.endDate}</Text>)}{trip.endDate===null && (<Text> infinity and beyond!</Text>)}
          </Text>
          
          {trip.description !== null && (
            <Text>{trip.description}</Text>
          )}
        </View>
      </Pressable>
    );
  }