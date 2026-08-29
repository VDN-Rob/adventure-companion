import { theme } from "@/app/theme";
import { DiaryItem } from "@/screens/diary/DiaryScreen";
import { formatDate } from "@/utils/formatDate";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

type DiaryCardProps = {
  item: DiaryItem;
  onPress: () => void;
};

export function DiaryCard({
  item,
  onPress,
}: DiaryCardProps) {
  const { entry, day } = item;

  const photos = [
    entry.photo1,
    entry.photo2,
    entry.photo3,
  ].filter(
    (photo): photo is string => photo !== null
  );

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.diaryCard,
        pressed && styles.diaryCardPressed,
      ]}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardDate}>
          <Text style={styles.cardDateText}>
            {formatDate(
              day?.date ?? entry.createdAt
            )}
          </Text>

          {day?.title && (
            <Text style={styles.dayTitle}>
              {day.title}
            </Text>
          )}
        </View>

        <Text style={styles.arrow}>
          →
        </Text>
      </View>

      <Text
        style={styles.entryTitle}
        numberOfLines={2}
      >
        {entry.title}
      </Text>

      {entry.text && (
        <Text
          style={styles.preview}
          numberOfLines={3}
        >
          {entry.text}
        </Text>
      )}

      {photos.length > 0 && (
        <View style={styles.thumbnailRow}>
          {photos.map((photo, index) => (
            <Image
              key={`${photo}-${index}`}
              source={{ uri: photo }}
              style={styles.thumbnail}
            />
          ))}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colours.background,
  },

  content: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },

  detailContent: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },

  loading: {
    margin: theme.spacing.md,
    fontFamily: theme.fonts.body,
    color: theme.colours.textSecondary,
  },

  error: {
    margin: theme.spacing.md,
    fontFamily: theme.fonts.body,
    color: theme.colours.textSecondary,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing.lg,
  },

  kicker: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: theme.fontSize.xs,
    letterSpacing: 2,
    color: theme.colours.accent,
  },

  title: {
    marginTop: 2,
    fontFamily: theme.fonts.displayBold,
    fontSize: theme.fontSize.xxl,
    color: theme.colours.text,
  },

  addButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.colours.border,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colours.surface,
  },

  addButtonPressed: {
    backgroundColor: theme.colours.surfaceRaised,
    borderColor: theme.colours.accent,
  },

  addButtonText: {
    fontFamily: theme.fonts.displayBold,
    fontSize: theme.fontSize.xl,
    color: theme.colours.accent,
  },

  diaryCard: {
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colours.border,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colours.surface,
  },

  diaryCardPressed: {
    backgroundColor: theme.colours.surfaceRaised,
    borderColor: theme.colours.accent,
    transform: [{ translateY: 2 }],
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },

  cardDate: {
    flex: 1,
  },

  cardDateText: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: theme.fontSize.xs,
    letterSpacing: 1.5,
    color: theme.colours.accent,
  },

  dayTitle: {
    marginTop: 2,
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSize.xs,
    color: theme.colours.textMuted,
  },

  arrow: {
    marginLeft: theme.spacing.sm,
    fontFamily: theme.fonts.displayBold,
    fontSize: theme.fontSize.lg,
    color: theme.colours.textMuted,
  },

  entryTitle: {
    marginTop: theme.spacing.sm,
    fontFamily: theme.fonts.displayBold,
    fontSize: theme.fontSize.lg,
    color: theme.colours.text,
  },

  preview: {
    marginTop: theme.spacing.xs,
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSize.sm,
    lineHeight: 20,
    color: theme.colours.textSecondary,
  },

  thumbnailRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },

  thumbnail: {
    width: 78,
    height: 78,
    borderRadius: theme.radius.sm,
  },

  empty: {
    alignItems: "center",
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },

  emptyTitle: {
    fontFamily: theme.fonts.displayBold,
    fontSize: theme.fontSize.lg,
    color: theme.colours.text,
  },

  emptyText: {
    marginTop: theme.spacing.sm,
    textAlign: "center",
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSize.sm,
    lineHeight: 20,
    color: theme.colours.textSecondary,
  },

  emptyButton: {
    marginTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colours.accent,
  },

  emptyButtonText: {
    fontFamily: theme.fonts.displayBold,
    fontSize: theme.fontSize.sm,
    letterSpacing: 1.2,
    color: theme.colours.background,
  },

  backButton: {
    alignSelf: "flex-start",
    marginBottom: theme.spacing.lg,
  },

  backText: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: theme.fontSize.xs,
    letterSpacing: 1.2,
    color: theme.colours.accent,
  },

  detailDate: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: theme.fontSize.xs,
    letterSpacing: 1.5,
    color: theme.colours.accent,
  },

  detailDayTitle: {
    marginTop: 3,
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSize.sm,
    color: theme.colours.textMuted,
  },

  detailTitle: {
    marginTop: theme.spacing.sm,
    fontFamily: theme.fonts.displayBold,
    fontSize: theme.fontSize.xxl,
    lineHeight: 36,
    color: theme.colours.text,
  },

  dayStats: {
    flexDirection: "row",
    gap: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },

  stat: {
    fontFamily: theme.fonts.bodyBold,
    fontSize: theme.fontSize.xs,
    color: theme.colours.textSecondary,
  },

  detailPhotos: {
    gap: theme.spacing.sm,
  },

  detailPhoto: {
    width: "100%",
    height: 180,
    borderRadius: theme.radius.md,
  },

  detailPhotoSingle: {
    height: 240,
  },

  detailText: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSize.md,
    lineHeight: 26,
    color: theme.colours.text,
  },

  editButton: {
    marginTop: theme.spacing.xl,
    minHeight: 50,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.colours.border,
    borderRadius: theme.radius.md,
  },

  editButtonPressed: {
    opacity: 0.6,
    borderColor: theme.colours.accent,
  },

  editButtonText: {
    fontFamily: theme.fonts.displayBold,
    fontSize: theme.fontSize.sm,
    letterSpacing: 1.5,
    color: theme.colours.text,
  },
});