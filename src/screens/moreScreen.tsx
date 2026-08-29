import { MenuItem } from "@/components/forms/MenuItem";
import { BottomNavigation } from "@/components/homescreen/BottomNavigation";
import { theme } from "@/styling/theme";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function MoreScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          MENU
        </Text>

        <Text style={styles.subtitle}>
          YOUR ADVENTURE
        </Text>

        <View style={styles.menu}>
            <MenuItem
              icon="⚑"
              title="Trips"
              description="Your adventures"
              onPress={() => { router.push("/trip/trips") }}
            />

            <MenuItem
              icon="◇"
              title="Finances"
              description="Money spent on the road"
              onPress={() => { router.push("/finance/finance")}}
            />

            <MenuItem
              icon="✎"
              title="Diary"
              description="Your memories from the road"
              onPress={() => { router.push("/diary/detailsDiary") }}
            />

            <MenuItem
                icon="⚙"
                title="Settings"
                onPress={() => {
                console.log("Settings");
                }}
            />
            </View>
      </View>

      <BottomNavigation
        activeTab="more"
        items={[
          {
            key: "day",
            icon: "●",
            label: "Home",
            onPress: () => router.push("/"),
          },
          {
            key: "map",
            icon: "◇",
            label: "Map",
            onPress: () => router.push("/map/map"),
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colours.background,
  },

  content: {
    flex: 1,

    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.xl,
  },

  title: {
    fontFamily: theme.fonts.displayBold,
    fontSize: theme.fontSize.xxxl,

    color: theme.colours.text,

    letterSpacing: 2,
  },

  subtitle: {
    marginTop: 2,

    fontFamily: theme.fonts.bodyBold,
    fontSize: theme.fontSize.xs,

    color: theme.colours.accent,

    letterSpacing: 2,
  },

  menu: {
    marginTop: theme.spacing.xl,
    gap: theme.spacing.md,
  },
});