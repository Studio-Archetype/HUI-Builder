"use client";

import {createContext, type ReactNode, useContext, useEffect, useState} from "react";
import {BiX} from "react-icons/bi";
import styles from "@/styles/hooks/ModalHook.module.scss";
import {conditionalClassNames} from "@/util/classes";
import {type ModalData} from "@/util/types";

interface ModalProviderProps {

    children: ReactNode;

}

export type ModalContextType = {

    modal: ModalData | undefined;

    setModal: (modal: ModalData | undefined) => void;

    closeModal: () => void;

}

// Create a hooks for the modal
const ModalContext = createContext<ModalContextType | null>(null);

// Provider component for the modal
export function ModalProvider({children}: ModalProviderProps) {
    const [modal, setModal] = useState<ModalData | undefined>();
    const [isClosing, setIsClosing] = useState(false);

    function handleCloseClick() {
        if (modal?.onClose && !modal?.onClose()) {
            return;
        }

        // Close the modal
        setModal(undefined);
        setIsClosing(true);

        setTimeout(() => {
            setIsClosing(false);
        }, 150);
    }

    // Add event listeners
    useEffect(() => {
        /**
         * Handles the keydown event for the modal
         */
        function handleKeyDown(event: KeyboardEvent) {
            if (!modal || event.key !== "Escape") {
                return;
            }

            handleCloseClick();
        }

        if (!modal) {
            return;
        }

        document.body.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.removeEventListener("keydown", handleKeyDown);
        }
    });

    return (
        <ModalContext.Provider value={{
            modal,
            setModal,
            closeModal: handleCloseClick,
        }}>
            <div
                className={conditionalClassNames({
                    [styles.modal as string]: true,
                    [styles.open as string]: modal !== undefined,
                    [styles.close as string]: isClosing,
                })}
                {
                    ...(modal === undefined && !isClosing ? {
                        style: {
                            display: "none",
                        }
                    } : {})
                }
            >
                <div className={styles.modalContent}>
                    <div className={styles.header}>
                        <h3>{modal?.title}</h3>
                        <div className={styles.closeButton} onClick={handleCloseClick}>
                            <BiX/>
                        </div>
                    </div>
                    <div className={styles.body}>
                        {modal?.content}
                    </div>
                    {
                        (modal && modal.footer) && (
                            <div className={styles.footer}>
                                {modal.footer}
                            </div>
                        )
                    }
                </div>
            </div>
            {children}
        </ModalContext.Provider>
    );
}

// Custom hook that shorthands the context!
export function useModal() {
    const context = useContext(ModalContext);
    if (context === null) {
        throw new Error("useModal must be used within a ModalProvider");
    }

    return context;
}