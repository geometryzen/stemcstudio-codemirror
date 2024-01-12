
export { javascript } from "@codemirror/lang-javascript";
export { basicSetup, minimalSetup } from "codemirror";
import { EditorView as CmEditorView } from "codemirror";

export interface Extension {

}

export interface Text {
    toString(): string;
}

export interface EditorState {
    /**
     * The current document.
     */
    doc: Text;
}

export interface EditorStateConfig {
    doc?: string | Text;
    extensions?: Extension[];
}

export interface EditorViewConfig extends EditorStateConfig {
    parent?: Element | DocumentFragment;
}

export interface ChangeSet {
    from: number;
    insert: string;
}

export interface Transaction {
    changes: ChangeSet | ChangeSet[];
}

export interface EditorView {
    state: EditorState;
    dispatch(tr: Transaction): void;
}

export function createEditorView(config?: EditorViewConfig): EditorView {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new CmEditorView(config as any) as unknown as EditorView;
}

export interface StyleSpec {

}

export function theme(spec: { [selector: string]: StyleSpec }, options?: { dark?: boolean }): Extension {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return CmEditorView.theme(spec as any, options);
}