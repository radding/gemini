import TypeFn, { Type } from "../../types/Type";

describe("Type", () => {
  it("Works", () => {
    const tps = new Type("Foobar", "any");
    expect(tps.getGraphQLType()).toEqual("Foobar");
    expect(tps.getGraphQLValue()).toEqual("any");
  });

  it("TypeFn", () => {
    const tps = TypeFn("any", "Foobar");
    expect(tps.getGraphQLType()).toEqual("Foobar");
    expect(tps.getGraphQLValue()).toEqual("any");
  });
});