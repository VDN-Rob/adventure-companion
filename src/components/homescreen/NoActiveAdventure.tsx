import { theme } from "@/styling/theme";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export function NoActiveAdventure() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>NO ACTIVE ADVENTURE</Text>

      <Text style={styles.description}>
        Choose an adventure to continue,
        {"\n"}
        or create a new one to get started.
      </Text>

      <Pressable
        style={styles.button}
        onPress={() => router.push("/trip/trips")}
      >
        <Text style={styles.buttonText}>
          ADVENTURES
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.lg,
  },

  title: {
    fontFamily: theme.fonts.displayBold,
    fontSize: theme.fontSize.lg,
    color: theme.colours.text,
    letterSpacing: 2,
    textAlign: "center",
  },

  description: {
    marginTop: theme.spacing.md,
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSize.sm,
    color: theme.colours.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },

  button: {
    marginTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colours.accent,
    borderRadius: theme.radius.md,
  },

  buttonText: {
    fontFamily: theme.fonts.bodyBold,
    color: theme.colours.background,
    letterSpacing: 1.5,
  },
});