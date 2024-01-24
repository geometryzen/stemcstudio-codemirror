import { basicSetup, create_anchor_range, create_cursor_range, create_editor, EditorConfig, EditSession, minimalSetup, Range } from '../src/index';

test("basicSetup is an object", function () {
    expect(typeof basicSetup).toBe('object');
});

test("minimalSetup is an object", function () {
    expect(typeof minimalSetup).toBe('object');
});

test("Range", function () {
    expect(typeof minimalSetup).toBe('object');
    const range: Range = create_anchor_range(4, 5);
    range.release();
});

xtest("Document Changes", function () {
    const config: EditorConfig = {
        value: "...",
        extensions: [basicSetup],
        parent: null
    };
    const view = create_editor(config);
    try {
        // Insert text at the start of the document
        view.insert(0, "#!/usr/bin/env node\n");
        view.session.document.toString();
        const range: Range = create_anchor_range(4, 5);
        range.release();
        const cursor = create_cursor_range(8);
        const ranges: Range[] = [range, cursor];
        view.select(ranges, 1);
        view.focus();
        view.value = "0123456789";
        const hasFocus: boolean = view.hasFocus;
        // eslint-disable-next-line no-console
        console.log("hasFocus", hasFocus);
        const session: EditSession = view.session;
        const wordRange: Range = session.wordAt(0);
        const from: number = wordRange.from;
        const to: number = wordRange.to;
        // eslint-disable-next-line no-console
        console.log("wordAt", from, to);
    }
    finally {
        view.release();
    }
});
