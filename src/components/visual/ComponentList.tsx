import {useContent} from "@/hooks/ContentHook";
import {GiButtonFinger} from "react-icons/gi";
import {RxSwitch} from "react-icons/rx";
import {BsBoxes} from "react-icons/bs";
import styles from "@/styles/components/visual/ComponentList.module.scss";
import {BiFolderOpen} from "react-icons/bi";
import {conditionalClassNames} from "@/util/classes";
import {useEffect} from "react";
import {
    HoloUIButtonData,
    HoloUIComponent,
    type HoloUIData,
    HoloUIDecorationData,
    HoloUIIcon,
    HoloUIItemIcon,
    HoloUITextIcon,
    HoloUITextImageIcon,
    HoloUIToggleData
} from "@/util/types";

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

    /**
     * Gets the display value of a component
     *
     * @param component The component to get the display value of
     */
    function getComponentDisplayValue(component: HoloUIComponent) {
        const componentData = component.data;
        if (component.data.type === "button") {
            const buttonData = componentData as HoloUIButtonData;
            const icon = buttonData.icon;

            return getIconDisplayValue(icon);
        }

        if (component.data.type === "toggle") {
            const toggleData = componentData as HoloUIToggleData;
            const trueIcon = toggleData.trueIcon;

            return getIconDisplayValue(trueIcon);
        }

        const decorationData = componentData as HoloUIDecorationData;
        const icon = decorationData.icon;

        return getIconDisplayValue(icon);
    }

    /**
     * Gets the display value of an icon
     *
     * @param icon The icon to get the display value of
     */
    function getIconDisplayValue(icon: HoloUIIcon) {
        if (icon.type === "text") {
            const textIcon = icon as HoloUITextIcon;

            return textIcon.text;
        }

        if (icon.type === "textImage") {
            const textImageIcon = icon as HoloUITextImageIcon;

            return textImageIcon.path;
        }

        const itemIcon = icon as HoloUIItemIcon;

        return itemIcon.item;
    }

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
                    data.components.map((component) => {
                        const id = component.id;
                        const type = component.data.type;
                        const value = getComponentDisplayValue(component);

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
                                    value.length > 10 ? (
                                        <span>{value.substring(0, 25)}...</span>
                                    ) : (
                                        <span>{value}</span>
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