import calculate from "./math.module";

jest.mock("./plus.module", () => ({
  __esModule: true,
  default: (a, b) => a * b,
}));
describe("useful math module", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it("calls the mock module", () => {
    expect(calculate(1, 2)).toBe(2);
  });
  it("still calls the mock module", () => {
    expect(calculate(2, 2)).toBe(4);
  });
  it("still still calls the mock module", () => {
    expect(calculate(3, 2)).toBe(6);
  });
});
