"use client";

import {useState} from "react";
import {joinedClassNames} from "@/util/classes";
import styles from "@/styles/components/modal/AddStaticModal.module.scss";
import {BiPlus} from "react-icons/bi";
import {useContent} from "@/hooks/ContentHook";
import {useModal} from "@/hooks/ModalHook";

export default function AddToggleModal() {
    const [id, setId] = useState<string>(`${Math.floor(Math.random() * 1000000)}`);
    const {setData} = useContent();
    const {setModal} = useModal();

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
            </div>
            <div
                className={styles.createButton}
                // onClick={handleCreateClick}
            >
                <button>
                    <BiPlus/>
                    Create Component
                </button>
            </div>
        </div>
    );
}