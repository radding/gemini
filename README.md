# Gemini

A tiny light weight GraphQL client.

## Installation

```bash
npm i gemini-graphql
```

## Getting Started

Gemini is a small, lightweight and easy to use GraphQL client. This library really is just a graphql query builder and one small fetch executor. This simplest program that you can make with Gemini is:

```typescript
import { endpoint, gql } from "gemini-graphql";

const client = endpoint`https://nope.com/graphql`;

client.execute(gql`{
    foobar(baz: ${1234}, bar: ${gql.Must(gql.Int(1234))}) {
        fiz
    }
}`) // shorthand for gql.query
```

This will do a simple `POST` request to the api endpoint at `https://nope.com/graphql` with the Application/json `Content-Type`.

## Core Concepts

This library splits the responsibilities of Graphql into two sides: an Executor that is responsible for taking a `GraphQLRequest` and sending it to the server. And the GraphqlRequest that is responsible for formatting the request properly. This library was heavily influenced by [Slonik](https://github.com/gajus/slonik).

## Executors

The Executors only job is to send the request to the server. The contract is intentionally small to make it easy for anybody to make their own executor. The only thing that an executor needs to implement is the `execute` function that takes a `GraphQLRequest` object. If you need to authentication, or you need to implement some other concerns (caching, or transforms or something), you should implement an executor.

```Typescript
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
```

### Built in Executor(`FetchExecutor`)

The only executor that is built in to Gemini is a simple one that assumes no authentication, your communication happens over `POST` and is built on top of `isomorphic-fetch` (will work in browser and in node). This Executor is good for most applications. If you need more functionality out of this, but don't necessarily want to go the whole way down to a new Executor, you could simply pass in a function that has the same contract as `fetch` (`(url: string, options?: Object) => Promise<{json: () => Promise<any>, ok: bool, status: number}>`). You can extend this function to perform authorization, do a `GET` request instead of post, etc.

This is the executor that `endpoint` returns wired up with the default fetch and the endpoint passed in. It will do string interpolation for you too so if you needed to template out the url, thats fine.

### Global executor

The default `gql` tag that you can import:

```typescript
import {gql} from "gemini-graphql";
```

returns a GraphQLRequest with a new function: `.execute`. This will actually use the global executor to execute the query if it is defined. If the global executor is null, and it is null by default, this call will blow up. If you want to use this functionality, the easiest way to set up the executor is by calling `SetExecutor`:

```typescript
import {gql, SetExecutor, endpoint} from "gemini-graphql";

const req = gql`{
    foobar {
        baz
    }
}`

req.execute(); // This will error out

SetExecutor(endpoint`https://nope.com/graphql`);

const req = gql`{
    foobar {
        baz
    }
}`

req.execute(); // This will work perfectly

```

## GraphQLRequest

The GraphQLRequest is an object that allows you to convert the request to something that the server will understand. It defines three methods: `toJson`, `toString`, and `toQueryString`.

`toJson` takes the request and converts it to the following object:

```typescript
    interface GraphQLJson {
        query: string; // the fully templated out string with variables and what not
        variables: {[key: string]: any}; // A key value store of objects that are the variables to use in this call.
    }
```

`toString` is the json serialized version of the object that `toJson` returns.

`toQueryString` is a function that takes the object and converts it to a querystring and URL encodes the Json serialized variables as well as the query string. This is useful for making `GET` requests for example.

## More docs

clone this repo and run JSDocs. for now

## Contributing

Feel free to open up an issue at [issues](https://github.com/radding/gemini/issues).

If you want to write some code, Pull Requests are welcome! Keep in mind that unit tests are required and coverage is enforced!
