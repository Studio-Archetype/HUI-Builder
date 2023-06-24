import {HoloUIAction, HoloUICommandAction, HoloUISoundAction} from "@/util/types";
import CommandAction from "@/components/modal/action/CommandAction";
import {Dispatch, SetStateAction} from "react";
import SoundAction from "@/components/modal/action/SoundAction";
import styles from "@/styles/components/modal/action/ActionList.module.scss";

const commandAction: HoloUICommandAction = {
    type: 'command',
    command: '',
    source: 'player'
}

interface ActionListProps {

    actions: HoloUIAction[];

    setActions: Dispatch<SetStateAction<HoloUIAction[]>>

}

export default function ActionList({actions, setActions}: ActionListProps) {

    /**
     * Handle the add action.
     */
    function handleAddAction() {
        setActions((actions) => {
            return [...actions, commandAction];
        });
    }

    return (
        <div className={styles.actionList}>
            {
                actions.map((action, index) => {
                    if (action.type === 'command') {
                        return (
                            <CommandAction
                                key={index}
                                index={index}
                                action={action as HoloUICommandAction}
                                setActions={setActions}
                            />
                        );
                    }

                    return (
                        <SoundAction
                            index={index}
                            key={index}
                            action={action as HoloUISoundAction}
                            setActions={setActions}
                        />
                    );
                })
            }
            <div
                className={styles.addAction}
                onClick={handleAddAction}
            >
                + Add Action
            </div>
        </div>
    );
}