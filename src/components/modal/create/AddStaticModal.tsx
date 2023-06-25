"use client";

import {useState} from "react";
import styles from "@/styles/components/modal/AddStaticModal.module.scss";
import {BiPlus} from "react-icons/bi";
import {convertToIcon, type HoloUIComponent, type HoloUIDecorationData} from "@/util/types";
import {useContent} from "@/hooks/ContentHook";
import {useModal} from "@/hooks/ModalHook";
import IconEditor from "@/components/modal/create/IconEditor";
import {joinedClassNames} from "@/util/classes";

export default function AddStaticModal() {
    const [iconType, setIconType] = useState<'text' | 'image' | 'item'>('text');
    const [id, setId] = useState<string>(`${Math.floor(Math.random() * 1000000)}`);
    const [icon, setIcon] = useState<string>("");
    const {setData} = useContent();
    const {closeModal} = useModal();

    function handleCreateClick() {
        // Ensure that the value is not empty
        if (!icon || icon === "" || !id || id === "") {
            alert("Please fill in the value field");
            return;
        }

        const component: HoloUIComponent = {
            id: id,
            offset: [0, 0, 0],
            data: {
                type: 'decoration',
                icon: convertToIcon(iconType, icon)
            } as HoloUIDecorationData
        };

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

        closeModal();
    }

    return (
        <div className={styles.content}>
            <div>
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
                <IconEditor
                    label={"Button Type"}
                    iconType={iconType}
                    setIconType={setIconType}
                    icon={icon}
                    setIcon={setIcon}
                />
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