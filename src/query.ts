import { Executor, GraphQLResponse } from "./Request";
import { GraphQLType, deriveType, getValue } from "./types/types";
import Functions, { TypeFunctions } from "./types";

type _Tag = (queryString: TemplateStringsArray, ...params: any[]) => GraphQLQuery;
type Tag = _Tag & {
  mutation: _Tag;
  query: _Tag;
} & TypeFunctions;

interface GraphQLQueryJSON {
  query: string;
  variables: { [key: string]: any };
  operationName?: string;
}

/* istanbul ignore next */
export class ClientSetUpError extends Error {
  constructor(m: string) {
    super(m);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, ClientSetUpError.prototype);
  }
}

/**
 * GraphQLQuery Represents a GraphQL query execute
 */
export class GraphQLQuery {
  public constructor(
    private readonly executor: Executor | null,
    private readonly query: string,
    private readonly variables: { [name: string]: { value: any, type: String } },
  ) {
    this.toJson = this.toJson.bind(this);
    this.toQueryString = this.toQueryString.bind(this);
    this.toString = this.toString.bind(this);
  }

  public toJson(): GraphQLQueryJSON {
    return {
      query: this.query,
      variables: Object.keys(this.variables).reduce((acc, elem) => {
        acc[elem] = this.variables[elem].value;
        return acc;
      }, {} as { [key: string]: any }),
    };
  }

  public toString(): String {
    return JSON.stringify(this.toJson());
  }

  public toQueryString(): String {
    const json = this.toJson();
    return `query=${encodeURIComponent(json.query)}&variables=${encodeURIComponent(JSON.stringify(json.variables))}`;
  }

  /**
   * Execute the query using the defined executor. (either the default executor set up for your project or
   * specific tag)
   * 
   * @throws {ClientSetUpError} throws this error if the executor is null and you call this function
   * 
   * @returns the response from the server
   */
  public async execute<T = any>(): Promise<GraphQLResponse<T>> {
    if (this.executor === null) {
      throw new ClientSetUpError("No Executor is set. Define an executor like so: `SetExecutor(<Executor>). To see more go to: link`")
    }
    return this.executor.execute<T>(this);
  }
}


/**
 * This function will make a template literal that you can use to create graphQL queries.
 * 
 * @param executor The executor to use for this query tag. Any query generated by this query will use this executor
 * 
 * @returns a template tag to use for the query
 * 
 * @example
 * const fetchExecutor = endpoint`https://nope.com/graphql`;
 * const query = makeQueryTag(fetchExecutor);
 * const request = query`{
 *  exampleQuery(boo: ${someThing}) {
 *    message
 *  }
 * }`
 * const resp = request.execute();
 * console.log(resp.data.exampleQuery.message);
 */
export const makeQueryTag = (executor: Executor | null) => {
  const _makeTag = (type: string) => (queryString: TemplateStringsArray, ...params: any[]) => {
    const paramMap: { [name: string]: { value: any, type: String } } = {};
    if (queryString.length === 1) {
      return new GraphQLQuery(executor, queryString[0], {});
    }
    let result = [];
    let queryPart = [];
    for (let i = 0; i < queryString.length - 1; i++) {
      const type = deriveType(params[i]);
      const varName = `variable${i}`;
      let value = getValue(params[i]);
      paramMap[varName] = { type, value };
      result.push(queryString[i], `$${varName}`);
      queryPart.push(`$${varName}:${type}`);
    }
    result.push(queryString[queryString.length - 1]);
    result.unshift(`${type}(${queryPart.join()})`);
    const req = new GraphQLQuery(executor, result.join(""), paramMap);
    return req;
  }
  const tag = _makeTag("query") as Tag;
  tag.query = _makeTag("query");
  tag.mutation = _makeTag("mutation");
  Object.keys(Functions).forEach((name) => {
    tag[name as keyof TypeFunctions] = Functions[name as keyof TypeFunctions] as any;
  });
  return tag;
}

/**
 * Default gql tag. This creates a tag that allows you to create queries, so you either have to set the executor, or call the executor 
 * explicitly.
 * 
 * @example
 * gql.query`Name {
 *  fooBar(bar: ${bar}) {
 *    message
 *  }
 * }`;
 */
let gql = makeQueryTag(null);

/**
 * Sets the global Executor
 */
export const SetExecutor = (executor: Executor) => {
  /* istanbul ignore next */
  gql = makeQueryTag(executor);
}

export { gql };