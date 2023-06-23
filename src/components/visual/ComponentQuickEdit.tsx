import {useContent} from "@/hooks/ContentHook";
import Row from "@/components/grid/Row";
import Column from "@/components/grid/Column";
import styles from "@/styles/components/visual/ComponentQuickEdit.module.scss";
import {HoloUIComponent, HoloUIData} from "@/util/types";
import {useEffect, useState} from "react";

export default function ComponentQuickEdit() {
    const {selectedComponent, setSelectedComponent, data, setData} = useContent();
    const [component, setComponent] = useState<HoloUIComponent | undefined>(undefined);
    useEffect(() => {
        if (!data || !selectedComponent) {
            return;
        }

        const component = data.components.find(component => component.id === selectedComponent);
        if (!component) {
            return;
        }

        setComponent(component);
    }, [selectedComponent]);

    if (!selectedComponent || !data || !component) {
        return (<></>);
    }

    function handleIDChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (!data || !component) {
            return;
        }

        const newID = e.target.value;
        if (newID === component.id || newID === "") {
            e.preventDefault();
            return;
        }

        if (data.components.find(component => component.id === newID)) {
            alert("Component ID already exists!");
            return;
        }

        setData(currentData => {
            if (!currentData) {
                return currentData;
            }

            return {
                ...currentData,
                components: currentData.components.map(component => {
                    if (component.id !== selectedComponent) {
                        return component;
                    }

                    return {
                        ...component,
                        id: newID
                    };
                })
            } as HoloUIData;
        });

        // Set new selected component to the new ID
        setSelectedComponent(newID);
    }

    function handleOffsetChange(e: React.ChangeEvent<HTMLInputElement>, index: number) {
        if (!data || !component) {
            return;
        }

        const newOffsetNumber = Number(e.target.value);
        if (newOffsetNumber === component.offset[index]) {
            return;
        }

        const newOffset = [...component.offset];

        // Set the new offset
        newOffset[index] = newOffsetNumber;

        // Update the data
        setData(currentData => {
            if (!currentData) {
                return currentData;
            }

            return {
                ...currentData,
                components: currentData.components.map(component => {
                    if (component.id !== selectedComponent) {
                        return component;
                    }

                    return {
                        ...component,
                        offset: newOffset
                    };
                })
            } as HoloUIData;
        });
    }

    return (
        <div className={styles.content}>
            <Row>
                <Column
                    xs={24}
                >
                    <div className={styles.inputGroup}>
                        <label htmlFor="component-id">
                            ID
                        </label>
                        <input
                            id="component-id"
                            name="component-id"
                            type="text"
                            defaultValue={component.id}
                            onBlur={handleIDChange}
                        />
                    </div>
                </Column>
                <Column
                    xs={24}
                    lg={8}
                >

                    <div className={styles.inputGroup}>
                        <label htmlFor="component-x">
                            X
                        </label>
                        <input
                            id="component-x"
                            name="component-x"
                            type="number"
                            step={0.1}
                            defaultValue={component.offset[0]}
                            onBlur={(e) => handleOffsetChange(e, 0)}
                        />
                    </div>
                </Column>
                <Column
                    xs={24}
                    lg={8}
                >

                    <div className={styles.inputGroup}>
                        <label htmlFor="component-y">
                            Y
                        </label>
                        <input
                            id="component-y"
                            name="component-y"
                            type="number"
                            step={0.1}
                            defaultValue={component.offset[1]}
                            onBlur={(e) => handleOffsetChange(e, 1)}
                        />
                    </div>
                </Column>
                <Column
                    xs={24}
                    lg={8}
                >
                    <div className={styles.inputGroup}>
                        <label htmlFor="component-z">
                            X
                        </label>
                        <input
                            id="component-z"
                            name="component-z"
                            type="number"
                            step={0.1}
                            defaultValue={component.offset[2]}
                            onBlur={(e) => handleOffsetChange(e, 2)}
                        />
                    </div>
                </Column>
            </Row>
        </div>
    )
}