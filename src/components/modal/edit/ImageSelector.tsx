import {useContent} from "@/hooks/ContentHook";
import {createRef, useEffect, useState} from "react";
import {BiCheck, BiMouse, BiPlus, BiTrash, BiX} from "react-icons/bi";
import Row from "@/components/grid/Row";
import Column from "@/components/grid/Column";
import styles from "@/styles/components/modal/edit/ImageSelector.module.scss";
import {joinedClassNames} from "@/util/classes";
import {ImageData} from "@/util/types";

interface ImageSelectorProps {

    currentImage: string;

    onUpdate: (image: string) => void;

    close: () => void;

}

export default function ImageSelector({currentImage, onUpdate, close}: ImageSelectorProps) {
    const {images, addImage, removeImage} = useContent();
    const uploadInputRef = createRef<HTMLInputElement>();
    const [currentImageId, setCurrentImageId] = useState<string | undefined>(currentImage);


    /**
     * Handle the image delete button being clicked
     *
     * @param image The image to delete
     */
    function handleDeleteImage(image: string) {
        if (!confirm("Are you sure you want to delete this image?")) {
            return;
        }

        removeImage(image);
    }

    useEffect(() => {
        const current = uploadInputRef.current;
        if (!current) {
            return;
        }

        current.addEventListener("change", (e) => {
            // Get the file
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) {
                return;
            }

            // Convert file to base64
            const reader = new FileReader();

            // Read the file
            reader.readAsDataURL(file);

            // Handle the file
            reader.onload = () => {
                // Clear the input (so the user can upload the same image again)
                if (current) {
                    current.value = "";
                }

                const result = reader.result;
                if (!result) {
                    alert("Something went wrong while uploading your image, please try again.");
                    return;
                }

                const id = file.name;
                const base64 = result.toString();
                const imageData: ImageData = {
                    id,
                    base64
                };

                // Add the image
                addImage(imageData);
            }
        });
    }, [uploadInputRef]);

    /**
     * Handle an image being selected
     *
     * @param id The ID of the image
     */
    function handleSelectImage(id: string) {
        if (currentImageId === id) {
            setCurrentImageId(undefined);
            onUpdate("");
            return;
        }

        console.log(`Selected image: ${id}`)

        setCurrentImageId(id);
        onUpdate(id);
    }

    return (
        <div className={styles.selector}>
            <div className={styles.header}>
                <span>
                    Select An Image
                </span>
                <div
                    onClick={close}
                >
                    <BiX/>
                </div>
            </div>
            <Row className={styles.images} start>
                {
                    images.map(image => (
                        <Column
                            className={styles.imageColumn}
                            key={image.id}
                            xs={24}
                            lg={8}
                        >
                            <div className={styles.image}>
                                <div className={styles.img}>
                                    <img
                                        src={image.base64}
                                        alt={image.id}
                                        onClick={() => setCurrentImageId(image.id)}
                                    />
                                </div>
                                <div className={styles.buttons}>
                                    <div
                                        className={styles.select}
                                        onClick={() => handleSelectImage(image.id)}
                                    >
                                        {
                                            currentImageId === image.id ? (
                                                <BiCheck/>
                                            ) : (
                                                <BiMouse/>
                                            )
                                        }
                                    </div>
                                    <div
                                        className={styles.delete}
                                        onClick={() => handleDeleteImage(image.id)}
                                    >
                                        <BiTrash/>
                                    </div>
                                </div>
                            </div>
                        </Column>
                    ))
                }
                <Column
                    className={styles.imageColumn}
                    xs={24}
                    lg={8}
                >
                    <div
                        className={styles.image}
                        onClick={() => uploadInputRef.current?.click()}
                    >
                        <div className={joinedClassNames([styles.img, styles.uploadButton])}>
                            <BiPlus/>
                            Upload Image
                        </div>
                    </div>
                </Column>
                <input
                    type={"file"}
                    accept={"image/*"}
                    ref={uploadInputRef}
                    hidden
                />
            </Row>
        </div>
    )
}