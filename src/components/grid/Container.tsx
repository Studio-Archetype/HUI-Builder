import {type HTMLAttributes, type ReactNode} from "react";
import styles from "@/styles/components/grid/Container.module.scss";
import {conditionalClassNames} from "@/util/classes";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {

    fluid?: boolean;

    debug?: boolean;

    children: ReactNode;

}

export default function Container({fluid = false, debug = false, children, ...props}: ContainerProps) {
    const classNames = conditionalClassNames({
        [styles.container as string]: true,
        [styles.fluid as string]: fluid,
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