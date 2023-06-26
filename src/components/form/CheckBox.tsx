import {type DetailedHTMLProps, type HTMLAttributes, useEffect, useState} from "react";
import {conditionalClassNames} from "@/util/classes";
import styles from "@/styles/components/form/CheckBox.module.scss";
import {BsCheckLg} from "react-icons/bs";

interface CheckBoxProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {

    change?: (checked: boolean) => void;

    children?: JSX.Element | JSX.Element[];

}

export default function CheckBox({change, children, ...props}: CheckBoxProps) {
    const [checked, setChecked] = useState(props.defaultChecked ?? false);

    useEffect(() => {
        if (!change) {
            return;
        }

        change(checked);
    }, [change, checked]);

    return (
        <div
            {...props}
            onClick={() => setChecked(prevChecked => !prevChecked)}
            className={styles.checkBoxContainer}
        >
            <div className={styles.content}>
                <div
                    className={conditionalClassNames({
                        [styles.checkBox as string]: true,
                        [styles.checked as string]: checked,
                    })}
                >
                    {
                        checked && (
                            <BsCheckLg/>
                        )
                    }
                </div>
                <div className={styles.children}>
                    {children}
                </div>
            </div>
        </div>
    )
}