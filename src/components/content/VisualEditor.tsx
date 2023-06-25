import VisualButtons from "@/components/visual/VisualButtons";
import VisualCanvas from "@/components/visual/VisualCanvas";
import styles from "@/styles/components/content/VisualEditor.module.scss";
import ComponentList from "@/components/visual/ComponentList";
import ComponentQuickEdit from "@/components/visual/ComponentQuickEdit";

export default function VisualEditor() {
    return (
        <div className={styles.visualEditor}>
            <div className={styles.mainEditor}>
                <VisualCanvas/>
                <VisualButtons/>
            </div>
            <div className={styles.sideEditor}>
                <ComponentList/>
                <ComponentQuickEdit/>
            </div>
        </div>
    )
}