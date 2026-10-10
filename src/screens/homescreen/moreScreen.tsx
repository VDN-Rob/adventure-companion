import { MenuItem } from "@/components/oldForms/MenuItem";
import { getTranslations } from "@/i18n";
import { useAppSettings } from "@/providers/AppSettingsProvider";
import { BottomNavigation } from "@/screens/homescreen/components/BottomNavigation";
import { theme } from "@/styling/theme";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MoreScreen() {

	const { settings } = useAppSettings();
	const t = getTranslations(settings.language)
	
	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.content}>
				<Text style={styles.title}>
					{t.moreScreen.title}
				</Text>

				<Text style={styles.subtitle}>
					{t.moreScreen.subTitle}
				</Text>

				<View style={styles.menu}>
					<MenuItem
					icon="⚑"
					title={t.adventures.adventure}
					description={t.moreScreen.adventuresDesc}
					onPress={() => { router.push("/trip/trips") }}
					/>

					<MenuItem
					icon="◇"
					title={t.finance.finances}
					description={t.moreScreen.financesDesc}
					onPress={() => { router.push("/finance/finance")}}
					/>

					<MenuItem
					icon="✎"
					title={t.diary.diary}
					description={t.moreScreen.diaryDesc}
					onPress={() => { router.push("/diary/diary") }}
					/>

					<MenuItem
					icon="[]"
					title={t.maps.maps}
					description={t.moreScreen.mapsDesc}
					onPress={() => { router.push("/map/offlineMap") }}
					/>

					<MenuItem
						icon="⚙"
						title={t.moreScreen.settings}
						onPress={() => { router.push("/settings")}}
					/>
					</View>
			</View>

			<BottomNavigation
				activeTab="more"
				items={[
				{
					key: "day",
					icon: "●",
					label: t.common.home,
					onPress: () => router.push("/"),
				},
				{
					key: "map",
					icon: "◇",
					label: t.maps.map,
					onPress: () => router.push("/map/map"),
				},
				]}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.colours.background,
	},

	content: {
		flex: 1,

		paddingHorizontal: theme.spacing.md,
		paddingTop: theme.spacing.xl,
	},

	title: {
		fontFamily: theme.fonts.displayBold,
		fontSize: theme.fontSize.xxxl,

		color: theme.colours.text,

		letterSpacing: 2,
	},

	subtitle: {
		marginTop: 2,

		fontFamily: theme.fonts.bodyBold,
		fontSize: theme.fontSize.xs,

		color: theme.colours.accent,

		letterSpacing: 2,
	},

	menu: {
		marginTop: theme.spacing.xl,
		gap: theme.spacing.md,
  },
});