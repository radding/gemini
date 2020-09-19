import { GraphQLType, GraphQLValue } from "./types";

export class Type implements GraphQLType, GraphQLValue {
  constructor(private readonly type: string, private readonly value: any) {
    this.getGraphQLType = this.getGraphQLType.bind(this);
    this.getGraphQLValue = this.getGraphQLValue.bind(this);
  }

  getGraphQLValue() {
    return this.value;
  }

  getGraphQLType() {
    return this.type;
  }
}

export default (value: string, type: string) => {
  return new Type(type, value);
}