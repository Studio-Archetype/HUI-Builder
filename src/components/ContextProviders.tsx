import {type ReactNode} from "react";
import {CodeEditorProvider} from "@/hooks/CodeEditorHook";
import {ModalProvider} from "@/hooks/ModalHook";
import {ContentProvider} from "@/hooks/ContentHook";
import {SettingsProvider} from "@/hooks/SettingsHook";

interface ContentProviderProps {

    children: ReactNode;

}

export default function ContextProviders({children}: ContentProviderProps) {
    return (
        <SettingsProvider>
            <ContentProvider>
                <CodeEditorProvider>
                    <ModalProvider>
                        {children}
                    </ModalProvider>
                </CodeEditorProvider>
            </ContentProvider>
        </SettingsProvider>
    );
}