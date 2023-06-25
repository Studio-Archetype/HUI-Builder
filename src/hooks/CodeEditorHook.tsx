"use client";

import {type CursorData} from "@/util/types";
import {createContext, type ReactNode, useContext, useState} from "react";

interface CodeEditorProviderProps {

    children: ReactNode;

}

export type CodeEditorContextType = {

    cursorData: CursorData | undefined

    setCursorData: (data: CursorData) => void;

    error: string | undefined;

    setError: (error: string | undefined) => void;
}

// Create a hooks for the content type
const CodeEditorContext = createContext<CodeEditorContextType | null>(null);

// Provider component for the content type
export function CodeEditorProvider({children}: CodeEditorProviderProps) {
    const [cursorData, setCursorData] = useState<CursorData | undefined>(undefined);
    const [error, setError] = useState<string | undefined>(undefined);

    return (
        <CodeEditorContext.Provider value={{
            cursorData,
            setCursorData,
            error,
            setError
        }}>
            {children}
        </CodeEditorContext.Provider>
    );
}

// Hook for child components to get the content type
export function useCodeEditor() {
    const context = useContext(CodeEditorContext);
    // Ensure that the hook is used within a ContentProvider
    if (!context) {
        throw new Error("useCodeEditor must be used within a CodeEditorProvider");
    }

    return context;
}