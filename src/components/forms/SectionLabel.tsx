import { theme } from "@/app/theme";
import { StyleSheet, Text, View } from "react-native";

export function SectionLabel({ title }: { title: string }) {
    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {title}
        </Text>
  
        <View style={styles.sectionLine} />
      </View>
    );
  }

  const styles = StyleSheet.create({
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
  });