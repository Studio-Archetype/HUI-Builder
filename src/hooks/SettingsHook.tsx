"use client";

import {createContext, type ReactNode, useContext, useEffect, useState} from "react";
import {type MCItem, type MinecraftVersion} from "@/util/types";

interface SettingsProviderProps {

    children: ReactNode;

}

export type SettingsContextType = {

    debugFramesEnabled: boolean;

    setDebugFramesEnabled: (enabled: boolean) => void;

    developerModeEnabled: boolean;

    setDeveloperModeEnabled: (enabled: boolean) => void;

    minecraftVersion: MinecraftVersion;

    setMinecraftVersion: (version: MinecraftVersion) => void;

    items: MCItem[]

}

// Create a hooks for the settings
const SettingsContext = createContext<SettingsContextType | null>(null);

// Provider component for the settings
export function SettingsProvider({children}: SettingsProviderProps) {
    const [debugFramesEnabled, setDebugFramesEnabled] = useState(false);
    const [developerModeEnabled, setDeveloperModeEnabled] = useState(false);
    const [minecraftVersion, setMinecraftVersion] = useState<MinecraftVersion>("1.18");
    const [items, setItems] = useState<MCItem[]>([]);

    useEffect(() => {
        const settings = localStorage.getItem("settings") || JSON.stringify({
            debugFramesEnabled: false,
            developerModeEnabled: false,
            minecraftVersion: "1.18",
        });
        if (!settings) {
            return;
        }

        try {
            const parsedSettings = JSON.parse(settings);

            // Set the settings
            setDebugFramesEnabled(parsedSettings.debugFramesEnabled);
            setDeveloperModeEnabled(parsedSettings.developerModeEnabled);
            setMinecraftVersion(parsedSettings.minecraftVersion);
        } catch (ignored) {
            localStorage.removeItem("settings");
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("settings", JSON.stringify({
            debugFramesEnabled,
            developerModeEnabled,
            minecraftVersion,
        }));

        // Load the minecraft version item icons from /assets/versions/<version>.json
        fetch(`/assets/versions/${minecraftVersion}.json`)
            .then(response => response.json())
            .then(data => {
                setItems(data as MCItem[]);
            })
            .catch(error => {
                console.error(error);
            });
    }, [debugFramesEnabled, developerModeEnabled, minecraftVersion]);

    return (
        <SettingsContext.Provider value={{
            debugFramesEnabled,
            setDebugFramesEnabled,
            developerModeEnabled,
            setDeveloperModeEnabled,
            minecraftVersion,
            setMinecraftVersion,
            items,
        }}>
            {children}
        </SettingsContext.Provider>
    );
}

// Hook for using the settings
export function useSettings() {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error("useSettings must be used within a SettingsProvider");
    }

    return context;
}