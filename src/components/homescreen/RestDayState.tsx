import { styles } from "@/styling/styles";
import { Text, View } from "react-native";

export function RestDayState() {
    return (
      <View style={styles.restDay}>
        <Text style={styles.restDayTitle}>
          REST DAY
        </Text>
  
        <Text style={styles.restDayText}>
          Nothing planned for today.
        </Text>
      </View>
    );
  }