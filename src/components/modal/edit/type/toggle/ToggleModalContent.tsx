import {type HoloUIAction, type HoloUIIcon, type HoloUIToggleData} from "@/util/types";
import {useComponentEditModal} from "@/components/modal/edit/ComponentEditModal";
import IconEditor from "@/components/modal/edit/IconEditor";
import InputGroup from "@/components/form/InputGroup";
import ActionList from "@/components/modal/action/ActionList";

export default function ToggleModalContent() {
    const {setComponent, component} = useComponentEditModal();

    /**
     * Handle the ID being updated
     *
     * @param value  The new ID value
     */
    function handleIdUpdate(value: string) {
        setComponent((component) => {
            if (!component) {
                return component;
            }

            return {
                ...component,
                id: value
            }
        });
    }

    /**
     * Handle the highlight modifier being updated
     */
    function handleHighlightModifierUpdate(value: string) {
        if (isNaN(Number(value))) {
            alert("Highlight modifier must be a number");
            return;
        }

        setComponent((component) => {
            if (!component) {
                return component;
            }

            return {
                ...component,
                data: {
                    ...component.data,
                    highlightModifier: Number(value)
                }
            }
        });
    }

    /**
     * Handle the expected value being updated
     *
     * @param value The new expected value
     */
    function handleExpectedValueUpdate(value: string) {
        setComponent((component) => {
            if (!component) {
                return component;
            }

            return {
                ...component,
                data: {
                    ...component.data,
                    expectedValue: value
                }
            }
        });
    }

    /**
     * Handle the condition being updated
     *
     * @param value The new condition
     */
    function handleConditionUpdate(value: string) {
        setComponent((component) => {
            if (!component) {
                return component;
            }

            return {
                ...component,
                data: {
                    ...component.data,
                    condition: value
                }
            }
        });
    }

    /**
     * Handle the icon being updated
     */
    function handleIconUpdate(icon: HoloUIIcon, actionType: boolean) {
        setComponent((component) => {
            if (!component) {
                return component;
            }

            return {
                ...component,
                data: {
                    ...component.data,
                    [actionType ? "trueIcon" : "falseIcon"]: icon
                }
            }
        });
    }

    /**
     * Handle the actions being updated
     *
     * @param actions The new actions
     * @param actionType  The type of actions being updated (true/false)
     */
    function handleActionsUpdate(actions: HoloUIAction[], actionType: boolean) {
        setComponent((component) => {
            if (!component) {
                return component;
            }

            return {
                ...component,
                data: {
                    ...component.data,
                    [actionType ? "trueActions" : "falseActions"]: actions
                } as HoloUIToggleData
            }
        });
    }

    return (
        <div>
            <InputGroup
                label={"ID"}
            >
                <input
                    type={"text"}
                    value={component.id}
                    onChange={(e) => handleIdUpdate(e.target.value)}
                />
            </InputGroup>
            <InputGroup
                label={"Highlight Modifier"}
            >
                <input
                    type={"number"}
                    value={(component.data as HoloUIToggleData).highlightModifier}
                    onChange={(e) => handleHighlightModifierUpdate(e.target.value)}
                />
            </InputGroup>
            <InputGroup
                label={"Condition"}
            >
                <input
                    type={"text"}
                    placeholder={"x == y"}
                    value={(component.data as HoloUIToggleData).condition}
                    onChange={(e) => handleConditionUpdate(e.target.value)}
                />
            </InputGroup>
            <InputGroup
                label={"Expected Value"}
            >
                <input
                    type={"text"}
                    placeholder={"true"}
                    value={(component.data as HoloUIToggleData).expectedValue}
                    onChange={(e) => handleExpectedValueUpdate(e.target.value)}
                />
            </InputGroup>
            <InputGroup label={"True Icon"}>
                <IconEditor
                    currentIcon={(component.data as HoloUIToggleData).trueIcon}
                    onUpdate={icon => handleIconUpdate(icon, true)}
                />
            </InputGroup>
            <InputGroup
                label={"True Actions"}
            >
                <ActionList
                    actions={(component.data as HoloUIToggleData).trueActions}
                    setActions={(actions) => handleActionsUpdate(actions, true)}
                />
            </InputGroup>
            <InputGroup label={"False Icon"}>
                <IconEditor
                    currentIcon={(component.data as HoloUIToggleData).falseIcon}
                    onUpdate={icon => handleIconUpdate(icon, false)}
                />
            </InputGroup>
            <InputGroup
                label={"False Actions"}
            >
                <ActionList
                    actions={(component.data as HoloUIToggleData).falseActions}
                    setActions={(actions) => handleActionsUpdate(actions, false)}
                />
            </InputGroup>
        </div>
    );
}