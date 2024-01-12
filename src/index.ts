
export { basicSetup, minimalSetup } from "codemirror";
import { EditorView as CmEditorView } from "codemirror";

export interface Extension {

}

export interface Line {
    from: number;
    to: number;
    number: number;
    text: string;
    length: number;
}

export interface Text {
    length: number;
    lines: number;
    lineAt(n: number): Line;
    replace(from: number, to: number, text: Text): Text;
    append(other: Text): Text;
    slice(from: number, to?: number): Text;
    sliceString(from: number, to?: number, lineSep?: string): string;
    eq(other: Text): boolean;
    toString(): string;
    toJSON(): string[];
}

export interface EditorSelection {
    ranges: SelectionRange;
    mainIndex: number;
    main: SelectionRange;
    asSingle(): EditorSelection;
    addRange(range: SelectionRange, main?: boolean): EditorSelection;
    replaceRange(range: SelectionRange, which?: number): EditorSelection;
}

export interface ChangeDesc {
    length: number;
    newLength: number;
    empty: boolean;
    invertedDesc: ChangeDesc;
    composeDesc(other: ChangeDesc): ChangeDesc;
}

export interface SelectionRange {
    from: number;
    to: number;
    anchor: number;
    head: number;
    empty: boolean;
    assoc: -1 | 0 | 1;
    bidiLevel: number | null;
    goalColumn: number | undefined;
    map(change: ChangeDesc, assoc?: number): SelectionRange;
    extend(from: number, to?: number): SelectionRange;
    eq(other: SelectionRange, includeAssoc?: boolean): boolean;
}

export interface EditorState {
    /**
     * The current document.
     */
    doc: Text;
    selection: EditorSelection;
    tabSize: number;
    lineBreak: string;
    readOnly: boolean;
    wordAt(pos: number): SelectionRange | null;
}

export interface EditorStateConfig {
    doc?: string | Text;
    selection?: EditorSelection | { anchor: number, head?: number };
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
    startState: EditorState;
    changes: ChangeSet | ChangeSet[];
    selection: EditorSelection | undefined;
    scrollIntoView: boolean;
    newDoc: Text;
    newSelection: EditorSelection;
    state: EditorState;
    docChanged: boolean;
    reconfigured: boolean;
    isUserEvent(event: string): boolean;
}

export type ChangeSpec = {
    from: number;
    to?: number;
    insert?: string | Text;
} | ChangeSet | readonly ChangeSpec[];

export interface TransactionSpec {
    changes?: ChangeSpec;
}

export interface EditorView {
    state: EditorState;
    viewport: { from: number, to: number };
    visibleRanges: readonly { from: number, to: number }[];
    inView: boolean;
    composing: boolean;
    compositionStarted: boolean;
    root: DocumentOrShadowRoot;
    dom: HTMLElement;
    scrollDOM: HTMLElement;
    contentDOM: HTMLElement;
    dispatch(...specs: TransactionSpec[]): void;
    update(transactions: readonly Transaction[]): void;
    setState(newState: EditorState): void;
    themeClasses: string;
    documentTop: number;
    documentPadding: { top: number, bottom: number };
    scaleX: number;
    scaleY: number;
    contentHeight: number;
    destroy(): void;
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

export interface TagStyle {

}
