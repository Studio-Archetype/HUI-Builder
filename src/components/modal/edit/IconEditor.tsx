import {
    type HoloUIIcon,
    type HoloUIItemIcon,
    type HoloUITextIcon,
    type HoloUITextImageIcon,
    MCItem
} from "@/util/types";
import {useEffect, useState} from "react";
import {LuTextCursor} from "react-icons/lu";
import {FaAppleAlt} from "react-icons/fa";
import {BsCardImage} from "react-icons/bs";
import {useSettings} from "@/hooks/SettingsHook";
import styles from "@/styles/components/modal/edit/IconEditor.module.scss";
import ImageSelector from "@/components/modal/edit/ImageSelector";

const DEFAULT_TEXT_ICON: HoloUITextIcon = {
    type: 'text',
    text: '',
};
const DEFAULT_ITEM_ICON: HoloUIItemIcon = {
    type: 'item',
    item: '',
    count: 1,
    customModelData: 0,
};
const DEFAULT_IMAGE_ICON: HoloUITextImageIcon = {
    type: 'textImage',
    path: '',
};

interface IconEditorProps {

    currentIcon: HoloUIIcon;

    onUpdate: (icon: HoloUIIcon) => void;

}

export default function IconEditor({currentIcon, onUpdate}: IconEditorProps) {
    const [icon, setIcon] = useState<HoloUIIcon>(currentIcon);
    const [selectingImage, setSelectingImage] = useState(false);
    const {items} = useSettings();

    /**
     * Switches the icon type.
     */
    function switchIconType() {
        if (icon.type === 'text') {
            setIcon(DEFAULT_ITEM_ICON);
            return;
        }

        if (icon.type === 'item') {
            setIcon(DEFAULT_IMAGE_ICON);
            return;
        }

        setIcon(DEFAULT_TEXT_ICON);
    }

    /**
     * Called when the value of the icon changes.
     *
     * @param value
     */
    function onValueChange(value: string | undefined) {
        if (value === undefined || value === '') {
            alert(`Please enter a value for the icon(s).`);
            return;
        }

        if (icon.type === 'text') {
            setIcon({
                type: 'text',
                text: value,
            } as HoloUITextIcon)
            return;
        }

        if (icon.type === 'item') {
            const mcItem = items.find((item: MCItem) => item.name === value);
            if (mcItem === undefined || !mcItem.texture) {
                alert(`The item ${value} does not exist.`);
                return;
            }

            setIcon({
                type: 'item',
                item: mcItem.texture,
                count: 1,
                customModelData: 0,
            } as HoloUIItemIcon);
            return;
        }

        setIcon({
            type: 'textImage',
            path: value,
        } as HoloUITextImageIcon);
        setSelectingImage(false);
    }

    // Update the icon when the current icon changes.
    useEffect(() => {
        onUpdate(icon);
    }, [icon]);

    return (
        <div className={styles.iconEditor}>
            <div className={styles.editable}>
                <div
                    className={styles.iconType}
                    onClick={switchIconType}
                    data-label={
                        icon.type === 'text' ? (
                            'Text'
                        ) : icon.type === 'item' ? (
                            'Item'
                        ) : (
                            'Image'
                        )
                    }
                >
                    {
                        icon.type === 'text' ? (
                            <LuTextCursor/>
                        ) : icon.type === 'item' ? (
                            <FaAppleAlt/>
                        ) : (
                            <BsCardImage/>
                        )
                    }
                </div>
                <div className={styles.inputs}>
                    {
                        icon.type === 'text' ? (
                            <input
                                type={'text'}
                                defaultValue={(icon as HoloUITextIcon).text}
                                onBlur={(e) => onValueChange(e.target.value)}
                            />
                        ) : icon.type === 'item' ? (
                            <input
                                type={'text'}
                                defaultValue={(icon as HoloUIItemIcon).item}
                                onBlur={(e) => onValueChange(e.target.value)}
                                list={'item-list'}
                            />
                        ) : (
                            <button
                                onClick={() => setSelectingImage(true)}
                            >
                                Select Image (Current: {(icon as HoloUITextImageIcon).path})
                            </button>
                        )
                    }
                </div>
            </div>
            {
                (selectingImage && icon.type === 'textImage') && (
                    <ImageSelector
                        currentImage={(icon as HoloUITextImageIcon).path}
                        onUpdate={onValueChange}
                        close={() => setSelectingImage(false)}
                    />
                )
            }
            <datalist id={'item-list'}>
                {
                    items
                        .filter((item: MCItem) => item.texture !== undefined)
                        .map((item: MCItem) => (
                            <option
                                key={item.name}
                                value={item.name}
                            >
                                {item.name}
                            </option>
                        ))
                }
            </datalist>
        </div>
    )
}