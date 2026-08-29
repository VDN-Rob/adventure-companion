import { styles } from "@/styling/styles";
import { Text, View } from "react-native";

export function RestDayState() {
    return (
      <View style={styles.restDay}>
        <Text style={styles.restDayTitle}>
          REST DAY
        </Text>
  
        <Text style={styles.restDayText}>
          No cycling day planned for today.
        </Text>
      </View>
    );
  }