import { GraphQLType, GraphQLValue, deriveType, getValue } from "./types";

/**
 * Must represents a value that must be defined. This will throw an error on an undefined or null error.
 */
export class Array implements GraphQLType, GraphQLValue {
  constructor(private val: any[]) {
    this.getGraphQLType = this.getGraphQLType.bind(this);
    this.getGraphQLValue = this.getGraphQLValue.bind(this);
  }

  public getGraphQLType(): string {
    return `[${deriveType(this.val[0])}]`;
  }

  public getGraphQLValue() {
    return this.val.map((value) => getValue(value));
  }
}

export default (value: any[]) => {
  return new Array(value);
}