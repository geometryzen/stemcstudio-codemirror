import { basicSetup, cursor_selection_range, EditorView, EditorViewConfig, minimalSetup, range_selection_range, selection, SelectionRange } from '../src/index';

test("basicSetup is an object", function () {
    expect(typeof basicSetup).toBe('object');
});

test("minimalSetup is an object", function () {
    expect(typeof minimalSetup).toBe('object');
});

xtest("Document Changes", function () {
    const config: EditorViewConfig = {
        doc: "...",
        extensions: [basicSetup],
        parent: void 0
    };
    const view = new EditorView(config);
    // Insert text at the start of the document
    view.dispatch({
        changes: { from: 0, insert: "#!/usr/bin/env node\n" }
    });
    view.state.doc.toString();
    // const changes: ChangeSet[] = [];
    // view.dispatch({ changes });
    const range: SelectionRange = range_selection_range(4, 5);
    const cursor = cursor_selection_range(8);
    const ranges: SelectionRange[] = [range, cursor];
    view.dispatch({
        selection: selection(ranges, 1)
    });
});
