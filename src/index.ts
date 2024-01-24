
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

class InnerOuterMap<I, O> {
    #map: { inner: I, outer: O }[] = [];
    constructor() {
    }
    add(inner: I, outer: O): void {
        this.#map.push({ inner, outer });
    }
    lookup(outer: O): I {
        const idx = this.#map.findIndex(entry => entry.outer === outer);
        return this.#map[idx].inner;
    }
    remove(outer: O): I {
        const idx = this.#map.findIndex(entry => entry.outer === outer);
        const inner = this.#map[idx].inner;
        this.#map.splice(idx, 1);
        return inner;
    }
    get length(): number {
        return this.#map.length;
    }
}

const editorMap = new InnerOuterMap<CmEditorView, Editor>();
const rangeMap = new InnerOuterMap<CmSelectionRange, Range>();
const selectionMap = new InnerOuterMap<CmEditorSelection, Selection>();

export type Extension = unknown;

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
}

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
}

export interface EditSessionConfig {
    value?: string | null;// | Text;
    selection?: Selection | { anchor: number, head?: number };
    extensions?: Extension[];
}

export interface EditorConfig extends EditSessionConfig {
    parent?: Element | DocumentFragment | null;
}

export function create_editor(config: EditorConfig) {
    const unkInner = new CmEditorView(cm_editor_view_config(config));
    return new Editor(unkInner);
}

export class Editor {
    #refCount = 1;
    /**
     * @hidden
     */
    constructor(unkInner: CmEditorView) {
        assert_cm_editor_view(unkInner);
        editorMap.add(unkInner, this);
    }
    #destructor(): void {
        editorMap.remove(this).destroy();
    }
    get session(): EditSession {
        return new EditSession(editorMap.lookup(this).state);
    }
    addRef(): void {
        this.#refCount++;
    }
    dispatch(arg: { changes: { from: number, to?: number, insert?: string }[] }): void {
        editorMap.lookup(this).dispatch(arg);
    }
    focus(): void {
        editorMap.lookup(this).focus();
    }
    insert(from: number, text: string): void {
        editorMap.lookup(this).dispatch({
            changes: { from: from, insert: text }
        });
    }
    get hasFocus(): boolean {
        return editorMap.lookup(this).hasFocus;
    }
    release(): void {
        this.#refCount--;
        if (this.#refCount === 0) {
            this.#destructor();
        }
    }
    select(ranges: readonly Range[], mainIndex?: number): void {
        const cmranges: CmSelectionRange[] = ranges.map((range: Range) => {
            return assert_cm_selection_range(rangeMap.lookup(range));
        });
        const cmselection = CmEditorSelection.create(cmranges, mainIndex);

        editorMap.lookup(this).dispatch({
            selection: cmselection
        });
    }
    /**
     * Sets the start and end positions of a selection in the editor.
     * @param start The offset into the editor for the start of the selection.
     * @param end The offset into the editor for the end of the selection.
     * @param direction The direction in which the selection is performed.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setSelectionRange(start: number | null, end: number | null, direction?: "forward" | "backward" | "none"): void {
        const range = create_anchor_range(start, end);
        try {
            this.select([range]);
        }
        finally {
            range.release();
        }
    }
    get value(): string {
        return this.session.document.toString();
    }
    set value(text: string) {
        this.dispatch({ changes: [{ from: 0, to: this.value.length, insert: text }] });
    }
}

function cm_editor_view_config(config: EditorConfig = {}): CmEditorViewConfig {
    const retval: CmEditorViewConfig = {
        doc: config.value,
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

export function create_theme(spec: { [selector: string]: StyleSpec }, options?: { dark?: boolean }): Extension {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return CmEditorView.theme(spec as any, options);
}
/*
export interface TagStyle {
}
*/

/**
 * A reference-counted wrapper over the CodeMirror EditorSelection.
 */
export class Selection {
    #unkInner: CmEditorSelection;
    #refCount = 1;
    /**
     * @hidden
     */
    constructor(unkInner: CmEditorSelection) {
        this.#unkInner = assert_cm_editor_selection(unkInner);
        selectionMap.add(unkInner, this);
    }
    get ranges(): Range[] {
        return this.#unkInner.ranges.map((range) => new Range(range));
    }
    addRef(): void {
        this.#refCount++;
    }
    release(): void {
        this.#refCount--;
        if (this.#refCount === 0) {
            selectionMap.remove(this);
        }
    }
}

/**
 * A reference-counted wrapper over the CodeMirror SelectionRange.
 */
export class Range {
    #unkInner: CmSelectionRange;
    #refCount = 1;
    /**
     * @hidden
     */
    constructor(unkInner: CmSelectionRange) {
        this.#unkInner = assert_cm_selection_range(unkInner);
        rangeMap.add(unkInner, this);
    }
    #destructor(): void {
        rangeMap.remove(this);
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
    addRef(): void {
        this.#refCount++;
    }
    release(): void {
        this.#refCount--;
        if (this.#refCount === 0) {
            this.#destructor();
        }
    }
}

export function create_anchor_range(anchor: number, head: number, goalColumn?: number, bidiLevel?: number): Range {
    return new Range(CmEditorSelection.range(anchor, head, goalColumn, bidiLevel));
}
export function create_cursor_range(pos: number, assoc?: number, bidiLevel?: number, goalColumn?: number): Range {
    return new Range(CmEditorSelection.cursor(pos, assoc, bidiLevel, goalColumn));
}
/**
 * 
 * @param ranges 
 * @param mainIndex 
 * @returns 
 */
export function create_selection(ranges: readonly Range[], mainIndex?: number): Selection {
    const cmranges: CmSelectionRange[] = ranges.map((range: Range) => {
        return assert_cm_selection_range(rangeMap.lookup(range));
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

function assert_cm_editor_view(unkInner: unknown): CmEditorView {
    if (unkInner instanceof CmEditorView) {
        return unkInner;
    }
    else {
        throw new Error();
    }
}

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
        const unkInner = selectionMap.lookup(selection);
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
