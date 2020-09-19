
/**
 * GraphQLRequest represents a request to be made to a graphql API
 */
export interface GraphQLRequest {
  /**
   * @returns the json object of the GraphQL response that should be sent to the server
   */
  toJson: () => { query: String, variables: any, operationName?: String }
  /**
   * Converts the JSON object to a string
   * 
   * @returns the JSON stringified object
   */
  toString: () => String;
  /**
   * Converts the GraphQL request to a query string representation
   * 
   * @returns the query string of the request
   */
  toQueryString: () => String;
}

/**
 * The GraphQLResponse is the response from the server. `data` contains the data from the server,
 * where errors will be the errors if any
 */
export interface GraphQLResponse<T> {
  data: T;
  errors?: GraphQLError,
}

/**
 * GraphQLError is the error that the GraphQL server could return
 */
export interface GraphQLError {
  message: String;
  extensions: any;
}

/**
 * Executor is an object that can take a request and execute it against an API.
 */
export interface Executor {
  /**
   * Execute the query against the defined executor. That is, send the request to the API, and get
   * its response. You can define your own executors to do all sorts of transformations before and
   * after the actual requests. 
   * 
   * @param {GraphQLRequest} query The query to execute
   * 
   * @returns the response from the graphQL Server
   */
  execute<TResponse>(query: GraphQLRequest): Promise<GraphQLResponse<TResponse>>;
}