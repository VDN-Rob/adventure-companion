import { theme } from "@/app/theme";
import { Pressable, StyleSheet, Text, View } from "react-native";

type QuickActionsProps = {
  onExpensePress: () => void;
  onDayPress: () => void;
  onDiaryPress: () => void;
};

export function QuickActions({
  onExpensePress,
  onDayPress,
  onDiaryPress,
}: QuickActionsProps) {
  return (
    <View style={styles.container}>
      <ActionButton
        icon="+"
        label="Expense"
        onPress={onExpensePress}
      />

      <ActionButton
        icon="◇"
        label="Day"
        onPress={onDayPress}
      />

      <ActionButton
        icon="✎"
        label="Diary"
        onPress={onDiaryPress}
      />
    </View>
  );
}

type ActionButtonProps = {
  icon: string;
  label: string;
  onPress: () => void;
};

function ActionButton({
  icon,
  label,
  onPress,
}: ActionButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed,
      ]}
    >
      <Text style={styles.icon}>{icon}</Text>

      <Text style={styles.label}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      gap: theme.spacing.sm,
  
      marginTop: theme.spacing.xl,
      marginBottom: theme.spacing.sm,
    },
  
    button: {
      flex: 1,
  
      minHeight: 86,
  
      alignItems: "center",
      justifyContent: "center",
  
      paddingVertical: theme.spacing.md,
  
      backgroundColor: theme.colours.surface,
  
      borderWidth: 1,
      borderColor: theme.colours.border,
  
      borderRadius: theme.radius.md,
    },
  
    buttonPressed: {
      backgroundColor: theme.colours.surfaceRaised,
  
      borderColor: theme.colours.accent,
  
      transform: [
        {
          translateY: 2,
        },
      ],
    },
  
    icon: {
      fontFamily: theme.fonts.displayBold,
      fontSize: theme.fontSize.xl,
  
      color: theme.colours.accent,
  
      marginBottom: theme.spacing.xs,
    },
  
    label: {
      fontFamily: theme.fonts.bodyBold,
      fontSize: theme.fontSize.xs,
  
      color: theme.colours.text,
  
      letterSpacing: 1.2,
      textTransform: "uppercase",
    },
  });