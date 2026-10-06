import {
    AppSettings,
    defaultAppSettings,
} from "@/config/appSetting";
import { AppSettingsService } from "@/services/AppSettingsService";
import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

interface AppSettingsContextValue {
    settings: AppSettings;
    loading: boolean;
    updateSettings: (
        changes: Partial<AppSettings>,
    ) => Promise<void>;
}

const AppSettingsContext =
    createContext<AppSettingsContextValue | null>(null);

interface AppSettingsProviderProps {
    children: ReactNode;
    appSettingsService: AppSettingsService;
}

export function AppSettingsProvider({
    children,
    appSettingsService,
}: AppSettingsProviderProps) {
    const [settings, setSettings] =
        useState<AppSettings>(defaultAppSettings);

    const [loading, setLoading] = useState(true);

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

    const updateSettings = useCallback(
        async (changes: Partial<AppSettings>) => {
            const updatedSettings =
                await appSettingsService.updateSettings(changes);

            setSettings(updatedSettings);
        },
        [appSettingsService],
    );

    return (
        <AppSettingsContext.Provider
            value={{
                settings,
                loading,
                updateSettings,
            }}
        >
            {children}
        </AppSettingsContext.Provider>
    );
}

export function useAppSettings() {
    const context = useContext(AppSettingsContext);

    if (!context) {
        throw new Error(
            "useAppSettings must be used within AppSettingsProvider",
        );
    }

    return context;
}