import { Executor, GraphQLResponse, GraphQLRequest } from "./Request";
import fetch from "isomorphic-fetch";

/**
 * A mock type to represent a fetch function. This should correspond to the browser fetch signature.
 * You can use this to make your own fetch functionality.
 * 
 * @param url the url to fetch from.
 * @param options the options that go into the fetch function
 * @returns the response for the fetch call
 * 
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch}
 */
export type Fetcher = (url: string, options?: Object) => Promise<any>;

/**
 * An executor that performs a "simple" Fetch Request. This Executor will not do any authentication
 * or pass any headers aside from Content-Type. This Fetcher also assumes that your GraphQL API uses
 * `POST` vs `GET`.
 */
export class FetchExecutor implements Executor {

  /**
   * @constructor
   * @param url the URL of the graphql endpoint
   * @param fetcher the fetcher to use.
   */
  constructor(private readonly url: string, private fetcher: Fetcher) {
    this.execute = this.execute.bind(this);
  }

  /**
   * Executes a basic fetch request to the graphQL endpoint you defined at construction using POST.
   * 
   * @param req the GraphQLRequest to use. 
   * 
   * @returns the response from the GraphQL server.
   */
  public async execute<T>(req: GraphQLRequest): Promise<GraphQLResponse<T>> {
    const resp = await this.fetcher(this.url, {
      method: "POST",
      body: req.toString(),
      headers: {
        "Content-Type": "Application/json",
      }
    });
    try {
      const json = await resp.json();
      if (!resp.ok) {
        console.error(`GraphQL Error(${resp.status} response code):`, json);
      }
      return json;
    } catch (e) {
      console.error("integration Error:", e);
      throw e;
    }
  }
}

/**
 * An endpoint string tag to allow easy creation of a FetchExecutor given only the URL. Use this if
 * you are prototyping a graphQL client, or don't need authentication.
 * 
 * @param {TemplateStringsArray} url the parts broken up by the interpolated params
 * @param {String[]} params the params passed into the template.
 * 
 * @returns a FetchExecutor that relies on the global Fetch implementation. You're fine if you are
 * using the browser, but if you are using this in node, you should install isomorphic-fetch or make
 * a fetch implementation global.
 * 
 * @example
 *  endpoint`https://nope.com/graphql` // returns a FetchExecutor that will send requests to "https://nope.com/graphql"
 */
export const endpoint = (url: TemplateStringsArray, ...params: String[]) => {
  const result = [];
  for (let i = 0; i < url.length; i++) {
    result.push(url[i], params[i]);
  }
  if (url.length > 1) {
    result.push(url[url.length - 1]);
  }
  return new FetchExecutor(result.join(""), fetch);
};