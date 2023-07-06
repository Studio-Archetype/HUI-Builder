"use client";

import {createContext, type ReactNode, useContext, useEffect, useState} from "react";
import {type ImageData} from "@/util/types";

interface ImageHookProviderProps {

    children: ReactNode;

}

export type ImageHookContextType = {

    images: ImageData[];

    addImage: (image: ImageData) => void;

    removeImage: (id: string) => void;

}

// Create a hooks for the content type
const ImageHookContext = createContext<ImageHookContextType | null>(null);

// Provider component for the content type
export function ImageProvider({children}: ImageHookProviderProps) {
    const [images, setImages] = useState<ImageData[]>([]);

    /**
     * Adds an image to the list of images.
     *
     * @param image The image to add
     */
    function addImage(image: ImageData) {
        setImages([...images, image]);

        // Save the images to local storage
        localStorage.setItem("images", JSON.stringify([...images, image]));
    }

    /**
     * Removes an image from the list of images.
     *
     * @param id The ID of the image to remove
     */
    function removeImage(id: string) {
        setImages(images.filter(image => image.id !== id));

        // Save the images to local storage
        localStorage.setItem("images", JSON.stringify(images.filter(image => image.id !== id)));
    }

    // Download the schema on first render
    useEffect(() => {
        // Load images from local storage
        const images = localStorage.getItem("images");
        if (images) {
            try {
                console.log(`Loading images from local storage`);
                const parsedImages = JSON.parse(images);
                setImages(parsedImages);
                console.log(`Loaded ${images.length} images from local storage`);
            } catch (ignored) {
            }
        } else {
            setImages([]);
        }
    }, []);

    return (
        <ImageHookContext.Provider value={{
            images,
            addImage,
            removeImage
        }}>
            {children}
        </ImageHookContext.Provider>
    );
}

// Hook for using the content type
export function useImage(): ImageHookContextType {
    const context = useContext(ImageHookContext);

    // Ensure that the hook is used within a ContentProvider
    if (!context) {
        throw new Error("useImage must be used within a ImageProvider");
    }

    return context;
}