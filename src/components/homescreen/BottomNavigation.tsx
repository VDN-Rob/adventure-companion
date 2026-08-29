import { theme } from "@/styling/theme";
import { Pressable, StyleSheet, Text, View } from "react-native";

export type NavigationItem = {
  key: string;
  icon: string;
  label: string;
  onPress: () => void;
};

type BottomNavigationProps = {
  items: NavigationItem[];
  activeTab: string;
  onMorePress?: () => void;
};

export function BottomNavigation({
  items,
  activeTab,
  onMorePress,
}: BottomNavigationProps) {
  return (
    <View style={styles.container}>
      {items.map((item) => (
        <NavigationItemComponent
          key={item.key}
          icon={item.icon}
          label={item.label}
          active={activeTab === item.key}
          onPress={item.onPress}
        />
      ))}

      {onMorePress && (
        <NavigationItemComponent
          icon="☰"
          label="More"
          active={activeTab === "more"}
          onPress={onMorePress}
        />
      )}
    </View>
  );
}

type NavigationItemComponentProps = {
  icon: string;
  label: string;
  active: boolean;
  onPress: () => void;
};

function NavigationItemComponent({
  icon,
  label,
  active,
  onPress,
}: NavigationItemComponentProps) {
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