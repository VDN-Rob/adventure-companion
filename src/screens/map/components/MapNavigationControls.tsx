import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface MapNavigationControlsProps {
    isFollowingUser: boolean;
    onRecenter: () => void;
    onStop: () => void;
}

export function MapNavigationControls({
    isFollowingUser,
    onRecenter,
    onStop,
}: MapNavigationControlsProps) {
    return (
        <View style={styles.container}>
            {!isFollowingUser && (
                <TouchableOpacity
                    style={styles.control}
                    onPress={onRecenter}
                    accessibilityLabel="Re-center map"
                >
                    <Text style={styles.icon}>◎</Text>
                </TouchableOpacity>
            )}

            <TouchableOpacity
                style={styles.control}
                onPress={onStop}
                accessibilityLabel="Stop navigation"
            >
                <Text style={styles.stopIcon}>■</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        right: 16,
        bottom: 150,
        gap: 12,
    },

    control: {
        width: 48,
        height: 48,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 24,
        backgroundColor: "white",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 4,
    },

    icon: {
        fontSize: 28,
        lineHeight: 30,
    },

    stopIcon: {
        fontSize: 16,
    },
});