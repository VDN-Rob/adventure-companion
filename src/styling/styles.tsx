import { StyleSheet } from "react-native";
import { theme } from "./theme";

export const styles = StyleSheet.create({
    adventureSelector: {
        marginHorizontal: 16,
        marginTop: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: theme.colours.surface,
        borderWidth: 1,
        borderColor: theme.colours.border,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      },
      
      selectorLabel: {
        fontSize: 11,
        fontWeight: "700",
        letterSpacing: 1,
        color: theme.colours.textSecondary,
        marginBottom: 3,
      },
      
      selectorValue: {
        fontSize: 16,
        fontWeight: "700",
        color: theme.colours.text,
      },
      
      selectorArrow: {
        fontSize: 16,
        color: theme.colours.textSecondary,
      },
      
      chooseAdventureButton: {
        marginHorizontal: 16,
        paddingHorizontal: 20,
        paddingVertical: 24,
        borderRadius: 14,
        backgroundColor: theme.colours.surface,
        borderWidth: 1,
        borderColor: theme.colours.border,
        alignItems: "center",
        justifyContent: "center",
      },
      
      chooseAdventureTitle: {
        fontSize: 16,
        fontWeight: "800",
        letterSpacing: 0.5,
        color: theme.colours.text,
        marginBottom: 6,
      },
      
      chooseAdventureText: {
        fontSize: 14,
        color: theme.colours.textSecondary,
        textAlign: "center",
      },
      
      modalBackdrop: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        paddingHorizontal: 20,
      },
      
      selectorModal: {
        backgroundColor: theme.colours.background,
        borderRadius: 16,
        padding: 20,
      },
      
      modalTitle: {
        fontSize: 18,
        fontWeight: "800",
        letterSpacing: 0.5,
        color: theme.colours.text,
        marginBottom: 16,
      },
      
      tripOption: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderRadius: 10,
        marginBottom: 8,
      },
      
      tripOptionSelected: {
        backgroundColor: theme.colours.surface,
      },
      
      tripOptionIndicator: {
        width: 28,
        fontSize: 18,
        color: theme.colours.text,
      },
      
      tripOptionContent: {
        flex: 1,
      },
      
      tripOptionName: {
        fontSize: 16,
        fontWeight: "700",
        color: theme.colours.text,
        marginBottom: 3,
      },
      
      tripOptionDates: {
        fontSize: 13,
        color: theme.colours.textSecondary,
      },

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



  
  