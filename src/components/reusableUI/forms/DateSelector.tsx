import { useAppSettings } from "@/providers/AppSettingsProvider";
import { theme } from "@/styling/theme";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type DateSelectorProps = {
    label: string,

    date: Date;
    minimumDate?: Date;
    maximumDate?: Date;

    onDateChange: (date: Date) => void;
};

// function handleDateChange(selectedDate: Date) {
//     setDate(dateToDateString(selectedDate));
// }

export function DateSelector({
    label,
    date,
    minimumDate,
    maximumDate,
    onDateChange
}: DateSelectorProps) {
    const [showDatePicker, setShowDatePicker] = useState(false);

    const { settings } = useAppSettings();

    function handleDismiss() {
        setShowDatePicker(false);
    }

    function handleValueChange(
        _: { nativeEvent: { timestamp: number; utcOffset: number } },
        selectedDate: Date
    ) {
        onDateChange(selectedDate);
        setShowDatePicker(false);
    }

    return (
        <View>
            <Pressable
                onPress={() => setShowDatePicker(true)}
                style={({ pressed }) => [styles.dateButton, pressed && styles.dateButtonPressed,]}
                >
                <View>
                    <Text style={styles.dateLabel}>
                        {label}
                    </Text>

                    <Text style={styles.dateValue}>
                        {date.toLocaleDateString(settings.dateFormat)}
                    </Text>
                </View>

                <Text style={styles.dateArrow}>
                    ▼
                </Text>
            </Pressable>

            {showDatePicker && (
                <View style={styles.datePicker}>
                    <DateTimePicker
                        value={date}
                        mode="date"
                        display="default"
                        minimumDate={minimumDate}
                        maximumDate={maximumDate}
                        onValueChange={handleValueChange}
                        onDismiss={handleDismiss}
                    />
                </View>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    dateButton: {
        minHeight: 64,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: theme.spacing.md,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        borderWidth: 1,
        borderColor: theme.colours.border,
        borderRadius: theme.radius.md,
        backgroundColor: theme.colours.surface,
    },

    dateButtonPressed: {
		backgroundColor: theme.colours.surfaceRaised,
		borderColor: theme.colours.accent,
	},

	dateLabel: {
		marginBottom: 2,
		fontFamily: theme.fonts.bodyBold,
		fontSize: theme.fontSize.xs,
		letterSpacing: 1,
		color: theme.colours.textMuted,
	},

	dateValue: {
		fontFamily: theme.fonts.displayBold,
		fontSize: theme.fontSize.lg,
		color: theme.colours.text,
	},

	dateArrow: {
		fontFamily: theme.fonts.displayBold,
		fontSize: theme.fontSize.sm,
		color: theme.colours.textMuted,
	},

	datePicker: {
		alignItems: "center",
		marginBottom: theme.spacing.lg,
	},
})