import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { theme } from "@/app/theme";
import { ActiveTripCard } from "@/components/trips/ActiveTripCard";
import { UpcomingTripCard } from "@/components/trips/UpcomingTripCard";
import { Trip } from "@/models/Trip";
import { router } from "expo-router";

const activeTrip: Trip = {
    id: "1",
    name: "Ardennes Expedition",
    startDate: "2026-08-24",
    endDate: "2026-09-04",
    description: "A two-week cycling adventure through the Ardennes.",
  };
  
  const upcomingTrips: Trip[] = [
    {
      id: "2",
      name: "Alps 2026",
      startDate: "2026-09-12",
      endDate: "2026-09-20",
      description: null,
    },
    {
      id: "3",
      name: "Coastal Bikepacking",
      startDate: "2026-10-03",
      endDate: "2026-10-08",
      description: null,
    },
  ];
  
  const pastTrips: Trip[] = [
    {
      id: "4",
      name: "The Ardennes Loop",
      startDate: "2026-05-14",
      endDate: "2026-05-18",
      description: null,
    },
    {
      id: "5",
      name: "Veluwe Backpacking",
      startDate: "2026-04-03",
      endDate: "2026-04-06",
      description: null,
    },
  ];

export default function TripsScreen() {
  return (
    <View style={styles.content}>
        <SectionHeader title="ACTIVE ADVENTURE" />

        <ActiveTripCard
            trip={activeTrip}
            currentDay={4}
            totalDays={12}
            onPress={() => {
                router.push({
                pathname: "/detailsDay",
                params: {
                    dayId: "4",
                },
                });
            }}
        />

        <SectionHeader title="UPCOMING" />

        {upcomingTrips.map((trip) => (
            <UpcomingTripCard
                key={trip.id}
                trip={trip}
                onPress={() => {
                console.log("Open trip", trip.id);
                }}
            />
        ))}

        <Pressable
            style={styles.newAdventure}
            onPress={() => router.push("/createTrip")}
            >
            <Text style={styles.newAdventureIcon}>+</Text>
            <Text style={styles.newAdventureText}>
                NEW ADVENTURE
            </Text>
        </Pressable>

        <SectionHeader title="PAST" />

        {pastTrips.map((trip) => (
        <PastTripItem
            key={trip.id}
            trip={trip}
            onPress={() => {
            console.log("Open past trip", trip.id);
            }}
        />
        ))}

        <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
            {/* sections */}
        </ScrollView>
        </View>
  );
}

type SectionHeaderProps = {
    title: string;
  };
  
function SectionHeader({ title }: SectionHeaderProps) {
    return (
        <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
            {title}
        </Text>

        <View style={styles.sectionLine} />
        </View>
    );
}

type PastTripItemProps = {
    trip: Trip;
    onPress: () => void;
  };

function PastTripItem({
    trip,
    onPress,
}: PastTripItemProps) {
    return (
        <Pressable
        onPress={onPress}
        style={({ pressed }) => [
            styles.pastItem,
            pressed && styles.pastPressed,
        ]}
        >
        <View style={styles.pastText}>
            <Text style={styles.pastTitle}>
            {trip.name}
            </Text>

            <Text style={styles.pastDate}>
            {trip.startDate}
            {trip.endDate ? ` — ${trip.endDate}` : ""}
            </Text>
        </View>

        <Text style={styles.pastArrow}>
            →
        </Text>
        </Pressable>
    );
}
const styles = StyleSheet.create({
    scroll: {
        flex: 1,
        marginTop: theme.spacing.xl,
      },
      
    scrollContent: {
        paddingBottom: theme.spacing.xl,
        gap: theme.spacing.xl,
    },
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",

        gap: theme.spacing.sm,
    },

    sectionTitle: {
        fontFamily: theme.fonts.bodyBold,
        fontSize: theme.fontSize.xs,

        color: theme.colours.accent,

        letterSpacing: 2,
    },

    sectionLine: {
        flex: 1,

        height: 1,

        backgroundColor: theme.colours.border,
    },
    content: {
        padding: theme.spacing.sm,
        flex: 1,
        backgroundColor: theme.colours.background,
    },
    title: {
        marginTop: 2,
    
        fontFamily: theme.fonts.displayBold,
        fontSize: theme.fontSize.xl,
    
        color: theme.colours.text,
    
        letterSpacing: 1,
        textTransform: "uppercase",
    },

    subtitle: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
  
      fontFamily: theme.fonts.bodyBold,
      fontSize: theme.fontSize.xs,
  
      color: theme.colours.accent,
  
      letterSpacing: 1.5,
  
      borderWidth: 1,
      borderColor: theme.colours.accent,
  
      borderRadius: theme.radius.sm,
    },
    newAdventure: {
        minHeight: 54,
      
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      
        borderWidth: 1,
        borderColor: theme.colours.border,
      
        borderStyle: "dashed",
      
        borderRadius: theme.radius.md,
      },
      
      newAdventureIcon: {
        fontFamily: theme.fonts.displayBold,
        fontSize: theme.fontSize.xl,
      
        color: theme.colours.accent,
      
        marginRight: theme.spacing.sm,
      },
      
      newAdventureText: {
        fontFamily: theme.fonts.bodyBold,
        fontSize: theme.fontSize.sm,
      
        color: theme.colours.text,
      
        letterSpacing: 1.5,
      },
      pastItem: {
        minHeight: 58,
      
        flexDirection: "row",
        alignItems: "center",
      
        paddingHorizontal: theme.spacing.sm,
      
        borderBottomWidth: 1,
        borderBottomColor: theme.colours.border,
      },
      
      pastPressed: {
        backgroundColor: theme.colours.surfaceRaised,
      },
      
      pastText: {
        flex: 1,
      },
      
      pastTitle: {
        fontFamily: theme.fonts.bodyBold,
        fontSize: theme.fontSize.sm,
      
        color: theme.colours.text,
      },
      
      pastDate: {
        marginTop: 2,
      
        fontFamily: theme.fonts.body,
        fontSize: theme.fontSize.xs,
      
        color: theme.colours.textMuted,
      },
      
      pastArrow: {
        fontFamily: theme.fonts.displayBold,
        fontSize: theme.fontSize.md,
      
        color: theme.colours.textMuted,
      },
})