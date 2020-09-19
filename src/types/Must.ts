import { GraphQLType, GraphQLValue, deriveType, getValue } from "./types";

/**
 * Must represents a value that must be defined. This will throw an error on an undefined or null error.
 */
export class Must implements GraphQLType, GraphQLValue {
  constructor(private val: any) {
    this.getGraphQLType = this.getGraphQLType.bind(this);
    this.getGraphQLValue = this.getGraphQLValue.bind(this);
  }

  public getGraphQLType(): string {
    return `${deriveType(this.val)}!`
  }

  public getGraphQLValue() {
    if (this.val === null || this.val === undefined) {
      throw new Error("Must must not be a null or undefined value.");
    }
    return getValue(this.val);
  }
}

export default (value: any) => {
  return new Must(value);
}