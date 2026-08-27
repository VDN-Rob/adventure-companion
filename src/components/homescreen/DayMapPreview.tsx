import { Map } from "@maplibre/maplibre-react-native";
import { StyleSheet } from "react-native";

import { MAP_STYLE } from "@/constants/map";

export function DayMapPreview() {
  return (
    <Map
      style={styles.map}
      mapStyle={MAP_STYLE}
    />
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});