import { theme } from "@/styling/theme";
import { useState } from "react";
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

export type SelectorOption<T extends string> = {
    value: T;
    label: string;
    description?: string;
};

type SelectorProps<T extends string> = {
    label: string;
    placeholder?: string;
    options: SelectorOption<T>[];
    selectedValue: T | null;
    onSelect: (value: T) => void;
};

export function Selector<T extends string>({
    label,
    placeholder = "SELECT",
    options,
    selectedValue,
    onSelect,
}: SelectorProps<T>) {
    const [visible, setVisible] = useState(false);

    const selectedOption =
        options.find((option) => option.value === selectedValue) ?? null;

    function handleSelect(value: T) {
        onSelect(value);
        setVisible(false);
    }

    return (
        <>
            <Pressable
                style={styles.selector}
                onPress={() => setVisible(true)}
            >
                <View style={styles.selectorContent}>
                    <Text style={styles.selectorLabel}>
                        {label}
                    </Text>

                    <Text style={styles.selectorValue}>
                        {selectedOption?.label ?? placeholder}
                    </Text>
                </View>

                <Text style={styles.selectorArrow}>
                    ▼
                </Text>
            </Pressable>

            <Modal
                visible={visible}
                transparent
                animationType="fade"
                onRequestClose={() => setVisible(false)}
            >
                <Pressable
                    style={styles.modalBackdrop}
                    onPress={() => setVisible(false)}
                >
                    <Pressable
                        style={styles.selectorModal}
                        onPress={(event) => event.stopPropagation()}
                    >
                        <Text style={styles.modalTitle}>
                            {label}
                        </Text>

                        {options.map((option) => {
                            const isSelected =
                                option.value === selectedValue;

                            return (
                                <Pressable
                                    key={option.value}
                                    style={[
                                        styles.option,
                                        isSelected &&
                                            styles.optionSelected,
                                    ]}
                                    onPress={() =>
                                        handleSelect(option.value)
                                    }
                                >
                                    <Text
                                        style={
                                            styles.optionIndicator
                                        }
                                    >
                                        {isSelected ? "●" : "○"}
                                    </Text>

                                    <View
                                        style={
                                            styles.optionContent
                                        }
                                    >
                                        <Text
                                            style={
                                                styles.optionLabel
                                            }
                                        >
                                            {option.label}
                                        </Text>

                                        {option.description && (
                                            <Text
                                                style={
                                                    styles.optionDescription
                                                }
                                            >
                                                {
                                                    option.description
                                                }
                                            </Text>
                                        )}
                                    </View>
                                </Pressable>
                            );
                        })}
                    </Pressable>
                </Pressable>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    selector: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",

        marginHorizontal: theme.spacing.lg,
        marginTop: theme.spacing.md,
        padding: theme.spacing.md,

        backgroundColor: theme.colours.surface,

        borderWidth: 1,
        borderColor: theme.colours.border,
        borderRadius: theme.radius.md,
    },

    selectorContent: {
        flex: 1,
    },

    selectorLabel: {
        fontFamily: theme.fonts.bodyBold,
        fontSize: theme.fontSize.xs,
        color: theme.colours.textMuted,
        letterSpacing: 1.5,
    },

    selectorValue: {
        marginTop: theme.spacing.xs,

        fontFamily: theme.fonts.displayBold,
        fontSize: theme.fontSize.md,
        color: theme.colours.text,

        letterSpacing: 0.5,
    },

    selectorArrow: {
        fontFamily: theme.fonts.displayBold,
        fontSize: theme.fontSize.sm,
        color: theme.colours.accent,
    },

    modalBackdrop: {
        flex: 1,

        alignItems: "center",
        justifyContent: "center",

        padding: theme.spacing.lg,

        backgroundColor: "rgba(0, 0, 0, 0.65)",
    },

    selectorModal: {
        width: "100%",

        padding: theme.spacing.md,

        backgroundColor: theme.colours.background,

        borderWidth: 1,
        borderColor: theme.colours.border,
        borderRadius: theme.radius.lg,
    },

    modalTitle: {
        marginBottom: theme.spacing.md,

        fontFamily: theme.fonts.displayBold,
        fontSize: theme.fontSize.lg,
        color: theme.colours.text,

        letterSpacing: 1.5,
    },

    option: {
        flexDirection: "row",
        alignItems: "center",

        padding: theme.spacing.md,

        borderWidth: 1,
        borderColor: theme.colours.border,
        borderRadius: theme.radius.md,

        marginBottom: theme.spacing.sm,
    },

    optionSelected: {
        borderColor: theme.colours.accent,
        backgroundColor: theme.colours.surface,
    },

    optionIndicator: {
        width: 28,

        fontFamily: theme.fonts.displayBold,
        fontSize: theme.fontSize.md,
        color: theme.colours.accent,
    },

    optionContent: {
        flex: 1,
    },

    optionLabel: {
        fontFamily: theme.fonts.bodyBold,
        fontSize: theme.fontSize.md,
        color: theme.colours.text,
    },

    optionDescription: {
        marginTop: 2,

        fontFamily: theme.fonts.body,
        fontSize: theme.fontSize.xs,
        color: theme.colours.textMuted,
    },
});