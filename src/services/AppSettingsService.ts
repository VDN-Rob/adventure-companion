import { AppSettings, defaultAppSettings } from "@/config/appSetting";
import AsyncStorage from "@react-native-async-storage/async-storage";

const APP_SETTINGS_STORAGE_KEY = "@app/settings";

export class AppSettingsService {
    async getSettings(): Promise<AppSettings> {
        const storedSettings = await AsyncStorage.getItem(APP_SETTINGS_STORAGE_KEY);

        if (!storedSettings) {
            return defaultAppSettings;
        }

        try {
            const parsed = JSON.parse(storedSettings);

            return {
                ...defaultAppSettings,
                ...parsed,
            };
        } catch {
            return defaultAppSettings;
        }
    }

    async updateSettings( changes: Partial<AppSettings> ): Promise<AppSettings> {
        const currentSettings = await this.getSettings();

        const updatedSettings: AppSettings = {
            ...currentSettings,
            ...changes,
        };

        await AsyncStorage.setItem(APP_SETTINGS_STORAGE_KEY, JSON.stringify(updatedSettings));

        return updatedSettings;
    }
}