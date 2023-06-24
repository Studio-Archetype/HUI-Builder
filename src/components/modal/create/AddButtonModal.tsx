"use client";

import {useState} from "react";
import {joinedClassNames} from "@/util/classes";
import {BiPlus} from "react-icons/bi";
import {useContent} from "@/hooks/ContentHook";
import Row from "@/components/grid/Row";
import Column from "@/components/grid/Column";
import {
    convertToIcon,
    HoloUIAction,
    HoloUIButtonData,
    HoloUICommandAction,
    HoloUIComponent,
    HoloUISoundAction
} from "@/util/types";
import {useModal} from "@/hooks/ModalHook";
import IconEditor from "@/components/modal/create/IconEditor";
import ActionList from "@/components/modal/action/ActionList";
import styles from "@/styles/components/modal/AddButtonModal.module.scss";

export default function AddButtonModal() {
    const [id, setId] = useState<string>(`${Math.floor(Math.random() * 1000000)}`);
    const [iconType, setIconType] = useState<'text' | 'image' | 'item'>('text');
    const [icon, setIcon] = useState<string>('');
    const [highlightModifier, setHighlightModifier] = useState<number>(0);
    const [actions, setActions] = useState<HoloUIAction[]>([]);

    const {setData} = useContent();
    const {closeModal} = useModal();

    /**
     * Handles the create button click
     */
    function handleCreateClick() {
        // Ensure that the value is not empty
        if (!icon || icon === "" || !id || id === "") {
            alert("Please fill in the value field");
            return;
        }

        // Validate the actions
        for (let action of actions) {
            const type = action.type;
            if (type === 'command') {
                const commandData = action as HoloUICommandAction;

                // Check if the command is empty
                if (!commandData.command || commandData.command === "") {
                    alert("Please fill in the command field");
                    return;
                }

                return;
            }

            const soundData = action as HoloUISoundAction;
            // Check if the sound is empty
            if (!soundData.sound || soundData.sound === "") {
                alert("Please fill in the sound field");
                return;
            }
        }

        let component: HoloUIComponent = {
            id: id,
            offset: [0, 0, 0],
            data: {
                type: 'button',
                actions: actions,
                highlightModifier: highlightModifier,
                icon: convertToIcon(iconType, icon)
            } as HoloUIButtonData
        };

        setData(prevState => {
            if (!prevState) {
                return undefined;
            }

            return {
                ...prevState,
                components: [
                    ...prevState.components,
                    component
                ]
            };
        });
        closeModal();
    }

    return (
        <div className={styles.content}>
            <div>
                <Row>
                    <Column
                        xs={24}
                        lg={12}
                        noPadding
                    >
                        <div className={joinedClassNames([styles.option, styles.column])}>
                            <span>
                                ID
                            </span>
                            <input
                                type="text"
                                defaultValue={id}
                                onBlur={(event) => setId(event.target.value)}
                            />
                        </div>
                    </Column>
                    <Column
                        xs={24}
                        lg={12}
                        noPadding
                    >
                        <div className={joinedClassNames([styles.option, styles.column])}>
                            <span>
                                Highlight Modifier
                            </span>
                            <input
                                type="number"
                                defaultValue={0}
                                onBlur={(event) => setHighlightModifier(Number(event.target.value))}
                            />
                        </div>
                    </Column>
                </Row>
                <IconEditor
                    label={"Button Type"}
                    iconType={iconType}
                    setIconType={setIconType}
                    icon={icon}
                    setIcon={setIcon}
                />
                <div className={joinedClassNames([styles.option, styles.column])}>
                    <span>
                        Click Actions
                    </span>
                    <div className={styles.actions}>
                        <ActionList
                            actions={actions}
                            setActions={setActions}
                        />
                    </div>
                </div>
            </div>
            <div
                className={styles.createButton}
                onClick={handleCreateClick}
            >
                <button>
                    <BiPlus/>
                    Create Component
                </button>
            </div>
        </div>
    );
}