import {type HoloUIAction, type HoloUIButtonData, type HoloUIIcon} from "@/util/types";
import {useComponentEditModal} from "@/components/modal/edit/ComponentEditModal";
import IconEditor from "@/components/modal/edit/IconEditor";
import InputGroup from "@/components/form/InputGroup";
import ActionList from "@/components/modal/action/ActionList";

export default function ButtonModalContent() {
    const {setComponent, component} = useComponentEditModal();

    /**
     * Handle the icon being updated
     */
    function handleIconUpdate(icon: HoloUIIcon) {
        setComponent((component) => {
            if (!component) {
                return component;
            }

            return {
                ...component,
                data: {
                    ...component.data,
                    icon
                }
            }
        });
    }

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
     * Handle the actions being updated
     *
     * @param actions The new actions
     */
    function handleActionsUpdate(actions: HoloUIAction[]) {
        setComponent((component) => {
            if (!component) {
                return component;
            }

            return {
                ...component,
                data: {
                    ...component.data,
                    actions
                }
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
                    value={(component.data as HoloUIButtonData).highlightModifier}
                    onChange={(e) => handleHighlightModifierUpdate(e.target.value)}
                />
            </InputGroup>
            <InputGroup label={"Icon"}>
                <IconEditor
                    currentIcon={(component.data as HoloUIButtonData).icon}
                    onUpdate={handleIconUpdate}
                />
            </InputGroup>
            <InputGroup
                label={"Actions"}
            >
                <ActionList
                    actions={(component.data as HoloUIButtonData).actions}
                    setActions={(actions) => handleActionsUpdate(actions)}
                />
            </InputGroup>
        </div>
    );
}