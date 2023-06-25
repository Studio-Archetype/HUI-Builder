"use client";

import {useState} from "react";
import {joinedClassNames} from "@/util/classes";
import {BiPlus} from "react-icons/bi";
import {useContent} from "@/hooks/ContentHook";
import {useModal} from "@/hooks/ModalHook";
import Column from "@/components/grid/Column";
import Row from "@/components/grid/Row";
import IconEditor from "@/components/modal/create/IconEditor";
import ActionList from "@/components/modal/action/ActionList";
import {
    convertToIcon,
    type HoloUIAction,
    type HoloUICommandAction,
    type HoloUIComponent,
    type HoloUISoundAction,
    type HoloUIToggleData
} from "@/util/types";
import styles from "@/styles/components/modal/AddToggleModal.module.scss";

export default function AddToggleModal() {
    const [id, setId] = useState<string>(`${Math.floor(Math.random() * 1000000)}`);
    const [highlightModifier, setHighlightModifier] = useState<number>(0);
    const [condition, setCondition] = useState<string>('');
    const [expectedValue, setExpectedValue] = useState<string>('');

    // True
    const [trueIconType, setTrueIconType] = useState<'text' | 'image' | 'item'>('text');
    const [trueIcon, setTrueIcon] = useState<string>('');
    const [trueActions, setTrueActions] = useState<HoloUIAction[]>([]);

    // False
    const [falseIconType, setFalseIconType] = useState<'text' | 'image' | 'item'>('text');
    const [falseIcon, setFalseIcon] = useState<string>('');
    const [falseActions, setFalseActions] = useState<HoloUIAction[]>([]);

    const {setData} = useContent();
    const {closeModal} = useModal();

    /**
     * Handles the create button click
     */
    function handleCreateClick() {
        if (!id || id === "") {
            alert("Please fill in the ID field");
            return;
        }

        if (!condition || condition === "") {
            alert("Please fill in the condition field");
            return;
        }

        if (!expectedValue || expectedValue === "") {
            alert("Please fill in the expected value field");
            return;
        }

        if (!trueIcon || trueIcon === "") {
            alert("Please fill in the true icon field");
            return;
        }

        if (!falseIcon || falseIcon === "") {
            alert("Please fill in the false icon field");
            return;
        }

        if (trueActions.length === 0) {
            alert("Please add at least one action to the true actions list");
            return;
        }

        if (falseActions.length === 0) {
            alert("Please add at least one action to the false actions list");
            return;
        }

        // Verify the actions
        const allActions = [...trueActions, ...falseActions];
        for (const action of allActions) {
            const type = action.type;
            if (type === 'command') {
                const commandData = action as HoloUICommandAction;

                // Check if the command is empty
                if (!commandData.command || commandData.command === "") {
                    alert("Please fill in all the fields in the actions.");
                    return;
                }
                continue;
            }

            const soundData = action as HoloUISoundAction;
            // Check if the sound is empty
            if (!soundData.sound || soundData.sound === "") {
                alert("Please fill in all the fields in the actions.");
                return;
            }
        }

        const component: HoloUIComponent = {
            id: id,
            offset: [0, 0, 0],
            data: {
                type: 'toggle',
                trueActions: trueActions,
                falseActions: falseActions,
                condition: condition,
                highlightModifier: highlightModifier,
                expectedValue: expectedValue,
                trueIcon: convertToIcon(trueIconType, trueIcon),
                falseIcon: convertToIcon(falseIconType, falseIcon)
            } as HoloUIToggleData
        }

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
                                className={styles.fullWidth}
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
                                className={styles.fullWidth}
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
                                Expected Value
                            </span>
                            <input
                                type="text"
                                placeholder={"true"}
                                onBlur={(event) => setExpectedValue(event.target.value)}
                                className={styles.fullWidth}
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
                                Condition
                            </span>
                            <input
                                type="text"
                                placeholder={"x == y"}
                                onBlur={(event) => setCondition(event.target.value)}
                                className={styles.fullWidth}
                            />
                        </div>
                    </Column>
                </Row>
                <IconEditor
                    label={"True Icon"}
                    iconType={trueIconType}
                    setIconType={setTrueIconType}
                    icon={trueIcon}
                    setIcon={setTrueIcon}
                />
                <div className={joinedClassNames([styles.option, styles.column])}>
                    <label>True Actions</label>
                    <div className={styles.actions}>
                        <ActionList
                            actions={trueActions}
                            setActions={setTrueActions}
                        />
                    </div>
                </div>
                <IconEditor
                    label={"False Icon"}
                    iconType={falseIconType}
                    setIconType={setFalseIconType}
                    icon={falseIcon}
                    setIcon={setFalseIcon}
                />
                <div className={joinedClassNames([styles.option, styles.column])}>
                    <label>False Actions</label>
                    <div className={styles.actions}>
                        <ActionList
                            actions={falseActions}
                            setActions={setFalseActions}
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