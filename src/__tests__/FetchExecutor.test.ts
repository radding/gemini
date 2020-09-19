import { FetchExecutor, endpoint } from "../FetchExecutor";

describe("The Fetch Executor", () => {
  it("builds just fine", () => {
    const fetcher = new FetchExecutor("https://nope.com", () => Promise.resolve(1));
    expect(fetcher.execute).toBeDefined();
    expect(fetcher).toBeDefined();
  });

  it("calls the fetcher correctly", async () => {
    const json = jest.fn(() => Promise.resolve({ data: "foobar" }));
    const fetcher = jest.fn(() => Promise.resolve({
      ok: true,
      json,
    })) as any;
    const fetchExecutor = new FetchExecutor("https://nope.com", fetcher);
    const dummyGraphQLReq = {
      toString: () => "Blah!",
    } as any;
    const resp = await fetchExecutor.execute(dummyGraphQLReq);
    expect(resp.data).toBe("foobar");
    expect(fetcher).toBeCalled();
    expect(fetcher).toBeCalledWith("https://nope.com", {
      method: "POST",
      body: "Blah!",
      headers: {
        "Content-Type": "Application/json",
      }
    });
    expect(json).toBeCalled();
  });
  it("logs an error when the response is not ok", async () => {
    const err = console.error;
    console.error = jest.fn();
    const json = jest.fn(() => Promise.resolve({ data: "foobar" }));
    const fetcher = jest.fn(() => Promise.resolve({
      ok: false,
      json,
      status: 400,
    })) as any;
    const fetchExecutor = new FetchExecutor("https://nope.com", fetcher);
    const dummyGraphQLReq = {
      toString: () => "Blah!",
    } as any;
    await fetchExecutor.execute(dummyGraphQLReq);
    expect(console.error).toBeCalledWith("GraphQL Error(400 response code):", { data: "foobar" });
    console.error = err;
  });
  it("throws an error after logging when an error is thrown", async () => {
    const err = console.error;
    console.error = jest.fn();
    const fetcher = jest.fn(() => Promise.resolve({
      ok: false,
      status: 400,
    })) as any;
    const fetchExecutor = new FetchExecutor("https://nope.com", fetcher);
    const dummyGraphQLReq = {
      toString: () => "Blah!",
    } as any;
    await expect(fetchExecutor.execute(dummyGraphQLReq)).rejects.toBeDefined();
    expect(console.error).toBeCalledWith("integration Error:", expect.anything());
  });
});

describe("The Endpoint Template", () => {
  let fetch: any;
  let json: any;
  let realFetch = global.fetch;
  const dummyGraphQLReq = {
    toString: () => "Blah!",
  } as any;

  beforeEach(() => {
    json = jest.fn(() => Promise.resolve({ data: "foobar" }));
    fetch = jest.fn(() => Promise.resolve({
      ok: true,
      json,
    })) as any;
    global.fetch = fetch;
  });

  afterEach(() => {
    global.fetch = realFetch;
  });

  it("Can work with a normal string", async () => {
    const executor = endpoint`https://nope.com/graphql` as any;
    expect(executor).toBeTruthy();
    executor.fetcher = fetch;
    await executor.execute(dummyGraphQLReq);
    expect(fetch).toBeCalledWith("https://nope.com/graphql", {
      method: "POST",
      body: "Blah!",
      headers: {
        "Content-Type": "Application/json",
      }
    });
  });

  it("works with template strings", async () => {
    let graphql = "graphql"
    let executor = endpoint`https://nope.com/${graphql}` as any;
    expect(executor).toBeTruthy();
    executor.fetcher = fetch;
    await executor.execute(dummyGraphQLReq);
    expect(fetch).toBeCalledWith("https://nope.com/graphql", {
      method: "POST",
      body: "Blah!",
      headers: {
        "Content-Type": "Application/json",
      }
    });

    graphql = "graphql"
    const protocol = "https"
    executor = endpoint`${protocol}://nope.com/${graphql}` as any;
    expect(executor).toBeTruthy();
    executor.fetcher = fetch;
    await executor.execute(dummyGraphQLReq);
    expect(fetch).toBeCalledWith("https://nope.com/graphql", {
      method: "POST",
      body: "Blah!",
      headers: {
        "Content-Type": "Application/json",
      }
    });
  });
});