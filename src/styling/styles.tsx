import { StyleSheet } from "react-native";
import { theme } from "./theme";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colours.background,
    },

    content: {
        flex: 1,

        paddingHorizontal: theme.spacing.md,
        paddingTop: theme.spacing.md,
        paddingBottom: theme.spacing.lg,
        },
    }
  );