"use client";

import {useState} from "react";
import {conditionalClassNames, joinedClassNames} from "@/util/classes";
import styles from "@/styles/components/modal/AddStaticModal.module.scss";
import {BiPlus} from "react-icons/bi";
import {useSettings} from "@/hooks/SettingsHook";
import {capitalizeAll} from "@/util/strings";
import ImageSelector from "@/components/modal/create/ImageSelector";
import {HoloUIComponent, HoloUIDecorationData, HoloUIItemIcon, HoloUITextIcon, HoloUITextImageIcon} from "@/util/types";
import {useContent} from "@/hooks/ContentHook";
import {useModal} from "@/hooks/ModalHook";

export default function AddStaticModal() {
    const [type, setType] = useState<'text' | 'image' | 'item'>('text');
    const [id, setId] = useState<string>(`${Math.floor(Math.random() * 1000000)}`);
    const [value, setValue] = useState<string>("");
    const {items} = useSettings();
    const {setData} = useContent();
    const {setModal} = useModal();

    function handleCreateClick() {
        // Ensure that the value is not empty
        if (!value || value === "" || !id || id === "") {
            alert("Please fill in the value field");
            return;
        }

        let component: HoloUIComponent = {
            id: id,
            offset: [0, 0, 0],
            data: {
                type: 'decoration'
            }
        };

        if (type === 'text') {
            const icon: HoloUITextIcon = {
                type: 'text',
                text: value,
            };

            component.data = {
                ...component.data,
                icon: icon
            } as HoloUIDecorationData;
        } else if (type === 'image') {
            const icon: HoloUITextImageIcon = {
                type: 'textImage',
                path: value,
            };

            component.data = {
                ...component.data,
                icon: icon
            } as HoloUIDecorationData;
        } else if (type === 'item') {
            const icon: HoloUIItemIcon = {
                type: 'item',
                item: value,
                count: 1,
                customModelData: 0
            };

            component.data = {
                ...component.data,
                icon: icon
            } as HoloUIDecorationData;
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
            }
        });

        setModal(undefined);
    }

    return (
        <div className={styles.content}>
            <div>
                <div className={joinedClassNames([styles.option, styles.column])}>
                <span>
                    Component Type
                </span>
                    <div className={styles.typeSelector}>
                        <div
                            className={conditionalClassNames({
                                [styles.type as string]: true,
                                [styles.selected as string]: type === 'text',
                            })}
                            onClick={() => setType('text')}
                        >
                            Text
                        </div>
                        <div
                            className={conditionalClassNames({
                                [styles.type as string]: true,
                                [styles.selected as string]: type === 'image',
                            })}
                            onClick={() => setType('image')}
                        >
                            Image
                        </div>
                        <div
                            className={conditionalClassNames({
                                [styles.type as string]: true,
                                [styles.selected as string]: type === 'item',
                            })}
                            onClick={() => setType('item')}
                        >
                            Item
                        </div>
                    </div>
                </div>
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
                {
                    type === 'text' && (
                        <div className={joinedClassNames([styles.option, styles.column])}>
                            <span>
                                Text
                            </span>
                            <input
                                type="text"
                                onBlur={(event) => setValue(event.target.value)}
                            />
                        </div>
                    )
                }
                {
                    type === 'item' && (
                        <div className={joinedClassNames([styles.option, styles.column])}>
                            <span>
                                Item
                            </span>
                            <select
                                onChange={(event) => setValue(event.target.value)}
                            >
                                {
                                    items.map((item) => (
                                        <option key={item.name} value={item.name}>
                                            {capitalizeAll(item.name)}
                                        </option>
                                    ))
                                }
                            </select>
                        </div>
                    )
                }
                {
                    type === 'image' && (
                        <div className={styles.images}>
                            <span>
                                Image
                            </span>
                            <div className={styles.imageSelector}>
                                <ImageSelector currentImage={value} onImageChange={image => setValue(image ?? "")}/>
                            </div>
                        </div>
                    )
                }
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