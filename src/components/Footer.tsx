"use client";

import styles from "@/styles/components/Footer.module.scss";
import {useContent} from "@/hooks/ContentHook";
import {ContentType} from "@/util/types";
import {useCodeEditor} from "@/hooks/CodeEditorHook";

export default function Footer() {
    const {contentType} = useContent();
    const {cursorData, error} = useCodeEditor();

    return (
        <footer className={styles.footer}>
            <p>
                Changes are automatically saved to your browser's local storage.
            </p>
            {
                (contentType === ContentType.CODE_EDITOR && cursorData !== undefined) && (
                    <p>
                        JSON | <span>{cursorData.line}:{cursorData.character}</span>
                    </p>
                )
            }
            {
                (contentType === ContentType.CODE_EDITOR && error !== undefined) && (
                    <div className={styles.error}>
                        <span>{error}</span>
                    </div>
                )
            }
        </footer>
    )
}