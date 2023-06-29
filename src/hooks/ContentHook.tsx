"use client";

import {
    createContext,
    type Dispatch,
    type ReactNode,
    type SetStateAction,
    useContext,
    useEffect,
    useState
} from "react";
import {ContentType, type HoloUIData, type HoloUISchema, type ImageData} from "@/util/types";
import Ajv from "ajv";

const ajv = new Ajv();

interface ContentProviderProps {

    children: ReactNode;

}

export type ContentContextType = {

    contentType: ContentType;

    setContentType: (contentType: ContentType) => void;

    data: HoloUIData | undefined;

    setData: Dispatch<SetStateAction<HoloUIData | undefined>>

    selectedComponent: string | undefined;

    setSelectedComponent: Dispatch<SetStateAction<string | undefined>>;

    images: ImageData[];

    addImage: (image: ImageData) => void;

    removeImage: (id: string) => void;

    validateData: (rawData: string) => string | undefined;

    switchContentType: () => void;

}

// Create a hooks for the content type
const ContentContext = createContext<ContentContextType | null>(null);

// Provider component for the content type
export function ContentProvider({children}: ContentProviderProps) {
    const [contentType, setContentType] = useState<ContentType>(ContentType.VISUAL_EDITOR);
    const [data, setData] = useState<HoloUIData | undefined>();
    const [selectedComponent, setSelectedComponent] = useState<string | undefined>();
    const [images, setImages] = useState<ImageData[]>([]);
    const [schema, setSchema] = useState<HoloUISchema | undefined>();

    /**
     * Downloads the schema from the schema URL.
     */
    function downloadSchema() {
        const url = 'https://raw.githubusercontent.com/Studio-Archetype/HoloUi/master/schema/holoui.schema.json';
        if (!url) {
            console.log("Schema URL not set");
            return;
        }

        console.log(`Downloading schema from ${url}`);

        fetch(url)
            .then(response => response.json())
            .then(json => {
                // Set the schema
                setSchema(json);
                // Log the success
                console.log(`Downloaded schema from ${url}`);
            })
            .catch(error => console.log(error));
    }

    /**
     * Switches the content type.
     */
    function switchContentType() {
        switch (contentType) {
            case ContentType.CODE_EDITOR:
                setContentType(ContentType.VISUAL_EDITOR);
                break;
            case ContentType.VISUAL_EDITOR:
                setContentType(ContentType.CODE_EDITOR);
                break;
        }
    }

    /**
     * Adds an image to the list of images.
     *
     * @param image The image to add
     */
    function addImage(image: ImageData) {
        setImages([...images, image]);
    }

    /**
     * Removes an image from the list of images.
     *
     * @param id The ID of the image to remove
     */
    function removeImage(id: string) {
        setImages(images.filter(image => image.id !== id));
    }

    /**
     * Validates the data.
     *
     * @param rawData The data to validate as a string
     */
    function validateData(rawData: string): string | undefined {
        if (!schema || !rawData) {
            return "No schema or data";
        }

        try {
            const data = JSON.parse(rawData);
            // Compile the schema
            const validate = ajv.compile(schema);

            // Validate the data
            return validate(data) ? undefined : "Invalid data";
        } catch (ignored) {
            return "Invalid JSON";
        }
    }

    // Download the schema on first render
    useEffect(() => {
        downloadSchema();

        // Load data from local storage
        const storageData = localStorage.getItem("data") ?? JSON.stringify({
            offset: [0, 0, 0],
            components: [],
            lockPosition: false
        });
        if (!storageData) {
            return;
        }

        try {
            setData(JSON.parse(storageData));
        } catch (ignored) {
        }

        // Load images from local storage
        const images = localStorage.getItem("images") || JSON.stringify([]);

        try {
            setImages(JSON.parse(images));
        } catch (ignored) {
            setImages([]);
        }
    }, []);

    useEffect(() => {
        // Make sure that the selected component is valid
        if (data && selectedComponent) {
            if (!data.components.find(component => component.id === selectedComponent)) {
                setSelectedComponent(undefined);
            }
        }

        // Save the data to local storage
        localStorage.setItem("data", JSON.stringify(data));
        console.log("Saved data to local storage")
    }, [data, setData]);

    useEffect(() => {
        // Load images from local storage
        localStorage.setItem("images", JSON.stringify(images));
    }, [images]);


    return (
        <ContentContext.Provider value={{
            contentType,
            setContentType,
            data,
            setData,
            selectedComponent,
            setSelectedComponent,
            images,
            addImage,
            removeImage,
            validateData,
            switchContentType
        }}>
            {children}
        </ContentContext.Provider>
    );
}

// Hook to use the content hooks
export function useContent() {
    const context = useContext(ContentContext);

    // Ensure that the hook is used within a ContentProvider
    if (!context) {
        throw new Error("useContent must be used within a ContentProvider");
    }

    return context;
}