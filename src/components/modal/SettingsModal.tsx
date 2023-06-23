import CheckBox from "@/components/form/CheckBox";
import styles from "@/styles/components/modal/SettingsModal.module.scss";
import {joinedClassNames} from "@/util/classes";
import {MinecraftVersion, minecraftVersions} from "@/util/types";
import {useSettings} from "@/hooks/SettingsHook";
import {ChangeEvent} from "react";

export default function SettingsModal() {
    const {
        debugFramesEnabled,
        setDebugFramesEnabled,
        developerModeEnabled,
        setDeveloperModeEnabled,
        minecraftVersion,
        setMinecraftVersion
    } = useSettings();

    /**
     * Handle the change of the minecraft version
     *
     * @param event The event
     */
    function handleMinecraftVersionChange(event: ChangeEvent<HTMLSelectElement>) {
        setMinecraftVersion(event.target.value as MinecraftVersion);
    }

    return (
        <div className={styles.content}>
            <div className={styles.setting}>
                <CheckBox
                    defaultChecked={debugFramesEnabled}
                    change={setDebugFramesEnabled}
                >
                    <span>Debug Frames</span>
                </CheckBox>
            </div>
            <div className={styles.setting}>
                <CheckBox
                    defaultChecked={developerModeEnabled}
                    change={setDeveloperModeEnabled}
                >
                    <span>Developer Mode (Only turn on if you know what you are doing)</span>
                </CheckBox>
            </div>
            <div className={joinedClassNames([styles.setting, styles.column])}>
                <span>Minecraft Version</span>
                <select
                    onChange={handleMinecraftVersionChange}
                >
                    {
                        minecraftVersions.map((version: MinecraftVersion) => {
                            return (
                                <option
                                    key={version}
                                    value={version}
                                    selected={version === minecraftVersion}
                                >
                                    {version}
                                </option>
                            )
                        })
                    }
                </select>
            </div>
        </div>
    )
}