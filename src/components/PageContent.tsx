"use client";

import {useContent} from "@/hooks/ContentHook";
import {ContentType} from "@/util/types";
import styles from "@/styles/components/PageContent.module.scss";
import CodeEditor from "@/components/content/CodeEditor";
import VisualEditor from "@/components/content/VisualEditor";

export default function PageContent() {
    const {contentType} = useContent();

    return (
        <div className={styles.content}>
            {
                contentType === ContentType.CODE_EDITOR ? (
                    <CodeEditor/>
                ) : (
                    <VisualEditor/>
                )
            }
        </div>
    );
}