
//import { javascript } from "@codemirror/lang-javascript";
import { /*basicSetup*/ /*,minimalSetup*/ EditorView as CmEditorView } from "codemirror";

export interface EditorViewConfig {
    parent?: Element | DocumentFragment;
}

export interface EditorView {

}

export function create_editor_view(config?: EditorViewConfig): EditorView {
    return new CmEditorView(config);
}