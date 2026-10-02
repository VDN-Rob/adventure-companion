import { StyleSheet, Text, View } from "react-native";

import { RouteProgress } from "@/services/RouteNavigationService";

interface RouteNavigationInfoProps {
    progress: RouteProgress | null;
}

function formatDistance(meters: number): string {
    if (meters < 1000) {
        return `${Math.round(meters)} m`;
    }

    return `${(meters / 1000).toFixed(1)} km`;
}

export function RouteNavigationInfo({
    progress,
}: RouteNavigationInfoProps) {
    if (!progress) {
        return null;
    }

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <View>
                    <Text style={styles.label}>Remaining</Text>
                    <Text style={styles.distance}>
                        {formatDistance(progress.distanceRemainingMeters)}
                    </Text>
                </View>

                <View style={styles.progressContainer}>
                    <Text style={styles.label}>Progress</Text>
                    <Text style={styles.progress}>
                        {Math.round(progress.progress * 100)}%
                    </Text>
                </View>
            </View>

            {progress.offRoute && (
                <View style={styles.warning}>
                    <Text style={styles.warningText}>
                        You are off route
                    </Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        left: 16,
        right: 16,
        bottom: 24,
        padding: 16,
        borderRadius: 14,
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    progressContainer: {
        alignItems: "flex-end",
    },

    label: {
        fontSize: 12,
        color: "#666",
        marginBottom: 2,
    },

    distance: {
        fontSize: 22,
        fontWeight: "600",
    },

    progress: {
        fontSize: 22,
        fontWeight: "600",
    },

    warning: {
        marginTop: 12,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: "#eee",
    },

    warningText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#d00",
        textAlign: "center",
    },
});