import { describe, expect, it } from "vite-plus/test";
import { parsePostMetadata, slugFromPostPath } from "./posts";

describe("post content helpers", () => {
  it("extracts a slug from a content path", () => {
    expect(slugFromPostPath("/src/content/blog/clean-interfaces.md")).toBe("clean-interfaces");
  });

  it("validates frontmatter before a route consumes it", () => {
    expect(
      parsePostMetadata(
        {
          title: "Clean interfaces",
          description: "Notes about interface design.",
          date: "2026-03-28",
          published: true,
        },
        "test.md",
      ),
    ).toMatchObject({ title: "Clean interfaces", published: true });
  });

  it("rejects incomplete frontmatter", () => {
    expect(() => parsePostMetadata({ title: "Incomplete" }, "test.md")).toThrow(TypeError);
  });
});
