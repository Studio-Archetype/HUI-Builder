import CodeMirror from "@uiw/react-codemirror";
import styles from "@/styles/components/PageContent.module.scss";
import {vscodeDark} from "@uiw/codemirror-theme-vscode";
import {json} from "@codemirror/lang-json";
import {type ViewUpdate} from "@codemirror/view";
import {useCodeEditor} from "@/hooks/CodeEditorHook";
import {type HoloUIData} from "@/util/types";
import {useComponent} from "@/hooks/ComponentHook";

export default function CodeEditor() {
    const {validateData, data, setData} = useComponent();
    const {setCursorData, setError} = useCodeEditor();

    /**
     * Validates the data.
     *
     * @param value The data to validate as a string
     */
    function handleDataChange(value: string) {
        const error = validateData(value);
        if (error) {
            setError(error);
            return;
        }

        // Reset the error
        setError(undefined);
        // Set the data string
        try {
            setData(JSON.parse(value) as HoloUIData);
        } catch (ex) {
            setError("Invalid JSON");
        }
    }

    /**
     * Handles the cursor change.
     *
     * @param viewUpdate The view update
     */
    function handleCursorChange(viewUpdate: ViewUpdate) {
        const currentLine = viewUpdate.state.doc.lineAt(viewUpdate.state.selection.main.head).number;
        const currentLineChar = viewUpdate.state.selection.main.head;
        const formattedChar = currentLineChar - viewUpdate.state.doc.line(currentLine).from;

        // Set the cursor data
        setCursorData({
            line: currentLine,
            character: formattedChar
        });
    }

    return (
        <CodeMirror
            className={styles.codeMirror}
            value={JSON.stringify(data, null, 4)}
            height={"100%"}
            theme={vscodeDark}
            basicSetup={{
                foldGutter: false,
                autocompletion: true,
            }}
            extensions={[json()]}
            onChange={handleDataChange}
            onUpdate={handleCursorChange}
        />
    )
}