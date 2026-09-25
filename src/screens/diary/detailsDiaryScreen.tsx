import { Day } from "@/models/Day";
import { DiaryEntry } from "@/models/DiaryEntry";
import { useAppServices } from "@/utils/useRepository/useAppServiceProvider";
import {
  router,
  useFocusEffect,
  useLocalSearchParams,
} from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { DiaryDetail } from "@/components/diary/DiaryDetail";
import { DiaryOverview } from "@/components/diary/DiaryOverview";
import { theme } from "@/styling/theme";

export type DiaryItem = {
  entry: DiaryEntry;
  day: Day | null;
};

export default function DetailsDiaryScreen() {
  const { tripId } =
    useLocalSearchParams<{
      tripId: string;
    }>();

  const {
    diaryEntryServices,
    dayServices,
  } = useAppServices();

  const [items, setItems] = useState<DiaryItem[]>([]);
  const [selectedEntry, setSelectedEntry] =
    useState<DiaryItem | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const loadDiary = useCallback(async () => {
    if (!tripId) {
      setError("No adventure was specified.");
      setItems([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const entries =
        await diaryEntryServices.getDiaryEntriesForTrip(
          tripId
        );

      const diaryItems =
        await Promise.all(
          entries.map(async (entry) => {
            let day: Day | null = null;

            if (entry.dayId) {
              day = await dayServices.getDay(
                entry.dayId
              );
            }

            return {
              entry,
              day,
            };
          })
        );

      diaryItems.sort((a, b) => {
        const dateA =
          a.day?.date ??
          a.entry.createdAt;

        const dateB =
          b.day?.date ??
          b.entry.createdAt;

        return dateB.localeCompare(dateA);
      });
      setItems(diaryItems);

      setSelectedEntry((current) => {
        if (!current) {
          return null;
        }
  
        return (
          diaryItems.find(
            (item) =>
              item.entry.id === current.entry.id
          ) ?? null
        );
      });
    } catch (e) {
      console.error(
        "Failed to load diary:",
        e
      );
  
      setError("Unable to load diary.");
    } finally {
      setIsLoading(false);
    }
  }, [
    tripId,
    diaryEntryServices,
    dayServices,
  ]);

  useFocusEffect(
    useCallback(() => {
      loadDiary();
    }, [loadDiary])
  );

  function openEntry(item: DiaryItem) {
    setSelectedEntry(item);
  }

  function closeEntry() {
    setSelectedEntry(null);
  }

  function createEntry() {
    if (!tripId) {
      return;
    }

    router.push({
      pathname: "/diary/createDiaryEntry",
      params: {
        tripId,
      },
    });
  }

  function editEntry(entry: DiaryEntry) {
    router.push({
      pathname: "/diary/editDiaryEntry",
      params: {
        diaryEntryId: entry.id,
      },
    });
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator />

          <Text style={styles.loading}>
            Loading diary...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.error}>
          {error}
        </Text>
      </SafeAreaView>
    );
  }

  if (selectedEntry) {
    return (
      <DiaryDetail
        item={selectedEntry}
        onBack={closeEntry}
        onEdit={() =>
          editEntry(selectedEntry.entry)
        }
      />
    );
  }

  return (
    <DiaryOverview
      items={items}
      onEntryPress={openEntry}
      onCreatePress={createEntry}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      theme.colours.background,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  loading: {
    marginTop: theme.spacing.sm,
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSize.sm,
    color: theme.colours.textSecondary,
  },

  error: {
    margin: theme.spacing.md,
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSize.sm,
    color: theme.colours.textSecondary,
  },
});