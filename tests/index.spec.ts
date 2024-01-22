import { basicSetup, create_anchor_range, create_cursor_range, create_editor, EditorConfig, minimalSetup, Range } from '../src/index';

test("basicSetup is an object", function () {
    expect(typeof basicSetup).toBe('object');
});

test("minimalSetup is an object", function () {
    expect(typeof minimalSetup).toBe('object');
});

xtest("Document Changes", function () {
    const config: EditorConfig = {
        doc: "...",
        extensions: [basicSetup],
        parent: void 0
    };
    const view = create_editor(config);
    try {
        // Insert text at the start of the document
        view.insert(0, "#!/usr/bin/env node\n");
        view.session.document.toString();
        const range: Range = create_anchor_range(4, 5);
        const cursor = create_cursor_range(8);
        const ranges: Range[] = [range, cursor];
        view.select(ranges, 1);
    }
    finally {
        view.release();
    }
});
