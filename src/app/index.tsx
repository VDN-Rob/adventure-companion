import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text>Cycling Companion</Text>

      <Text>Your offline cycling companion.</Text>

      <Text>No trips yet.</Text>

      <Text>[ + New Trip ]</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
