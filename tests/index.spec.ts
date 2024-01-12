import { basicSetup, ChangeSet, createEditorView, EditorSelection, EditorState, EditorView, EditorViewConfig, Line, minimalSetup, SelectionRange, Text, Transaction } from '../src/index';

class TestText implements Text {
    length: number;
    lines: number;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    lineAt(n: number): Line {
        throw new Error('Method not implemented.');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    replace(from: number, to: number, text: Text): Text {
        throw new Error('Method not implemented.');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    append(other: Text): Text {
        throw new Error('Method not implemented.');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    slice(from: number, to?: number): Text {
        throw new Error('Method not implemented.');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    sliceString(from: number, to?: number, lineSep?: string): string {
        throw new Error('Method not implemented.');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    eq(other: Text): boolean {
        throw new Error('Method not implemented.');
    }
    toString(): string {
        return "Lorem ...";
    }
    toJSON(): string[] {
        throw new Error('Method not implemented.');
    }

}

class TestEditorState implements EditorState {
    selection: EditorSelection;
    tabSize: number;
    lineBreak: string;
    readOnly: boolean;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    wordAt(pos: number): SelectionRange {
        throw new Error('Method not implemented.');
    }
    readonly doc: Text = new TestText();
}

class TestEditorView implements EditorView {
    readonly state: EditorState = new TestEditorState();
    constructor(readonly config?: EditorViewConfig) {

    }
    viewport: { from: number; to: number; };
    visibleRanges: readonly {
        from: number; // Insert text at the start of the document
        // Insert text at the start of the document
        to: number;
    }[];
    inView: boolean;
    composing: boolean;
    compositionStarted: boolean;
    root: DocumentOrShadowRoot;
    dom: HTMLElement;
    scrollDOM: HTMLElement;
    contentDOM: HTMLElement;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    update(transactions: readonly Transaction[]): void {
        throw new Error('Method not implemented.');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setState(newState: EditorState): void {
        throw new Error('Method not implemented.');
    }
    themeClasses: string;
    documentTop: number;
    documentPadding: { top: number; bottom: number; };
    scaleX: number;
    scaleY: number;
    contentHeight: number;
    destroy(): void {
        throw new Error('Method not implemented.');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    dispatch(tr: Transaction): void {
    }
}

function create_test_editor_view(config?: EditorViewConfig): EditorView {
    return new TestEditorView(config);
}

test("create_editor_view is a function", function () {
    expect(typeof createEditorView).toBe('function');
});

test("basicSetup is an object", function () {
    expect(typeof basicSetup).toBe('object');
});

test("minimalSetup is an object", function () {
    expect(typeof minimalSetup).toBe('object');
});

test("test_editor_view is a function", function () {
    expect(typeof create_test_editor_view).toBe('function');
});

test("Document Changes", function () {
    const view = create_test_editor_view({
        doc: "...",
        extensions: [basicSetup],
        parent: void 0
    });
    // Insert text at the start of the document
    view.dispatch({
        changes: { from: 0, insert: "#!/usr/bin/env node\n" }
    });
    view.state.doc.toString();
    const changes: ChangeSet[] = [];
    view.dispatch({ changes });
});
