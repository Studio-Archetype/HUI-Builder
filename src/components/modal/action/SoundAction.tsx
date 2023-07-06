import {type HoloUIAction, type HoloUICommandAction, type HoloUISoundAction} from "@/util/types";
import {BiNote, BiTrash} from "react-icons/bi";
import {AiFillSound} from "react-icons/ai";
import {HiOutlineCommandLine} from "react-icons/hi2";
import styles from "@/styles/components/modal/action/SoundAction.module.scss";

const commandAction: HoloUICommandAction = {
    type: 'command',
    command: '',
    source: 'player'
};

export interface SoundActionProps {

    index: number;

    action: HoloUISoundAction;

    actions: HoloUIAction[];

    setActions: (actions: HoloUIAction[]) => void;

}

export default function SoundAction({index, action, actions, setActions}: SoundActionProps) {

    /**
     * Handle the sound change.
     *
     * @param sound  The sound
     */
    function handleSoundChange(sound: string) {
        setActions(actions.map((action, actionIndex) => {
            if (actionIndex === index) {
                return {
                    ...action,
                    sound
                };
            }

            return action;
        }));
    }

    /**
     * Handle the source change.
     */
    function handleSourceChange(newSource: 'master' | 'music' | 'record' | 'weather' | 'block' | 'hostile' | 'neutral' | 'player' | 'ambient' | 'voice') {
        setActions(actions.map((action, actionIndex) => {
            if (actionIndex === index) {
                return {
                    ...action,
                    source: newSource
                };
            }

            return action;
        }));
    }

    /**
     * Handle the volume change.
     *
     * @param volume The volume
     */
    function handleVolumeChange(volume: number) {
        setActions(actions.map((action, actionIndex) => {
            if (actionIndex === index) {
                return {
                    ...action,
                    volume
                };
            }

            return action;
        }));
    }

    /**
     * Handle the pitch change.
     *
     * @param pitch The pitch
     */
    function handlePitchChange(pitch: number) {
        setActions(actions.map((action, actionIndex) => {
            if (actionIndex === index) {
                return {
                    ...action,
                    pitch
                };
            }

            return action;
        }));
    }

    /**
     * Handle the switch action type.
     */
    function handleSwitchActionType() {
        setActions(actions.map((action, actionIndex) => {
            if (actionIndex === index) {
                return commandAction;
            }

            return action;
        }));
    }

    /**
     * Handle the delete action.
     */
    function handleDeleteAction() {
        setActions(actions.filter((action, actionIndex) => {
            return actionIndex !== index;
        }));
    }

    return (
        <div className={styles.action}>
            <div className={styles.inputs}>
                <input
                    type="text"
                    placeholder={'Sound'}
                    value={action.sound}
                    onChange={(e) => handleSoundChange(e.target.value)}
                    className={styles.soundInput}
                />
                <select
                    value={action.source}
                    onChange={(e) => handleSourceChange(e.target.value as 'master' | 'music' | 'record' | 'weather' | 'block' | 'hostile' | 'neutral' | 'player' | 'ambient' | 'voice')}
                >
                    <option value="master">Master</option>
                    <option value="music">Music</option>
                    <option value="record">Record</option>
                    <option value="weather">Weather</option>
                    <option value="block">Block</option>
                    <option value="hostile">Hostile</option>
                    <option value="neutral">Neutral</option>
                    <option value="player">Player</option>
                    <option value="ambient">Ambient</option>
                    <option value="voice">Voice</option>
                </select>
                <div>
                    <AiFillSound/>
                    <input
                        type="number"
                        value={action.volume}
                        onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
                    />
                </div>
                <div>
                    <BiNote/>
                    <input
                        type="number"
                        value={action.pitch}
                        onChange={(e) => handlePitchChange(parseInt(e.target.value))}
                    />
                </div>
            </div>
            <div className={styles.buttons}>
                <div
                    onClick={() => handleSwitchActionType()}
                >
                    <HiOutlineCommandLine/>
                </div>
                <div
                    onClick={() => handleDeleteAction()}
                >
                    <BiTrash className={styles.delete}/>
                </div>
            </div>
        </div>
    );
}