import { getTranslations } from "@/i18n";
import { useAppSettings } from "@/providers/AppSettingsProvider";
import { styles } from "@/styling/styles";
import { textStyles } from "@/styling/textStyles";
import { useState } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";
import { DateSelector } from "../forms/DateSelector";

type StartEndDateSelectorProps = {
    startDate: Date;
    endDate?: Date | null;
    onStartDateChange: (date: Date) => void;
    onEndDateChange: (date: Date | null) => void;
};

export function StartEndDateSelector({
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange,
}: StartEndDateSelectorProps) {
    const { settings } = useAppSettings();
    const t = getTranslations(settings.language);

    const [showEndDatePicker, setShowEndDatePicker] = useState(endDate != null);

    function handleToggleEndDate(enabled: boolean) {
        setShowEndDatePicker(enabled);

        if (!enabled) {
            onEndDateChange(null);
        } else {
            onEndDateChange(startDate);
        }
    }

    return (
        <View style={localStyles.row}>
            <View style={localStyles.column}>
                <DateSelector
                    label={t.time.startDate.toUpperCase()}
                    date={startDate}
                    onDateChange={onStartDateChange}
                />
            </View>

            <View style={[localStyles.column, styles.simpleButton]}>
                <Text style={textStyles.formLabel}>USE END DATE</Text>
                <Switch
                    value={showEndDatePicker}
                    onValueChange={handleToggleEndDate}
                />
            </View>

            <View style={localStyles.column}>
                {showEndDatePicker && (
                    <DateSelector
                        label={t.time.endDate.toUpperCase()}
                        date={endDate ?? startDate}
                        minimumDate={startDate}
                        onDateChange={onEndDateChange}
                    />
                )}
            </View>
        </View>
    );
}

const localStyles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 8,
    },
    column: {
        flex: 1,
        minWidth: 0,
    },
    dateButton: {
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 24,
    },
    label: {
        fontSize: 12,
        textAlign: "center",
    },
});