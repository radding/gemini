import { deriveType, getValue } from "../../types/types";

describe("deriveType", () => {
  it("can derive the type of a boolean appropriately", () => {
    expect(deriveType(true)).toBe("Boolean");
    expect(deriveType(false)).toBe("Boolean");
    let someBool: Boolean = true;

    expect(deriveType(someBool)).toBe("Boolean");
    someBool = false;
    expect(deriveType(someBool)).toBe("Boolean");
  });

  it("can get the type of strings", () => {
    expect(deriveType("foo")).toBe("String");
  });

  it("can get the type of numbers", () => {
    expect(deriveType(1)).toBe("Int");
    expect(deriveType(1.5)).toBe("Float");
  });

  it("can get the type from a GraphQLType", () => {
    const MockGraphQLValue = {
      getGraphQLType: jest.fn(() => "Example"),
    };
    expect(deriveType(MockGraphQLValue)).toEqual("Example");
    expect(MockGraphQLValue.getGraphQLType).toBeCalled();
  });

  it("Throw an error if the type can't be defined", () => {
    expect(() => deriveType({} as any)).toThrow();
  })

  it("passing null or undefined throws an error", () => {
    expect(() => deriveType(null)).toThrow();
    expect(() => deriveType(undefined)).toThrow();
  });
});

describe("getValue", () => {
  it("gets a scalar value just fine", () => {
    expect(getValue("foo")).toEqual("foo");
    expect(getValue(1)).toEqual(1);
  });
  it("returns null for undefined", () => {
    expect(getValue(undefined)).toBeNull();
    const foo = undefined;
    expect(getValue(foo)).toBeNull();
  });
  it("works for a GraphQLValue", () => {
    const MockGraphQLValue = {
      getGraphQLValue: jest.fn(() => "Example"),
    };
    expect(getValue(MockGraphQLValue)).toEqual("Example");
    expect(MockGraphQLValue.getGraphQLValue).toBeCalled();
  });
});
