import { theme } from "@/app/theme";
import { Pressable, StyleSheet, Text, View } from "react-native";

type BottomNavigationProps = {
  activeTab: "today" | "map" | "more";
  onTodayPress: () => void;
  onMapPress: () => void;
  onMorePress: () => void;
};

export function BottomNavigation({
  activeTab,
  onTodayPress,
  onMapPress,
  onMorePress,
}: BottomNavigationProps) {
  return (
    <View style={styles.container}>
      <NavigationItem
        icon="●"
        label="Today"
        active={activeTab === "today"}
        onPress={onTodayPress}
      />

      <NavigationItem
        icon="◇"
        label="Map"
        active={activeTab === "map"}
        onPress={onMapPress}
      />

      <NavigationItem
        icon="☰"
        label="More"
        active={activeTab === "more"}
        onPress={onMorePress}
      />
    </View>
  );
}

type NavigationItemProps = {
  icon: string;
  label: string;
  active: boolean;
  onPress: () => void;
};

function NavigationItem({
  icon,
  label,
  active,
  onPress,
}: NavigationItemProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.item,
        active && styles.itemActive,
        pressed && styles.itemPressed,
      ]}
    >
      <Text
        style={[
          styles.icon,
          active && styles.iconActive,
        ]}
      >
        {icon}
      </Text>

      <Text
        style={[
          styles.label,
          active && styles.labelActive,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}


const styles = StyleSheet.create({
    container: {
      height: 76,
  
      flexDirection: "row",
  
      backgroundColor: theme.colours.surface,
  
      borderTopWidth: 1,
      borderTopColor: theme.colours.border,
  
      paddingHorizontal: theme.spacing.sm,
    },
  
    item: {
      flex: 1,
  
      alignItems: "center",
      justifyContent: "center",
  
      marginTop: 1,
    },
  
    itemActive: {
      borderTopWidth: 2,
      borderTopColor: theme.colours.accent,
  
      marginTop: 0,
    },
  
    itemPressed: {
      backgroundColor: theme.colours.surfaceRaised,
    },
  
    icon: {
      fontFamily: theme.fonts.displayBold,
      fontSize: theme.fontSize.lg,
  
      color: theme.colours.textMuted,
  
      marginBottom: theme.spacing.xs,
    },
  
    iconActive: {
      color: theme.colours.accent,
    },
  
    label: {
      fontFamily: theme.fonts.bodyBold,
      fontSize: theme.fontSize.xs,
  
      color: theme.colours.textMuted,
  
      letterSpacing: 1.5,
      textTransform: "uppercase",
    },
  
    labelActive: {
      color: theme.colours.text,
    },
  });