import Row from "@/components/grid/Row";
import Column from "@/components/grid/Column";
import {BiCheck, BiMouse, BiPlus, BiTrash} from "react-icons/bi";
import {createRef, useEffect} from "react";
import {type ImageData} from "@/util/types";
import styles from "@/styles/components/modal/create/ImageSelector.module.scss";
import {useContent} from "@/hooks/ContentHook";

interface ImageSelectorProps {

    currentImage: string | null;

    onImageChange: (image: string | null) => void;

}

export default function ImageSelector({currentImage, onImageChange}: ImageSelectorProps) {
    const {images, addImage, removeImage} = useContent();
    const uploadInputRef = createRef<HTMLInputElement>();

    /**
     * Handles the remove image button click event.
     *
     * @param imageId The id of the image to remove
     */
    function handleRemoveImageClick(imageId: string) {
        // Remove the image
        removeImage(imageId);

        // If the current image is the one that was removed, set the current image to null
        if (currentImage === imageId) {
            onImageChange(null);
        }
    }

    /**
     * Handles the upload button click event.
     */
    function handleUploadButtonClick() {
        const current = uploadInputRef.current;
        if (!current) {
            return;
        }

        current.click();
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

    return (
        <Row start>
            {
                images.map((image) => (
                    <Column
                        xs={24}
                        lg={6}
                        key={image.id}
                    >
                        <div className={styles.image}>
                            <div className={styles.img}>
                                <img src={image.base64} alt={image.id}/>
                            </div>
                            <div className={styles.information}>
                                <span>{image.id.split("-")[0]}</span>
                                <div className={styles.buttons}>
                                    <div
                                        className={styles.select}
                                        onClick={() => onImageChange(image.id)}
                                    >
                                        {
                                            currentImage === image.id ? (
                                                <BiCheck/>
                                            ) : (
                                                <BiMouse/>
                                            )
                                        }
                                    </div>
                                    <div
                                        className={styles.remove}
                                        onClick={() => handleRemoveImageClick(image.id)}
                                    >
                                        <BiTrash/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Column>
                ))
            }
            <Column
                xs={24}
            >
                <div className={styles.addButton} onClick={handleUploadButtonClick}>
                    <BiPlus/>
                    <span>
                            Add Image
                    </span>
                    <input
                        type={'file'}
                        accept={'image/*'}
                        ref={uploadInputRef}
                    />
                </div>
            </Column>
        </Row>
    )
}