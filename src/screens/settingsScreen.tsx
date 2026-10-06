import { Selector } from "@/components/forms/Selector";
import { AppCurrency, AppLanguage, AppTimeFormat } from "@/config/appSetting";
import { useAppSettings } from "@/providers/AppSettingsProvider";
import { styles } from "@/styling/styles";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


const timeFormatOptions = [
    {
        value: "24",
        label: "24-hour",
        description: "Example: 18:30",
    },
    {
        value: "12",
        label: "12-hour",
        description: "Example: 6:30 PM",
    },
] satisfies {
    value: AppTimeFormat;
    label: string;
    description: string;
}[];

const languageOptions = [
    {
        value: "en",
        label: "English",
    },
    {
        value: "fr",
        label: "Français",
    },
    {
        value: "nl",
        label: "Nederlands",
    },
] satisfies {
    value: AppLanguage;
    label: string;
}[];

const currencyOptions = [
    {
        value: "EUR",
        label: "Euro",
        description: "€",
    },
    {
        value: "USD",
        label: "US Dollar",
        description: "$",
    },
    {
        value: "GBP",
        label: "British Pound",
        description: "£",
    },
    {
        value: "CHF",
        label: "Swiss Franc",
        description: "CHF",
    },
] satisfies {
    value: AppCurrency;
    label: string;
    description: string;
}[];


export default function SettingsScreen() {
    const { settings, updateSettings } = useAppSettings();

    async function handleTimeFormatChange(value: AppTimeFormat) {
		await updateSettings({
			timeFormat: value,
		});
    }

    async function handleLanguageChange(value: AppLanguage) {
		await updateSettings({
			language: value,
		});
    }

    async function handleCurrencyChange(value: AppCurrency) {
		await updateSettings({
			currency: value,
		});
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.content}>
                    <Selector
						label="TIME FORMAT"
						options={timeFormatOptions}
						selectedValue={settings.timeFormat}
						onSelect={handleTimeFormatChange}
					/>

					<Selector
						label="LANGUAGE"
						options={languageOptions}
						selectedValue={settings.language}
						onSelect={handleLanguageChange}
					/>

					<Selector
						label="CURRENCY"
						options={currencyOptions}
						selectedValue={settings.currency}
						onSelect={handleCurrencyChange}
					/>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}