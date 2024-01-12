import { greeting } from "../src/index";

test("greeting the World", function () {
    expect(greeting("World")).toBe("Hello, World!");
});
