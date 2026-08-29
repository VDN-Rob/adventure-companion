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

    restDay: {
        marginTop: theme.spacing.md,
        padding: theme.spacing.lg,
        
        backgroundColor: theme.colours.surface,
        borderWidth: 1,
        borderColor: theme.colours.border,
        borderRadius: theme.radius.md,
        
        alignItems: "center",
    },
    
    restDayTitle: {
        fontFamily: theme.fonts.displayBold,
        fontSize: theme.fontSize.lg,
        
        color: theme.colours.accent,
        
        letterSpacing: 1.5,
    },
    
    restDayText: {
        marginTop: theme.spacing.xs,
        
        fontFamily: theme.fonts.body,
        fontSize: theme.fontSize.sm,
        
        color: theme.colours.textSecondary,
        textAlign: "center",
    },
    }
  );



  
  