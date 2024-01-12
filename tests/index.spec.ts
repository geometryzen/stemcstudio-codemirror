import { basicSetup, ChangeSet, createEditorView, EditorState, EditorView, EditorViewConfig, javascript, minimalSetup, Text, Transaction } from '../src/index';

class TestText implements Text {

}

class TestEditorState implements EditorState {
    readonly doc: Text = new TestText();
}

class TestEditorView implements EditorView {
    readonly state: EditorState = new TestEditorState();
    constructor(readonly config?: EditorViewConfig) {

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

test("javascript is an object", function () {
    expect(typeof javascript).toBe('function');
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
