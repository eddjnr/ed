import { describe, expect, it } from "vite-plus/test";
import { formatCalendarDate } from "./date";

describe("formatCalendarDate", () => {
  it("keeps a calendar date stable across local timezones", () => {
    expect(formatCalendarDate("2026-03-28", "long")).toBe("March 28, 2026");
  });

  it("supports the compact article-list format", () => {
    expect(formatCalendarDate("2026-03-28", "short")).toBe("Mar 28, 2026");
  });

  it("rejects malformed and impossible dates", () => {
    expect(() => formatCalendarDate("2026-02-30")).toThrow(RangeError);
    expect(() => formatCalendarDate("March 28, 2026")).toThrow(RangeError);
  });
});
