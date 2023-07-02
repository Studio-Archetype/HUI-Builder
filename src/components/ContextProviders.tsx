import {type ReactNode} from "react";
import {CodeEditorProvider} from "@/hooks/CodeEditorHook";
import {ModalProvider} from "@/hooks/ModalHook";
import {ContentProvider} from "@/hooks/ContentHook";
import {ComponentProvider} from "@/hooks/ComponentHook";
import {ImageProvider} from "@/hooks/ImageHook";

interface ContentProviderProps {

    children: ReactNode;

}

export default function ContextProviders({children}: ContentProviderProps) {
    return (
        <ContentProvider>
            <ImageProvider>
                <ComponentProvider>
                    <CodeEditorProvider>
                        <ModalProvider>
                            {children}
                        </ModalProvider>
                    </CodeEditorProvider>
                </ComponentProvider>
            </ImageProvider>
        </ContentProvider>
    );
}