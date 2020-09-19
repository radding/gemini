import { Must } from "../../types/Must";

describe("Type", () => {
  it("Works", () => {
    const tps = new Must("1234");
    expect(tps.getGraphQLType()).toEqual("String!");
    expect(tps.getGraphQLValue()).toEqual("1234");
  });

  it("Throws when given null or undefined", () => {
    let tps = new Must(null);
    expect(() => tps.getGraphQLValue()).toThrow();
    tps = new Must(undefined);
    expect(() => tps.getGraphQLValue()).toThrow();
  });
});