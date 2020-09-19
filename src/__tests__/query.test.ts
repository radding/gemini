import { GraphQLQuery } from "../query";
import { Executor } from "../Request";
import { gql } from "../query";

describe("The Query object", () => {
  it("Goes to json correctly", () => {
    const q = new GraphQLQuery(null, "foo", {});
    expect(q.toJson()).toBeDefined();
    expect(q.toJson().query).toEqual("foo");
    expect(q.toJson().variables).toEqual({});
  });

  it("Goes to string correctly", () => {
    const q = new GraphQLQuery(null, "foo", { "ll": { value: "112", type: "string" } });
    expect(q.toString()).toBeDefined();
    expect(q.toString()).toEqual(JSON.stringify({ query: "foo", variables: { "ll": "112" } }));
  });

  it("Goes to query string correctly", () => {
    const q = new GraphQLQuery(null, "foo", { "ll": { value: "112", type: "string" } });
    expect(q.toQueryString()).toBeDefined();
    expect(q.toQueryString()).toEqual(`query=foo&variables=${encodeURIComponent(JSON.stringify({ "ll": "112" }))}`);
  });

  it("Throws on execute when the executor is null", async () => {
    const q = new GraphQLQuery(null, "foo", { "ll": { value: "112", type: "string" } });
    return expect(q.execute()).rejects.toThrow();
  })

  it("calls the executor properly", async () => {
    const mockExecutor = {
      execute: jest.fn(() => Promise.resolve({ foo: 1 })),
    } as any as Executor;
    const q = new GraphQLQuery(mockExecutor, "foo", { "ll": { value: "112", type: "string" } });
    await expect(q.execute()).resolves.toEqual({ foo: 1 });
    expect(mockExecutor.execute).toBeCalled();
    expect(mockExecutor.execute).toBeCalledWith(q);
  });

  it("returns the same query when it doesn't template", () => {
    const q = gql.query`blah`;
    const jsn = q.toJson();
    expect(jsn.query).toBe("blah");
    expect(jsn.variables).toEqual({});
  });

  it("throws an error on an undefined error", () => {
    expect(() => gql.query`{foo(boo: ${undefined}) {help }}`).toThrow();
  });
});