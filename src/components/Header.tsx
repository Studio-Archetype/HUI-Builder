import styles from "@/styles/components/Header.module.scss";
import Image from "next/image";

export default function Header() {
    return (
        <header className={styles.header}>
            <a className={styles.brand} href="https://studioarchetype.net/" target={"_blank"}>
                <div className={styles.brandImage}>
                    <Image
                        src={"/HUI-Builder/logo.svg"}
                        alt={"StudioArchetype Logo"}
                        fill
                    />
                </div>
                <div className={styles.brandName}>
                    <h1>
                        <span>Studio</span>Archetype
                    </h1>
                </div>
            </a>
        </header>
    );
}