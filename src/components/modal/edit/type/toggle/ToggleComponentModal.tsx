import {
    HoloUICommandAction,
    type HoloUIComponent,
    HoloUIItemIcon,
    HoloUISoundAction,
    type HoloUITextIcon,
    HoloUITextImageIcon,
    type HoloUIToggleData
} from "@/util/types";
import ComponentEditModal from "@/components/modal/edit/ComponentEditModal";
import ToggleModalContent from "@/components/modal/edit/type/toggle/ToggleModalContent";

const DEFAULT_COMPONENT: HoloUIComponent = {
    id: `${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}`,
    offset: [0, 0, 0],
    data: {
        type: 'toggle',
        highlightModifier: 0,
        condition: '',
        expectedValue: '',
        trueIcon: {
            type: 'text',
            text: '',
        } as HoloUITextIcon,
        trueActions: [],
        falseIcon: {
            type: 'text',
            text: '',
        },
        falseActions: [],
    } as HoloUIToggleData
}

interface ToggleComponentModalProps {

    defaultValue?: HoloUIComponent;

    isCreate?: boolean;
}

export default function ToggleComponentModal({
                                                 defaultValue = DEFAULT_COMPONENT,
                                                 isCreate = false
                                             }: ToggleComponentModalProps) {
    function validateComponent(component: HoloUIComponent) {
        const data = component.data as HoloUIToggleData;
        if (!data.condition || data.condition === '') {
            return 'Please fill in the condition!';
        }

        if (!data.expectedValue || data.expectedValue === '') {
            return 'Please fill in the expected value!';
        }

        const icons = [data.trueIcon, data.falseIcon];
        for (const icon of icons) {
            if (icon.type === 'text' && (icon as HoloUITextIcon).text === '') {
                return 'Please fill in the icon text!';
            }

            if (icon.type === 'item' && (icon as HoloUIItemIcon).item === '') {
                return 'Please fill in the item ID!';
            }

            if (icon.type === 'textImage' && (icon as HoloUITextImageIcon).path === '') {
                return 'Please select an image!';
            }
        }

        if (data.trueActions.length === 0) {
            return 'Please add at least one true action!';
        }

        if (data.falseActions.length === 0) {
            return 'Please add at least one false action!';
        }

        const allActions = [...data.trueActions, ...data.falseActions];

        // Validate actions
        for (const action of allActions) {
            const type = action.type;
            if (type === "command") {
                const commandAction = action as HoloUICommandAction;
                if (commandAction.command === "") {
                    return 'Please fill in the command!';
                }

                continue;
            }

            if (type === "sound") {
                const soundAction = action as HoloUISoundAction;
                if (soundAction.sound === "") {
                    return 'Please fill in the sound!';
                }

                continue;
            }
        }

        return undefined;
    }

    return (
        <ComponentEditModal
            defaultValue={defaultValue}
            isCreate={isCreate}
            validateComponent={validateComponent}
        >
            <ToggleModalContent/>
        </ComponentEditModal>
    );
}