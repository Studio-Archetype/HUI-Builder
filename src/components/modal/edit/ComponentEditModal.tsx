import {type HoloUIComponent} from "@/util/types";
import {createContext, type Dispatch, type ReactNode, type SetStateAction, useContext, useState} from "react";
import {BiPlus, BiSave} from "react-icons/bi";
import {useContent} from "@/hooks/ContentHook";
import {useModal} from "@/hooks/ModalHook";
import styles from "@/styles/components/modal/edit/ComponentEditModal.module.scss";

interface ComponentEditModalProps {

    defaultValue: HoloUIComponent;

    isCreate?: boolean;

    validateComponent: (component: HoloUIComponent) => undefined | string;

    children: ReactNode;

}

interface ComponentEditModalState {

    component: HoloUIComponent;

    setComponent: Dispatch<SetStateAction<HoloUIComponent>>;

}

const ComponentEditModalContext = createContext<ComponentEditModalState | null>(null);

export default function ComponentEditModal({
                                               defaultValue,
                                               isCreate = false,
                                               children,
                                               validateComponent
                                           }: ComponentEditModalProps) {
    const originalID = defaultValue.id;
    const [component, setComponent] = useState<HoloUIComponent>(defaultValue);
    const {setData, data: currentData} = useContent();
    const {closeModal} = useModal();

    /**
     * Handle the save button being clicked
     */
    function handleSave() {
        console.log(`Saving component: ${JSON.stringify(component)}`);
        // Ensure the ID is not empty
        if (component.id === '') {
            alert('Component ID cannot be empty!');
            return;
        }

        // Ensure the ID is not already taken
        if (currentData?.components.find((comp) => comp.id === component.id) && isCreate) {
            alert('Component with ID already exists!');
            return;
        }

        // Validate the component using the provided function
        const validate = validateComponent(component);
        if (validate) {
            alert(validate);
            return;
        }

        setData((prevState) => {
            if (!prevState) {
                return prevState;
            }

            // Remove the old component
            prevState.components = prevState.components.filter((comp) => comp.id !== originalID);

            // Add the new component
            return {
                ...prevState,
                components: [
                    ...prevState.components,
                    component
                ]
            };
        });
        closeModal();
    }

    return (
        <ComponentEditModalContext.Provider value={{component, setComponent}}>
            <div className={styles.editModal}>
                <div className={styles.content}>
                    {
                        children
                    }
                </div>
                <div onClick={handleSave} className={styles.saveButton}>
                    {
                        isCreate ? (
                            <>
                                <BiPlus/>
                                Create Component
                            </>
                        ) : (
                            <>
                                <BiSave/>
                                Save Changes
                            </>
                        )
                    }
                </div>
            </div>
        </ComponentEditModalContext.Provider>
    );
}

export function useComponentEditModal() {
    const context = useContext(ComponentEditModalContext);
    if (context === null) {
        throw new Error("useComponentEditModal must be used within a ComponentEditModalProvider");
    }

    return context;
}