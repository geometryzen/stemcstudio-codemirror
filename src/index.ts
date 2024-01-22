
export { basicSetup, minimalSetup } from "codemirror";
import {
    EditorSelection as CmEditorSelection,
    EditorState as CmEditorState,
    Extension as CmExtension,
    SelectionRange as CmSelectionRange,
    Text as CmText
} from "@codemirror/state";
import { EditorViewConfig as CmEditorViewConfig } from "@codemirror/view";
import { EditorView as CmEditorView } from "codemirror";

export type Extension = unknown;
/*
export interface Line {
    from: number;
    to: number;
    number: number;
    text: string;
    length: number;
}
*/
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

export class EditorDocument {
    #unkInner: CmText;
    /**
     * @hidden
     */
    constructor(unkInner: unknown) {
        this.#unkInner = assert_cm_text(unkInner);
    }
    /**
     * 
     */
    /**
     * 
     * @returns the document as a string, using newline characters to separate lines.
     */
    toString(): string {
        return this.#unkInner.toString();
    }
    /**
     * @hidden
     */
    get unkInner(): unknown {
        return this.#unkInner;
    }
}
/*
function create_editor_document(): EditorDocument {
    return new EditorDocument(unkInner);
}
*/
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
/*
export interface ChangeDesc {
    length: number;
    newLength: number;
    empty: boolean;
    invertedDesc: ChangeDesc;
    composeDesc(other: ChangeDesc): ChangeDesc;
}
*/
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

export class EditSession {
    #unkInner: CmEditorState;
    /**
     * @hidden
     */
    constructor(unkInner: unknown) {
        this.#unkInner = assert_cm_editor_state(unkInner);
    }
    get document(): EditorDocument {
        return new EditorDocument(this.#unkInner.doc);
    }
    get selection(): Selection {
        return new Selection(this.#unkInner.selection);
    }
    wordAt(pos: number): Range {
        return new Range(this.#unkInner.wordAt(pos));
    }
    /**
     * @hidden
     */
    get unkInner(): unknown {
        return this.#unkInner;
    }
}

export interface EditSessionConfig {
    doc?: string;// | Text;
    selection?: Selection | { anchor: number, head?: number };
    extensions?: Extension[];
}

export interface EditorConfig extends EditSessionConfig {
    parent?: Element | DocumentFragment;
}
/*
export interface ChangeSet {
    from: number;
    insert: string;
}
*/
/*
export interface Transaction {
    startState: EditSession;
    changes: ChangeSet | ChangeSet[];
    selection: Selection | undefined;
    scrollIntoView: boolean;
    newDoc: EditorDocument;
    newSelection: Selection;
    state: EditSession;
    docChanged: boolean;
    reconfigured: boolean;
    isUserEvent(event: string): boolean;
}
*/
/*
export type ChangeSpec = {
    from: number;
    to?: number;
    insert?: string | EditorDocument;
} | ChangeSet | readonly ChangeSpec[];

export interface TransactionSpec {
    changes?: ChangeSpec;
}
*/
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

export function create_editor(config: EditorConfig) {
    return new Editor(config);
}

export class Editor {
    readonly #unkInner: CmEditorView;
    #refCount = 1;
    /**
     * @hidden
     * @param config 
     */
    constructor(config: EditorConfig) {
        this.#unkInner = new CmEditorView(cm_editor_view_config(config));
    }
    get session(): EditSession {
        return new EditSession(this.#unkInner.state);
    }
    addRef(): void {
        this.#refCount++;
    }
    insert(from: number, text: string): void {
        this.#unkInner.dispatch({
            changes: { from: from, insert: text }
        });
    }
    release() {
        this.#refCount--;
        if (this.#refCount === 0) {
            // eslint-disable-next-line no-console
            console.log("EditorView.destroy(): void");
            this.#unkInner.destroy();
        }
    }
    select(ranges: readonly Range[], mainIndex?: number): void {
        const cmranges: CmSelectionRange[] = ranges.map((range: Range) => {
            return assert_cm_selection_range(range.unkInner);
        });
        const cmselection = CmEditorSelection.create(cmranges, mainIndex);

        this.#unkInner.dispatch({
            selection: cmselection
        });
    }
    /**
     * @hidden
     */
    get unkInner(): unknown {
        return this.#unkInner;
    }
}

function cm_editor_view_config(config: EditorConfig = {}): CmEditorViewConfig {
    const retval: CmEditorViewConfig = {
        doc: config.doc,
        extensions: cm_extensions(config.extensions),
        parent: config.parent,
        selection: unpack_selection(config.selection)
    };
    return retval;
}

function cm_extension(extension: Extension): CmExtension {
    return extension as unknown as CmExtension;
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
/*
export interface TagStyle {
}
*/

export class Selection {
    #unkInner: CmEditorSelection;
    constructor(unkInner: CmEditorSelection) {
        this.#unkInner = assert_cm_editor_selection(unkInner);
    }
    get ranges(): Range[] {
        return this.#unkInner.ranges.map((range) => new Range(range));
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

export class Range {
    #unkInner: CmSelectionRange;
    /**
     * @hidden
     */
    constructor(unkInner: CmSelectionRange) {
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
    /**
     * @hidden
     */
    get unkInner(): CmSelectionRange {
        return this.#unkInner;
    }
}

export function create_anchor_range(anchor: number, head: number, goalColumn?: number, bidiLevel?: number): Range {
    return new Range(CmEditorSelection.range(anchor, head, goalColumn, bidiLevel));
}
export function create_cursor_range(pos: number, assoc?: number, bidiLevel?: number, goalColumn?: number): Range {
    return new Range(CmEditorSelection.cursor(pos, assoc, bidiLevel, goalColumn));
}
export function create_selection(ranges: readonly Range[], mainIndex?: number): Selection {
    const cmranges: CmSelectionRange[] = ranges.map((range: Range) => {
        return assert_cm_selection_range(range.unkInner);
    });
    return new Selection(CmEditorSelection.create(cmranges, mainIndex));
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

function unpack_selection(selection: Selection | { anchor: number, head?: number } | undefined): CmEditorSelection | { anchor: number, head?: number } | undefined {
    if (selection instanceof Selection) {
        const unkInner = selection.unkInner;
        return assert_cm_editor_selection(unkInner);
    }
    else if (typeof selection === 'object') {
        return selection;
    }
    else if (typeof selection === 'undefined') {
        return void 0;
    }
    else {
        throw new TypeError("selection");
    }
}
