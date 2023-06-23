import {useContent} from "@/hooks/ContentHook";
import {GiButtonFinger} from "react-icons/gi";
import {RxSwitch} from "react-icons/rx";
import {BsBoxes} from "react-icons/bs";
import styles from "@/styles/components/visual/ComponentList.module.scss";
import {BiFolderOpen} from "react-icons/bi";
import {conditionalClassNames} from "@/util/classes";
import {useEffect} from "react";
import {HoloUIData} from "@/util/types";

export default function ComponentList() {
    const {data, setData, selectedComponent, setSelectedComponent} = useContent();


    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (!selectedComponent) {
                return;
            }

            if (e.key === "Escape") {
                setSelectedComponent(undefined);
                return;
            }

            if (e.key !== "Delete") {
                return;
            }

            if (!confirm("Are you sure you want to delete this component?")) {
                return;
            }

            setData(currentData => {
                if (!currentData) {
                    return currentData;
                }

                return {
                    ...currentData,
                    components: currentData.components.filter(component => component.id !== selectedComponent)

                } as HoloUIData;
            });
            return;
        }

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [selectedComponent, setSelectedComponent, setData]);

    if (!data) {
        return (<></>);
    }

    return (
        <div className={styles.componentList}>
            <div className={styles.header}>
                <BiFolderOpen/>
                <h3>
                    Components
                </h3>
            </div>
            <div className={styles.components}>
                {
                    data.components.map((component, index) => {
                        const id = component.id;
                        const type = component.data.type;

                        return (
                            <div
                                key={id} className={conditionalClassNames({
                                [styles.component as string]: true,
                                [styles.selected as string]: selectedComponent === id,
                            })}
                                onClick={() => setSelectedComponent(id)}
                            >
                                {
                                    type === "button" ? (
                                        <GiButtonFinger/>
                                    ) : type === "toggle" ? (
                                        <RxSwitch/>
                                    ) : (
                                        <BsBoxes/>
                                    )
                                }
                                {
                                    // Max length of 10 characters (id)
                                    id.length > 10 ? (
                                        <span>{id.substring(0, 20)}...</span>
                                    ) : (
                                        <span>{id}</span>
                                    )
                                } ({type})
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}