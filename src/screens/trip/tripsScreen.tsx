import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";

import { ActiveTripCard } from "@/components/card/trips/ActiveTripCard";
import { UpcomingTripCard } from "@/components/card/trips/UpcomingTripCard";
import { Trip } from "@/models/Trip";
import { theme } from "@/styling/theme";
import { getDayNumber, getTodayDate } from "@/utils/date";
import { useAppServices } from "@/utils/useAppServiceProvider";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

export default function TripsScreen() {
  
  const {tripServices, dayServices, isOnline, mapServices, poiServices} = useAppServices();

  const [activeTrip, setActiveTrip] = useState<Trip | null>(null);
  const [futureTrips, setFutureTrips] = useState<Trip[]>([]);
  const [pastTrips, setPastTrips] = useState<Trip[]>([]);


  useFocusEffect(
    useCallback(() => {
    async function loadTrips() {
      const today = getTodayDate();

      const [futureTrips, activeTrip, pastTrips] = await Promise.all([
        tripServices.getFutureTrips(today),
        tripServices.getTripForDate(today),
        tripServices.getPastTrips(today),
      ]);
      
      setFutureTrips(futureTrips);
      setActiveTrip(activeTrip);
      setPastTrips(pastTrips);

    }

    loadTrips()
  }, []));
  
  return (
    <View style={styles.content}>
      <SectionHeader title="ACTIVE ADVENTURE" />

        {activeTrip ? (
          <ActiveTripCard
            trip={activeTrip}
            currentDay={getDayNumber( activeTrip.startDate, getTodayDate() )}
            totalDays={activeTrip.endDate === null ? null : getDayNumber( activeTrip.startDate, activeTrip.endDate )}
            onPress={() => {
                router.push({
                  pathname: "/trip/detailsTrip",
                  params: {
                    id: activeTrip.id,
                  },
                });
            }}
        />) : (
          <View style={styles.noAdventure}>
            <Text style={styles.noAdventureTitle}>
              NO ACTIVE ADVENTURE
            </Text>
        
            <Text style={styles.noAdventureText}>
              You are currently between adventures.
            </Text>
          </View>
        )}
        

        <SectionHeader title="UPCOMING" />

        {futureTrips.length > 0 ? (
          futureTrips.map((trip) => (
            <UpcomingTripCard
                key={trip.id}
                trip={trip}
                onPress={() => {
                console.log("Open trip", trip.id);
                }}
            />
          ))
          ) : (
            <View style={styles.noAdventure}>
              <Text style={styles.noAdventureTitle}>
                NO UPCOMING ADVENTURE
              </Text>
          
              <Text style={styles.noAdventureText}>
                You have no pending adventures. So sad...
              </Text>
            </View>
          )}
        

        <Pressable
            style={styles.newAdventure}
            onPress={() => router.push("/trip/createTrip")}
            >
            <Text style={styles.newAdventureIcon}>+</Text>
            <Text style={styles.newAdventureText}>
                NEW ADVENTURE
            </Text>
        </Pressable>

        <SectionHeader title="PAST" />

        {pastTrips.length > 0 ? (
          pastTrips.map((trip) => (
            <PastTripItem
                key={trip.id}
                trip={trip}
                onPress={() => {
                console.log("Open past trip", trip.id);
                }}
            />
            ))
          ) : (
            <View style={styles.noAdventure}>
              <Text style={styles.noAdventureTitle}>
                NO PAST ADVENTURES
              </Text>
          
              <Text style={styles.noAdventureText}>
                You have no past adventures. Time to set off!
              </Text>
            </View>
          )}
        

        <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
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
  noAdventure: {
    padding: theme.spacing.lg,
  
    backgroundColor: theme.colours.surface,
    borderWidth: 1,
    borderColor: theme.colours.border,
    borderRadius: theme.radius.md,
  
    alignItems: "center",
  },
  
  noAdventureTitle: {
    fontFamily: theme.fonts.displayBold,
    fontSize: theme.fontSize.md,
  
    color: theme.colours.text,
    letterSpacing: 1.5,
  },
  
  noAdventureText: {
    marginTop: theme.spacing.xs,
  
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSize.sm,
  
    color: theme.colours.textSecondary,
    textAlign: "center",
  
    marginBottom: theme.spacing.md,
  },
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