
import { javascript } from "@codemirror/lang-javascript";
import { basicSetup /*,minimalSetup*/, EditorView } from "codemirror";

export function create_basic_editor_view(parent: Element | DocumentFragment): EditorView {
    return new EditorView({
        extensions: [basicSetup, javascript()],
        parent: parent
    });
}