import CheckBox from "@/components/form/CheckBox";
import styles from "@/styles/components/modal/SettingsModal.module.scss";
import {joinedClassNames} from "@/util/classes";
import {type MinecraftVersion, minecraftVersions} from "@/util/types";
import {type ChangeEvent} from "react";
import {useContent} from "@/hooks/ContentHook";

export default function SettingsModal() {
    const {
        debugFramesEnabled,
        setDebugFramesEnabled,
        developerModeEnabled,
        setDeveloperModeEnabled,
        minecraftVersion,
        setMinecraftVersion
    } = useContent();

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