
export { basicSetup, minimalSetup } from "codemirror";
import {
    EditorSelection as CmEditorSelection,
    EditorState as CmEditorState,
    Extension as CmExtension,
    SelectionRange as CmSelectionRange,
    Text as CmText,
    Transaction as CmTransaction
} from "@codemirror/state";
import { EditorViewConfig as CmEditorViewConfig } from "@codemirror/view";
import { EditorView as CmEditorView } from "codemirror";

type Extension = CmExtension;

export interface Line {
    from: number;
    to: number;
    number: number;
    text: string;
    length: number;
}
/*
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
*/

class Text {
    #punkInner: CmText;
    constructor(punkInner: unknown) {
        this.#punkInner = assert_cm_text(punkInner);
    }
    /**
     * 
     */
    /**
     * 
     * @returns the document as a string, using newline characters to separate lines.
     */
    toString(): string {
        return this.#punkInner.toString();
    }
}
/*
export interface EditorSelection {
    ranges: SelectionRange;
    mainIndex: number;
    main: SelectionRange;
    asSingle(): EditorSelection;
    addRange(range: SelectionRange, main?: boolean): EditorSelection;
    replaceRange(range: SelectionRange, which?: number): EditorSelection;
}
*/
export interface ChangeDesc {
    length: number;
    newLength: number;
    empty: boolean;
    invertedDesc: ChangeDesc;
    composeDesc(other: ChangeDesc): ChangeDesc;
}
/*
export interface EditorState {
    doc: Text;
    selection: EditorSelection;
    tabSize: number;
    lineBreak: string;
    readOnly: boolean;
    wordAt(pos: number): SelectionRange | null;
}
*/

export class EditorState {
    #punkInner: CmEditorState;
    constructor(punkInner: unknown) {
        this.#punkInner = assert_cm_editor_state(punkInner);
    }
    get doc(): Text {
        return new Text(this.#punkInner.doc);
    }
    get punkInner(): unknown {
        return this.#punkInner;
    }
}


export interface EditorStateConfig {
    doc?: string;// | Text;
    selection?: Selection | { anchor: number, head?: number };
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
    selection: Selection | undefined;
    scrollIntoView: boolean;
    newDoc: Text;
    newSelection: Selection;
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
/*
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
*/

export class EditorView {
    readonly #punkInner: CmEditorView;
    constructor(config: EditorViewConfig) {
        this.#punkInner = new CmEditorView(cm_editor_view_config(config));
    }
    get state(): EditorState {
        return new EditorState(this.#punkInner.state);
    }
    dispatch(arg: {
        changes?: { from: number, insert: string },
        selection?: Selection
    }
    ) {
        this.#punkInner.dispatch(arg as unknown as CmTransaction);
    }
    get punkInner(): unknown {
        return this.#punkInner;
    }
}

function cm_editor_view_config(config: EditorViewConfig = {}): CmEditorViewConfig {
    const retval: CmEditorViewConfig = {
        doc: config.doc,
        extensions: cm_extensions(config.extensions),
        parent: config.parent
    };
    return retval;
}

function cm_extension(extension: Extension): CmExtension {
    return extension;
}

function cm_extensions(extensions: Extension[]): CmExtension[] {
    if (Array.isArray(extensions)) {
        return extensions.map(cm_extension);
    }
    else {
        return [];
    }
}

export interface StyleSpec {

}

export function theme(spec: { [selector: string]: StyleSpec }, options?: { dark?: boolean }): Extension {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return CmEditorView.theme(spec as any, options);
}

export interface TagStyle {

}

export class Selection {
    #unkInner: CmEditorSelection;
    constructor(unkInner: unknown) {
        this.#unkInner = assert_cm_editor_selection(unkInner);
    }
    get ranges(): SelectionRange[] {
        return this.#unkInner.ranges.map((range) => new SelectionRange(range));
    }
    get unkInner(): unknown {
        return this.#unkInner;
    }
}

/*
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
*/

export class SelectionRange {
    #unkInner: CmSelectionRange;
    constructor(unkInner: unknown) {
        this.#unkInner = assert_cm_selection_range(unkInner);
    }
    /**
     * The lower boundary of the range.
     */
    get from(): number {
        return this.#unkInner.from;
    }
    /**
     * The upper boundary of the range.
     */
    get to(): number {
        return this.#unkInner.to;
    }
    get unkInner(): unknown {
        return this.#unkInner;
    }
}

export function range_selection_range(anchor: number, head: number, goalColumn?: number, bidiLevel?: number): SelectionRange {
    return new SelectionRange(CmEditorSelection.range(anchor, head, goalColumn, bidiLevel));
}
export function cursor_selection_range(pos: number, assoc?: number, bidiLevel?: number, goalColumn?: number): SelectionRange {
    return new SelectionRange(CmEditorSelection.cursor(pos, assoc, bidiLevel, goalColumn));
}
export function selection(ranges: readonly SelectionRange[], mainIndex?: number): Selection {
    const xs: CmSelectionRange[] = ranges.map((range: SelectionRange) => {
        return assert_cm_selection_range(range.unkInner);
    });
    return new Selection(CmEditorSelection.create(xs, mainIndex));
}

function assert_cm_editor_selection(unkInner: unknown): CmEditorSelection {
    if (unkInner instanceof CmEditorSelection) {
        return unkInner;
    }
    else {
        throw new Error();
    }
}

function assert_cm_editor_state(unkInner: unknown): CmEditorState {
    if (unkInner instanceof CmEditorState) {
        return unkInner;
    }
    else {
        throw new Error();
    }
}

/*
function assert_cm_editor_view(unkInner: unknown): CmEditorView {
    if (unkInner instanceof CmEditorView) {
        return unkInner;
    }
    else {
        throw new Error();
    }
}
*/

function assert_cm_selection_range(unkInner: unknown): CmSelectionRange {
    if (unkInner instanceof CmSelectionRange) {
        return unkInner;
    }
    else {
        throw new Error();
    }
}

function assert_cm_text(unkInner: unknown): CmText {
    if (unkInner instanceof CmText) {
        return unkInner;
    }
    else {
        throw new Error();
    }
}
