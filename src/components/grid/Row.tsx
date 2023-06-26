import {type HTMLAttributes, type ReactNode} from "react";
import styles from "@/styles/components/grid/Row.module.scss";
import {conditionalClassNames} from "@/util/classes";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;

    start?: boolean;

    end?: boolean;

    center?: boolean;

    between?: boolean;

    gap?: boolean;

    debug?: boolean;
}

export default function Row({
                                children,
                                start = false,
                                end = false,
                                center = false,
                                between = false,
                                gap = false,
                                debug = false,
                                ...props
                            }: ContainerProps) {
    const classNames = conditionalClassNames({
        [styles.row as string]: true,
        [styles.start as string]: start,
        [styles.end as string]: end,
        [styles.center as string]: center,
        [styles.between as string]: between,
        [styles.gap as string]: gap,
        [styles.debug as string]: debug,
        [props.className as string]: props.className !== undefined,
    });

    return (
        <div
            {...props}
            className={classNames}
        >
            {children}
        </div>
    );
}