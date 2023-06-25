import Row from "@/components/grid/Row";
import Column from "@/components/grid/Column";
import styles from "@/styles/components/visual/VisualButtons.module.scss";
import {type ModalData} from "@/util/types";
import AddStaticModal from "@/components/modal/create/AddStaticModal";
import {useModal} from "@/hooks/ModalHook";
import AddButtonModal from "@/components/modal/create/AddButtonModal";
import AddToggleModal from "@/components/modal/create/AddToggleModal";

const addStaticModal: ModalData = {
    title: "Add Static Component",
    content: <AddStaticModal/>,
};
const addButtonModal: ModalData = {
    title: "Add Button Component",
    content: <AddButtonModal/>,
};
const addToggleModal: ModalData = {
    title: "Add Toggle Component",
    content: <AddToggleModal/>,
}

export default function VisualButtons() {
    const {setModal} = useModal();

    return (
        <div className={styles.visualButtons}>
            <Row>
                <Column xs={24}>
                    <div className={styles.header}>
                        <h2>
                            Add a Component
                        </h2>
                    </div>
                </Column>
                <Column
                    xs={24}
                    lg={8}
                >
                    <div
                        className={styles.button}
                        onClick={() => setModal(addStaticModal)}
                    >
                        <h3>
                            Static
                        </h3>
                    </div>
                </Column>
                <Column
                    xs={24}
                    lg={8}
                >
                    <div
                        className={styles.button}
                        onClick={() => setModal(addButtonModal)}
                    >
                        <h3>
                            Button
                        </h3>
                    </div>
                </Column>
                <Column
                    xs={24}
                    lg={8}
                >
                    <div
                        className={styles.button}
                        onClick={() => setModal(addToggleModal)}
                    >
                        <h3>
                            Toggle
                        </h3>
                    </div>
                </Column>
            </Row>
        </div>
    )
}