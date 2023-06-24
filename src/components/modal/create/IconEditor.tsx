import {Dispatch, SetStateAction, useState} from "react";
import Row from "@/components/grid/Row";
import Column from "@/components/grid/Column";
import {useSettings} from "@/hooks/SettingsHook";
import {capitalizeAll} from "@/util/strings";
import {conditionalClassNames} from "@/util/classes";
import ImageSelector from "@/components/modal/create/ImageSelector";
import styles from "@/styles/components/modal/create/IconEditor.module.scss";

interface IconEditorProps {

    label: string;

    iconType: 'text' | 'image' | 'item';

    setIconType: Dispatch<SetStateAction<'text' | 'image' | 'item'>>;

    icon: string;

    setIcon: Dispatch<SetStateAction<string>>;

}

export default function IconEditor({label, iconType, setIconType, icon, setIcon}: IconEditorProps) {
    const [imageSelectorModal, setImageSelectorModal] = useState<boolean>(false);
    const {items} = useSettings();

    return (
        <>
            <Row>
                <Column
                    xs={24}
                    lg={12}
                >
                    <div className={styles.typeSelector}>
                        <span>{label}</span>
                        <div className={styles.types}>
                            <div
                                className={conditionalClassNames({
                                    [styles.type as string]: true,
                                    [styles.selected as string]: iconType === 'text',
                                })}
                                onClick={() => setIconType('text')}
                            >
                                Text
                            </div>
                            <div
                                className={conditionalClassNames({
                                    [styles.type as string]: true,
                                    [styles.selected as string]: iconType === 'image',
                                })}
                                onClick={() => setIconType('image')}
                            >
                                Image
                            </div>
                            <div
                                className={conditionalClassNames({
                                    [styles.type as string]: true,
                                    [styles.selected as string]: iconType === 'item',
                                })}
                                onClick={() => setIconType('item')}
                            >
                                Item
                            </div>
                        </div>
                    </div>
                </Column>
                <Column
                    xs={24}
                    lg={12}
                >
                    <div className={styles.inputFields}>
                        {
                            iconType === 'text' && (
                                <>
                                    <label>Text</label>
                                    <input
                                        type="text"
                                        onBlur={(event) => setIcon(event.target.value)}
                                    />
                                </>
                            )
                        }
                        {
                            iconType === 'item' && (
                                <>
                                    <label>Item</label>
                                    <select
                                        onChange={(event) => setIcon(event.target.value)}
                                    >
                                        {
                                            items.map((item) => (
                                                <option key={item.name} value={item.name}>
                                                    {capitalizeAll(item.name)}
                                                </option>
                                            ))
                                        }
                                    </select>
                                </>
                            )
                        }
                        {
                            iconType === 'image' && (
                                <>
                                    <button
                                        onClick={() => setImageSelectorModal(true)}
                                    >
                                        Choose Image
                                    </button>
                                </>
                            )
                        }
                    </div>
                </Column>
            </Row>
            <div className={conditionalClassNames({
                [styles.imageSelectorModal as string]: true,
                [styles.open as string]: imageSelectorModal,
            })}>
                <div className={styles.header}>
                    <span>Select Image</span>
                    <button
                        onClick={() => setImageSelectorModal(false)}
                    >
                        Close
                    </button>
                </div>
                <div className={styles.body}>
                    <ImageSelector
                        currentImage={icon}
                        onImageChange={(image) => setIcon(image ?? "")}
                    />
                </div>
            </div>
        </>
    )
}