"use client";

import {createContext, type ReactNode, useContext, useEffect, useState} from "react";
import {ContentType, MCItem, MinecraftVersion} from "@/util/types";

interface ContentProviderProps {

    children: ReactNode;

}

export type ContentContextType = {

    contentType: ContentType;

    setContentType: (contentType: ContentType) => void;

    switchContentType: () => void;

    debugFramesEnabled: boolean;

    setDebugFramesEnabled: (enabled: boolean) => void;

    developerModeEnabled: boolean;

    setDeveloperModeEnabled: (enabled: boolean) => void;

    minecraftVersion: MinecraftVersion;

    setMinecraftVersion: (version: MinecraftVersion) => void;

    items: MCItem[]

}

// Create a hooks for the content type
const ContentContext = createContext<ContentContextType | null>(null);

// Provider component for the content type
export function ContentProvider({children}: ContentProviderProps) {
    const [contentType, setContentType] = useState<ContentType>(ContentType.VISUAL_EDITOR);
    const [debugFramesEnabled, setDebugFramesEnabled] = useState(false);
    const [developerModeEnabled, setDeveloperModeEnabled] = useState(false);
    const [minecraftVersion, setMinecraftVersion] = useState<MinecraftVersion>("1.18");
    const [items, setItems] = useState<MCItem[]>([]);

    /**
     * Switches the content type.
     */
    function switchContentType() {
        switch (contentType) {
            case ContentType.CODE_EDITOR:
                setContentType(ContentType.VISUAL_EDITOR);
                break;
            case ContentType.VISUAL_EDITOR:
                setContentType(ContentType.CODE_EDITOR);
                break;
        }
    }

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
        <ContentContext.Provider value={{
            contentType,
            setContentType,
            switchContentType,
            debugFramesEnabled,
            setDebugFramesEnabled,
            developerModeEnabled,
            setDeveloperModeEnabled,
            minecraftVersion,
            setMinecraftVersion,
            items,
        }}>
            {children}
        </ContentContext.Provider>
    );
}

// Hook to use the content hooks
export function useContent() {
    const context = useContext(ContentContext);

    // Ensure that the hook is used within a ContentProvider
    if (!context) {
        throw new Error("useContent must be used within a ContentProvider");
    }

    return context;
}