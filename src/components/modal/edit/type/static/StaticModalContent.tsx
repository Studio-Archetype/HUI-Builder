import {type HoloUIDecorationData, HoloUIIcon} from "@/util/types";
import {useComponentEditModal} from "@/components/modal/edit/ComponentEditModal";
import IconEditor from "@/components/modal/edit/IconEditor";
import InputGroup from "@/components/form/InputGroup";

export default function StaticModalContent() {
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
                label={"Icon"}
            >
                <IconEditor
                    currentIcon={(component.data as HoloUIDecorationData).icon}
                    onUpdate={handleIconUpdate}
                />
            </InputGroup>
        </div>
    );
}