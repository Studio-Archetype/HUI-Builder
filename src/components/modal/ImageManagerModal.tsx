import {BiTrash, BiUpload} from "react-icons/bi";
import styles from "@/styles/components/modal/ImageManagerModal.module.scss";
import {createRef, useEffect} from "react";
import {type ImageData} from "@/util/types";
import Column from "@/components/grid/Column";
import Row from "@/components/grid/Row";
import {useImage} from "@/hooks/ImageHook";

export default function ImageManagerModal() {
    const uploadInputRef = createRef<HTMLInputElement>();
    const {images, addImage, removeImage} = useImage();

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

    /**
     * Handles the remove image button click event.
     *
     * @param imageId The id of the image to remove
     */
    function handleRemoveImageClick(imageId: string) {
        // Remove the image
        removeImage(imageId);
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
        <div className={styles.content}>
            <div className={styles.images}>
                <Row start>
                    {
                        images && images.map((image) => (
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
                                        <BiTrash
                                            onClick={() => handleRemoveImageClick(image.id)}
                                        />
                                    </div>
                                </div>
                            </Column>
                        ))
                    }
                </Row>
            </div>
            <div
                className={styles.uploadButton}
                onClick={handleUploadButtonClick}
            >
                <BiUpload/>
                <span>Upload Image</span>
                <input
                    type="file"
                    accept="image/*"
                    ref={uploadInputRef}
                />
            </div>
        </div>
    );
}