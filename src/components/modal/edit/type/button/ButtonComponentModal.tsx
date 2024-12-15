import {
    type HoloUIButtonData,
    type HoloUICommandAction,
    type HoloUIComponent,
    type HoloUIItemIcon,
    type HoloUISoundAction,
    type HoloUITextIcon,
    type HoloUITextImageIcon
} from "@/util/types";
import ComponentEditModal from "@/components/modal/edit/ComponentEditModal";
import ButtonModalContent from "@/components/modal/edit/type/button/ButtonModalContent";

const DEFAULT_COMPONENT: HoloUIComponent = {
    id: `${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}`,
    offset: [0, 0, 0],
    data: {
        type: 'button',
        icon: {
            type: 'text',
            text: '',
        } as HoloUITextIcon,
        highlightModifier: 0,
        actions: [],
    } as HoloUIButtonData
}

interface ButtonComponentModalProps {

    defaultValue?: HoloUIComponent;

    isCreate?: boolean;
}

export default function ButtonComponentModal({
                                                 defaultValue = DEFAULT_COMPONENT,
                                                 isCreate = false
                                             }: ButtonComponentModalProps) {
    function validateComponent(component: HoloUIComponent) {
        const data = component.data as HoloUIButtonData;
        const icon = data.icon;
        if (icon.type === 'text' && (icon as HoloUITextIcon).text === '') {
            return 'Please fill in the icon text!';
        }

        if (icon.type === 'item' && (icon as HoloUIItemIcon).item === '') {
            return 'Please fill in the item ID!';
        }

        if (icon.type === 'textImage' && (icon as HoloUITextImageIcon).path === '') {
            return 'Please select an image!';
        }

        if (data.actions.length === 0) {
            return 'Please add at least one action!';
        }

        // Validate actions
        for (const action of data.actions) {
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
            <ButtonModalContent/>
        </ComponentEditModal>
    );
}