import { basicSetup, create_editor_view, EditorView, EditorViewConfig, javascript, minimalSetup, Transaction } from '../src/index';


class TestEditorView implements EditorView {
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
    expect(typeof create_editor_view).toBe('function');
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
    const view = create_test_editor_view();
    // Insert text at the start of the document
    view.dispatch({
        changes: { from: 0, insert: "#!/usr/bin/env node\n" }
    });
});
