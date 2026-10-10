import { StyleSheet } from "react-native";
import { theme } from "./theme";

export const textStyles = StyleSheet.create({
    headerTitle: {
		fontFamily: theme.fonts.displayBold,
		fontSize: theme.fontSize.xxl,

		color: theme.colours.text,

		letterSpacing: 3,
		textTransform: 'uppercase',
	},

	headerSubTitle: {
		marginTop: theme.spacing.sm,

		fontFamily: theme.fonts.body,
		fontSize: theme.fontSize.sm,

		color: theme.colours.textSecondary,

		letterSpacing: 1,
		textTransform: 'uppercase',
	},

    subTitle: {
        ...theme.typography.display,
        fontSize: theme.fontSize.xl,
        color: theme.colours.text,
        textAlign: 'center',
        marginBottom: theme.spacing.sm,
    },

    normalText: {
        ...theme.typography.body,
        fontSize: theme.fontSize.md,
        color: theme.colours.textSecondary,
        textAlign: 'center',
        marginBottom: theme.spacing.xl,
    },

    formLabel: {
		marginBottom: 2,
		fontFamily: theme.fonts.bodyBold,
		fontSize: theme.fontSize.xs,
		letterSpacing: 1,
		color: theme.colours.textMuted,
	},
})