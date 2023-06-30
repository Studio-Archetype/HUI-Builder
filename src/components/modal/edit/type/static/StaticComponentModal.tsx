import {
    type HoloUIComponent,
    type HoloUIDecorationData,
    HoloUIItemIcon,
    type HoloUITextIcon,
    HoloUITextImageIcon
} from "@/util/types";
import ComponentEditModal from "@/components/modal/edit/ComponentEditModal";
import StaticModalContent from "@/components/modal/edit/type/static/StaticModalContent";

const DEFAULT_COMPONENT: HoloUIComponent = {
    id: `${Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)}`,
    offset: [0, 0, 0],
    data: {
        type: 'decoration',
        icon: {
            type: 'text',
            text: '',
        } as HoloUITextIcon
    } as HoloUIDecorationData
}

interface StaticComponentModalProps {

    defaultValue?: HoloUIComponent;

    isCreate?: boolean;
}

export default function StaticComponentModal({
                                                 defaultValue = DEFAULT_COMPONENT,
                                                 isCreate = false
                                             }: StaticComponentModalProps) {
    function validateComponent(component: HoloUIComponent) {
        const data = component.data as HoloUIDecorationData;
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

        return undefined;
    }

    return (
        <ComponentEditModal
            defaultValue={defaultValue}
            isCreate={isCreate}
            validateComponent={validateComponent}
        >
            <StaticModalContent/>
        </ComponentEditModal>
    );
}