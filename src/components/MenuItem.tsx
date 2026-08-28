import { Pressable, StyleSheet, Text, View } from "react-native";

import { theme } from "@/app/theme";

type MenuItemProps = {
  icon: string;
  title: string;
  description?: string;
  onPress: () => void;
};

export function MenuItem({
  icon,
  title,
  description,
  onPress,
}: MenuItemProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>
          {icon}
        </Text>
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>
          {title}
        </Text>

        {description && (
          <Text style={styles.description}>
            {description}
          </Text>
        )}
      </View>

      <Text style={styles.arrow}>
        →
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 76,

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,

    backgroundColor: theme.colours.surface,

    borderWidth: 1,
    borderColor: theme.colours.border,

    borderRadius: theme.radius.md,
  },

  pressed: {
    backgroundColor: theme.colours.surfaceRaised,

    borderColor: theme.colours.accent,

    transform: [
      {
        translateY: 2,
      },
    ],
  },

  iconContainer: {
    width: 42,

    alignItems: "center",
    justifyContent: "center",
  },

  icon: {
    fontFamily: theme.fonts.displayBold,
    fontSize: theme.fontSize.xl,

    color: theme.colours.accent,
  },

  textContainer: {
    flex: 1,

    marginLeft: theme.spacing.sm,
  },

  title: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: theme.fontSize.md,

    color: theme.colours.text,

    letterSpacing: 1.2,
    textTransform: "uppercase",
  },

  description: {
    marginTop: 2,

    fontFamily: theme.fonts.body,
    fontSize: theme.fontSize.xs,

    color: theme.colours.textMuted,
  },

  arrow: {
    fontFamily: theme.fonts.displayBold,
    fontSize: theme.fontSize.lg,

    color: theme.colours.textMuted,

    marginLeft: theme.spacing.sm,
  },
});