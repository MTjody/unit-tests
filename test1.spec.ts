import calculate from "./math.module";

describe("useful math module", () => {
  it("calls the underlying module", () => {
    expect(calculate(1, 2)).toBe(3);
  });
  it("still calls the underlying module", () => {
    expect(calculate(2, 2)).toBe(4);
  });
  it("still still calls the underlying module", () => {
    expect(calculate(3, 2)).toBe(5);
  });
});
