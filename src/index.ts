
export { javascript } from "@codemirror/lang-javascript";
export { basicSetup, minimalSetup } from "codemirror";
import { EditorView as CmEditorView } from "codemirror";

export interface Extension {

}

export interface EditorViewConfig {
    extensions?: Extension[];
    parent?: Element | DocumentFragment;
}

export interface ChangeSet {
    from: number;
    insert: string;
}

export interface Transaction {
    changes: ChangeSet;
}

export interface EditorView {
    dispatch(tr: Transaction): void;
}

export function create_editor_view(config?: EditorViewConfig): EditorView {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new CmEditorView(config as any) as unknown as EditorView;
}