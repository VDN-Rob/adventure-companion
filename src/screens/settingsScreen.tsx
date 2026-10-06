import { Selector } from "@/components/forms/Selector";
import { AppCurrency, AppLanguage, AppSettings, AppTimeFormat } from "@/config/appSetting";
import { styles } from "@/styling/styles";
import { useAppServices } from "@/utils/useRepository/useAppServiceProvider";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, SafeAreaView, ScrollView, View } from "react-native";


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
    const [settings, setSettings] = useState<AppSettings | null>(null);
    const [loading, setLoading] = useState(true);

    const { appSettingsService } = useAppServices();

    useEffect(() => {
        async function loadSettings() {
            try {
                const storedSettings =
                    await appSettingsService.getSettings();

                setSettings(storedSettings);
            } finally {
                setLoading(false);
            }
        }

        loadSettings();
    }, [appSettingsService]);

    async function handleTimeFormatChange(value: AppTimeFormat) {
        const updatedSettings =
            await appSettingsService.updateSettings({
                timeFormat: value,
            });

        setSettings(updatedSettings);
    }

    async function handleLanguageChange(value: AppLanguage) {
        const updatedSettings =
            await appSettingsService.updateSettings({
                language: value,
            });

        setSettings(updatedSettings);
    }

    async function handleCurrencyChange(value: AppCurrency) {
        const updatedSettings =
            await appSettingsService.updateSettings({
                currency: value,
            });

        setSettings(updatedSettings);
    }

    return (
		<SafeAreaView style={styles.container} edges={["top", "bottom"]}>
			<KeyboardAvoidingView style={styles.container}>
				<ScrollView>
					<View style={styles.content}>
						{!loading && settings && (
							<>
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
							</>
						)}
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
        
    );
}