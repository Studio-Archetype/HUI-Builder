import {type ReactNode} from "react";
import styles from "@/styles/components/form/InputGroup.module.scss";

interface InputGroupProps {

    label: string;

    children: ReactNode;

}

export default function InputGroup({label, children}: InputGroupProps) {
    return (
        <div className={styles.inputGroup}>
            <div className={styles.label}>
                {label}
            </div>
            {children}
        </div>
    );
}