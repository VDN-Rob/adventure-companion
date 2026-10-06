import { OfflineMap } from "@/models/OfflineMap";
import { useAppServices } from "@/utils/useRepository/useAppServiceProvider";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OfflineMapScreen() {
    const { mapServices } = useAppServices();

    const [maps, setMaps] = useState<OfflineMap[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deletingMapId, setDeletingMapId] = useState<string | null>(null);

    const loadMaps = useCallback(async () => {
        try {
            setIsLoading(true);

            const downloadedMaps =
                await mapServices.getDownloadedMaps();

            setMaps(downloadedMaps);
        } catch (error) {
            console.error(
                "Failed to load offline maps:",
                error
            );

            Alert.alert(
                "Failed to load maps",
                "The offline maps could not be loaded."
            );
        } finally {
            setIsLoading(false);
        }
    }, [mapServices]);

    useFocusEffect(
        useCallback(() => {
            loadMaps();
        }, [loadMaps])
    );

    function handleDelete(map: OfflineMap) {
        Alert.alert(
            "Delete offline map",
            `Delete the offline map downloaded on ${formatDate(
                map.creationDate
            )}?`,
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => deleteMap(map),
                },
            ]
        );
    }

    async function deleteMap(map: OfflineMap) {
        try {
            setDeletingMapId(map.id);

            await mapServices.deleteRegion(map);

            setMaps(currentMaps =>
                currentMaps.filter(
                    currentMap => currentMap.id !== map.id
                )
            );
        } catch (error) {
            console.error(
                "Failed to delete offline map:",
                error
            );

            Alert.alert(
                "Delete failed",
                "The offline map could not be deleted."
            );
        } finally {
            setDeletingMapId(null);
        }
    }

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator />
                <Text style={styles.loadingText}>
                    Loading offline maps...
                </Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>
                    OFFLINE MAPS
                </Text>

                <Text style={styles.subtitle}>
                    {maps.length} downloaded map
                    {maps.length === 1 ? "" : "s"}
                </Text>
            </View>

            {maps.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyTitle}>
                        No offline maps
                    </Text>

                    <Text style={styles.emptyText}>
                        Maps you download for trips and days
                        will appear here.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={maps}
                    keyExtractor={map => map.id}
                    contentContainerStyle={styles.list}
                    renderItem={({ item }) => (
                        <OfflineMapCard
                            map={item}
                            isDeleting={
                                deletingMapId === item.id
                            }
                            onDelete={() =>
                                handleDelete(item)
                            }
                        />
                    )}
                />
            )}
        </SafeAreaView>
    );
}

function OfflineMapCard({
    map,
    isDeleting,
    onDelete,
}: {
    map: OfflineMap;
    isDeleting: boolean;
    onDelete: () => void;
}) {
    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.cardTitleContainer}>
                    <Text style={styles.cardTitle}>
                        Offline map
                    </Text>

                    <View style={styles.statusContainer}>
                        <View style={styles.statusDot} />

                        <Text style={styles.statusText}>
                            Downloaded
                        </Text>
                    </View>
                </View>

                <Pressable
                    onPress={onDelete}
                    disabled={isDeleting}
                    style={styles.deleteButton}
                >
                    {isDeleting ? (
                        <ActivityIndicator />
                    ) : (
                        <Text style={styles.deleteText}>
                            DELETE
                        </Text>
                    )}
                </Pressable>
            </View>

            <View style={styles.details}>
                <DetailRow
                    label="Downloaded"
                    value={formatDate(map.creationDate)}
                />

                <DetailRow
                    label="Zoom"
                    value={`${map.minZoom}–${map.maxZoom}`}
                />

                <DetailRow
                    label="Bounds"
                    value={formatBounds(map)}
                />
            </View>
        </View>
    );
}

function DetailRow({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>
                {label}
            </Text>

            <Text style={styles.detailValue}>
                {value}
            </Text>
        </View>
    );
}

function formatDate(date: string): string {
    return new Date(date).toLocaleString();
}

function formatBounds(map: OfflineMap): string {
    return [
        map.west.toFixed(3),
        map.south.toFixed(3),
        map.east.toFixed(3),
        map.north.toFixed(3),
    ].join(", ");
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },

    header: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },

    title: {
        fontSize: 22,
        fontWeight: "700",
        letterSpacing: 1,
    },

    subtitle: {
        marginTop: 6,
        fontSize: 14,
        color: "#666",
    },

    list: {
        padding: 16,
        gap: 12,
    },

    card: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 16,
    },

    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },

    cardTitleContainer: {
        flex: 1,
    },

    cardTitle: {
        fontSize: 17,
        fontWeight: "600",
    },

    statusContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 6,
    },

    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#4CAF50",
        marginRight: 6,
    },

    statusText: {
        fontSize: 13,
        color: "#555",
    },

    deleteButton: {
        paddingHorizontal: 10,
        paddingVertical: 6,
    },

    deleteText: {
        fontSize: 12,
        fontWeight: "700",
        color: "#B00020",
    },

    details: {
        marginTop: 16,
        gap: 8,
    },

    detailRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 16,
    },

    detailLabel: {
        fontSize: 13,
        color: "#777",
    },

    detailValue: {
        flex: 1,
        fontSize: 13,
        textAlign: "right",
    },

    emptyState: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 40,
    },

    emptyTitle: {
        fontSize: 18,
        fontWeight: "600",
    },

    emptyText: {
        marginTop: 8,
        fontSize: 14,
        color: "#666",
        textAlign: "center",
        lineHeight: 20,
    },

    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    loadingText: {
        marginTop: 10,
        color: "#666",
    },
});