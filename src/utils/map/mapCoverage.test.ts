import {
    containsBounds,
    intersectsBounds,
    subtractBounds,
} from "./mapCoverage";

describe("map coverage", () => {
    it("detects containment", () => {
        expect(
            containsBounds(
                [0, 0, 10, 10],
                [2, 2, 8, 8]
            )
        ).toBe(true);
    });

    it("detects non-overlapping bounds", () => {
        expect(
            intersectsBounds(
                [0, 0, 10, 10],
                [20, 20, 30, 30]
            )
        ).toBe(false);
    });

    it("returns no remaining area when completely covered", () => {
        expect(
            subtractBounds(
                [0, 0, 10, 10],
                [-5, -5, 15, 15]
            )
        ).toEqual([]);
    });

    it("returns the original area when there is no overlap", () => {
        expect(
            subtractBounds(
                [0, 0, 10, 10],
                [20, 20, 30, 30]
            )
        ).toEqual([
            [0, 0, 10, 10],
        ]);
    });

    it("removes a smaller map from a larger requested area", () => {
        const result = subtractBounds(
            [0, 0, 10, 10],
            [2, 2, 8, 8]
        );

        expect(result).toHaveLength(4);
    });
});