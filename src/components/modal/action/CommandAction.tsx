import {type HoloUIAction, type HoloUICommandAction, type HoloUISoundAction} from "@/util/types";
import {BiServer, BiTrash, BiUser} from "react-icons/bi";
import {AiFillSound} from "react-icons/ai";
import styles from "@/styles/components/modal/action/CommandAction.module.scss";

const soundAction: HoloUISoundAction = {
    type: 'sound',
    sound: '',
    source: 'master',
    volume: 1,
    pitch: 1,
};

export interface CommandActionProps {

    index: number;

    action: HoloUICommandAction;

    actions: HoloUIAction[];

    setActions: (actions: HoloUIAction[]) => void;

}

export default function CommandAction({index, action, actions, setActions}: CommandActionProps) {

    function handleSourceChange() {
        const newSource = action.source === 'player' ? 'server' : 'player';

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
     * Handle the command change.
     *
     * @param command The command
     */
    function handleCommandChange(command: string) {
        setActions(actions.map((action, actionIndex) => {
            if (actionIndex === index) {
                return {
                    ...action,
                    command
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
                return soundAction;
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
                <div
                    className={styles.sourceType}
                    onClick={handleSourceChange}
                >
                    {
                        action.source === 'player' ? (
                            <BiUser/>
                        ) : (
                            <BiServer/>
                        )
                    }
                </div>
                <input
                    type="text"
                    value={action.command}
                    onChange={(e) => handleCommandChange(e.target.value)}
                    placeholder={'/give %player_name% minecraft:diamond'}
                />
            </div>
            <div className={styles.buttons}>
                <div onClick={handleSwitchActionType}>
                    <AiFillSound/>
                </div>
                <div onClick={handleDeleteAction}>
                    <BiTrash className={styles.delete}/>
                </div>
            </div>
        </div>
    );
}