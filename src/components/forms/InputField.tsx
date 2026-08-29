import { theme } from "@/styling/theme";
import {
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";

type InputFieldProps = {
    label: string;
    value: string;
    onChangeText: (value: string) => void;
    placeholder?: string;
    keyboardType?: "default" | "numeric" | "decimal-pad" | "numbers-and-punctuation";
    suffix?: string;
  };
  
export function InputField({
    label,
    value,
    onChangeText,
    placeholder,
    keyboardType = "default",
    suffix,
  }: InputFieldProps) {
    return (
      <View style={styles.inputContainer}>
        <Text style={styles.label}>
          {label}
        </Text>
  
        <View style={styles.inputWrapper}>
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={theme.colours.textMuted}
            keyboardType={keyboardType}
            style={styles.input}
          />
  
          {suffix && (
            <Text style={styles.suffix}>
              {suffix}
            </Text>
          )}
        </View>
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colours.background,
    },
  
    content: {
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.lg,
      paddingBottom: 100,
    },
  
    header: {
      flexDirection: "row",
      alignItems: "center",
  
      marginBottom: theme.spacing.xl,
    },
  
    backButton: {
      width: 42,
      height: 42,
  
      alignItems: "center",
      justifyContent: "center",
  
      marginRight: theme.spacing.sm,
  
      borderWidth: 1,
      borderColor: theme.colours.border,
      borderRadius: theme.radius.sm,
    },
  
    backArrow: {
      fontFamily: theme.fonts.displayBold,
      fontSize: theme.fontSize.xl,
  
      color: theme.colours.text,
    },
  
    eyebrow: {
      fontFamily: theme.fonts.bodyBold,
      fontSize: theme.fontSize.xs,
  
      color: theme.colours.accent,
  
      letterSpacing: 2,
    },
  
    headerTitle: {
      marginTop: 2,
  
      fontFamily: theme.fonts.displayBold,
      fontSize: theme.fontSize.xxl,
  
      color: theme.colours.text,
  
      letterSpacing: 1,
    },
  
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
  
      gap: theme.spacing.sm,
  
      marginBottom: theme.spacing.lg,
    },
  
    sectionTitle: {
      fontFamily: theme.fonts.bodyBold,
      fontSize: theme.fontSize.xs,
  
      color: theme.colours.accent,
  
      letterSpacing: 2,
    },
  
    sectionLine: {
      flex: 1,
  
      height: 1,
  
      backgroundColor: theme.colours.border,
    },
  
    inputContainer: {
      marginBottom: theme.spacing.md,
    },
  
    label: {
      marginBottom: theme.spacing.xs,
  
      fontFamily: theme.fonts.bodyBold,
      fontSize: theme.fontSize.xs,
  
      color: theme.colours.textMuted,
  
      letterSpacing: 1.5,
    },
  
    inputWrapper: {
      flexDirection: "row",
      alignItems: "center",
  
      minHeight: 52,
  
      backgroundColor: theme.colours.surface,
  
      borderWidth: 1,
      borderColor: theme.colours.border,
  
      borderRadius: theme.radius.md,
    },
  
    input: {
      flex: 1,
  
      minHeight: 50,
  
      paddingHorizontal: theme.spacing.md,
  
      fontFamily: theme.fonts.body,
      fontSize: theme.fontSize.sm,
  
      color: theme.colours.text,
    },
  
    suffix: {
      paddingRight: theme.spacing.md,
  
      fontFamily: theme.fonts.bodyBold,
      fontSize: theme.fontSize.xs,
  
      color: theme.colours.accent,
  
      letterSpacing: 1,
    },
  
    row: {
      flexDirection: "row",
  
      alignItems: "flex-start",
    },
  
    half: {
      flex: 1,
    },
  
    rowGap: {
      width: theme.spacing.sm,
    },
  
    notesContainer: {
      marginTop: theme.spacing.sm,
    },
  
    notesInput: {
      height: 130,
  
      paddingTop: theme.spacing.md,
  
      textAlignVertical: "top",
    },
  
    saveButton: {
      minHeight: 58,
  
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
  
      marginTop: theme.spacing.xl,
  
      backgroundColor: theme.colours.accent,
  
      borderRadius: theme.radius.md,
    },
  
    saveText: {
      fontFamily: theme.fonts.bodyBold,
      fontSize: theme.fontSize.sm,
  
      color: theme.colours.background,
  
      letterSpacing: 2,
    },
  
    saveArrow: {
      marginLeft: theme.spacing.sm,
  
      fontFamily: theme.fonts.displayBold,
      fontSize: theme.fontSize.lg,
  
      color: theme.colours.background,
    },
  });