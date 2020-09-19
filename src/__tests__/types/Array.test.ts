import ArrayFn, { Array } from "../../types/Array";

describe("Array", () => {
  it("Works fine", () => {
    const arr = new Array(["1234", "abc", "defff"]);
    expect(arr.getGraphQLType()).toEqual("[String]");
    expect(arr.getGraphQLValue()).toEqual(["1234", "abc", "defff"]);
  });
  it("Works with the array fn", () => {
    const arr = ArrayFn(["1234", "abc", "defff"]);
    expect(arr.getGraphQLType()).toEqual("[String]");
    expect(arr.getGraphQLValue()).toEqual(["1234", "abc", "defff"]);
  })
})