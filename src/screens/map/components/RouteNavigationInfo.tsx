import { RouteProgress } from "@/services/RouteNavigationService";
import { StyleSheet, Text, View } from "react-native";

interface RouteNavigationInfoProps {
    routeName?: string;
    progress: RouteProgress | null;
}

function formatDistance(meters: number): string {
    if (meters >= 1000) {
        return `${(meters / 1000).toFixed(1)} km`;
    }

    return `${Math.round(meters)} m`;
}

export function RouteNavigationInfo({
    routeName,
    progress,
}: RouteNavigationInfoProps) {
    if (!progress) {
        return null;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.routeName} numberOfLines={1}>
                    {routeName ?? "Route"}
                </Text>

                <Text style={styles.percentage}>
                    {Math.round(progress.percentage)}%
                </Text>
            </View>

            <View style={styles.progressTrack}>
                <View
                    style={[
                        styles.progressFill,
                        {
                            width: `${progress.percentage}%`,
                        },
                    ]}
                />
            </View>

            <View style={styles.stats}>
                <View>
                    <Text style={styles.label}>Distance</Text>
                    <Text style={styles.value}>
                        {formatDistance(
                            progress.distanceFromStartMeters,
                        )}
                    </Text>
                </View>

                <View>
                    <Text style={styles.label}>Remaining</Text>
                    <Text style={styles.value}>
                        {formatDistance(
                            progress.distanceRemainingMeters,
                        )}
                    </Text>
                </View>

                <View>
                    <Text style={styles.label}>Off route</Text>
                    <Text style={styles.value}>
                        {formatDistance(
                            progress.distanceFromRouteMeters,
                        )}
                    </Text>
                </View>
            </View>
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
        borderRadius: 16,
        backgroundColor: "white",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 12,
    },

    routeName: {
        flex: 1,
        marginRight: 12,
        fontSize: 18,
        fontWeight: "600",
    },

    percentage: {
        fontSize: 16,
        fontWeight: "600",
    },

    progressTrack: {
        height: 6,
        overflow: "hidden",
        borderRadius: 3,
        backgroundColor: "#E5E5E5",
    },

    progressFill: {
        height: "100%",
        borderRadius: 3,
        backgroundColor: "#007AFF",
    },

    stats: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 14,
    },

    label: {
        marginBottom: 3,
        fontSize: 12,
        color: "#777",
    },

    value: {
        fontSize: 15,
        fontWeight: "600",
    },
});