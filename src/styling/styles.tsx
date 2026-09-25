import { StyleSheet } from "react-native";
import { theme } from "./theme";

export const styles = StyleSheet.create({
  adventureSelector: {
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colours.surface,
    borderWidth: theme.borders.thin,
    borderColor: theme.colours.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  selectorLabel: {
    marginBottom: theme.spacing.xs,
    fontFamily: theme.fonts.bodyBold,
    fontSize: theme.fontSize.xs,
    letterSpacing: 1,
    color: theme.colours.textSecondary,
  },

  selectorValue: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: theme.fontSize.md,
    color: theme.colours.text,
  },

  selectorArrow: {
    fontSize: theme.fontSize.md,
    color: theme.colours.textSecondary,
  },

  chooseAdventureButton: {
    marginHorizontal: theme.spacing.lg,
    paddingHorizontal: 20,
    paddingVertical: theme.spacing.xl,
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colours.surface,
    borderWidth: theme.borders.thin,
    borderColor: theme.colours.border,
    alignItems: "center",
    justifyContent: "center",
  },

  chooseAdventureTitle: {
    marginBottom: theme.spacing.xs,
    fontFamily: theme.fonts.bodyBold,
    fontSize: theme.fontSize.md,
    letterSpacing: 0.5,
    color: theme.colours.text,
  },

  chooseAdventureText: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSize.sm,
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
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
  },

  modalTitle: {
    marginBottom: theme.spacing.lg,
    fontFamily: theme.fonts.bodyBold,
    fontSize: theme.fontSize.lg,
    letterSpacing: 0.5,
    color: theme.colours.text,
  },

  tripOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.lg,
    marginBottom: theme.spacing.sm,
  },

  tripOptionSelected: {
    backgroundColor: theme.colours.surface,
  },

  tripOptionIndicator: {
    width: 28,
    fontSize: theme.fontSize.lg,
    color: theme.colours.text,
  },

  tripOptionContent: {
    flex: 1,
  },

  tripOptionName: {
    marginBottom: theme.spacing.xs,
    fontFamily: theme.fonts.bodyBold,
    fontSize: theme.fontSize.md,
    color: theme.colours.text,
  },

  tripOptionDates: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSize.sm,
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
    borderWidth: theme.borders.thin,
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

  // Shared styles

  surfaceCard: {
    backgroundColor: theme.colours.surface,
    borderWidth: theme.borders.thin,
    borderColor: theme.colours.border,
    borderRadius: theme.radius.lg,
  },

  centered: {
    alignItems: "center",
    justifyContent: "center",
  },

  textSecondary: {
    color: theme.colours.textSecondary,
  },

  textMuted: {
    color: theme.colours.textMuted,
  },
});