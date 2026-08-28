import { describe, expect, it, vi } from "vitest";

vi.setConfig({ testTimeout: 1000 });

describe("app", () => {
    it("works", () => {
        expect(true).toBe(true);
    });
});
