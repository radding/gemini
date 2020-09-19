import Functions from "../../types";

describe("The Functions", () => {
  it("Works fine with numbers", () => {
    expect(Functions.Int(1234).getGraphQLType()).toEqual("Int");
  });
  it("fails when passed a non whole number", () => {
    expect(() => Functions.Int(1234.23)).toThrow();
  });
  it("works with floats", () => {
    expect(Functions.Float(1).getGraphQLType()).toEqual("Float");
    expect(Functions.Float(1.443).getGraphQLType()).toEqual("Float");
  });
  it("Works with IDs", () => {
    expect(Functions.ID("1234").getGraphQLType()).toEqual("ID");
    expect(Functions.ID("abcd").getGraphQLType()).toEqual("ID");
  });
  it("works with strings", () => {
    expect(Functions.String("1234").getGraphQLType()).toEqual("String");
    expect(Functions.String("abcd").getGraphQLType()).toEqual("String");
  });
});
