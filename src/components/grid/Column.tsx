import {Breakpoint, type BreakpointData} from "@/util/types";
import {type HTMLAttributes, type ReactNode} from "react";

import styles from '@/styles/components/grid/Column.module.scss';
import {joinedClassNames} from "@/util/classes";

interface ColumnProps extends BreakpointData<number>, HTMLAttributes<HTMLDivElement> {

    children?: ReactNode;

    noPadding?: boolean;

    debug?: boolean;

}

export default function Column({children, noPadding = false, debug = false, ...props}: ColumnProps) {
    const classNameArray = [styles.column, props.className];

    // Remove the breakpoint props from the props object
    for (const key of Object.keys(props)) {
        // Check if the key is a key of the BreakpointData interface
        if (!Object.keys(Breakpoint).includes(key)) {
            continue;
        }

        const value = props[key as keyof BreakpointData<number>];
        // Check if the value is not undefined
        if (!value) {
            continue;
        }

        // Add <key>-<value> to the utils array
        classNameArray.push(styles[`${key}-${value}`]);
        // Remove the key from the props object
        delete props[key as keyof BreakpointData<number>]
    }


    if (noPadding) {
        classNameArray.push(styles.noPadding);
    }

    if (debug) {
        classNameArray.push(styles.debug);
    }

    return (
        <div
            {...props}
            className={joinedClassNames(classNameArray)}
        >
            {children}
        </div>
    );
}