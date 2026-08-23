import { Day } from "@/models/Day";
import { Pressable, Text, View } from "react-native";

type DayCardProps = {
  day: Day;
  onPress: () => void;
};

export function DayCard({ day, onPress }: DayCardProps) {
    return (
      <Pressable onPress={onPress}>
        <View>
          <Text>Day: {day.title}</Text>
          <Text>{day.date}</Text>
  
          {day.plannedDistance !== null && (
            <Text>{day.plannedDistance} km</Text>
          )}
  
          {day.plannedElevation !== null && (
            <Text>{day.plannedElevation} m elevation</Text>
          )}
        </View>
      </Pressable>
    );
  }