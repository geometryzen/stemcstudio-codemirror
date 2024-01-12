
export { javascript } from "@codemirror/lang-javascript";
export { basicSetup, minimalSetup } from "codemirror";
import { EditorView as CmEditorView } from "codemirror";

export interface EditorViewConfig {
    parent?: Element | DocumentFragment;
}

export interface ChangeSet {

}

export interface Transaction {
    changes: ChangeSet;
}

export interface EditorView {
    dispatch(tr: Transaction): void;
}

export function create_editor_view(config?: EditorViewConfig): EditorView {
    return new CmEditorView(config);
}