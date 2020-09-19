import TypeFn, { Type } from "./Type"
import Array from "./Array";
import Must from "./Must";
import { GraphQLValue, GraphQLType } from "./types";

type GraphQLTypeDef = GraphQLValue & GraphQLType;

export interface TypeFunctions {
  Int: (val: number) => GraphQLTypeDef,
  Float: (value: number) => GraphQLTypeDef,
  ID: (value: string) => GraphQLTypeDef,
  String: (value: string) => GraphQLTypeDef,
  Enum: (value: string, type: string) => GraphQLTypeDef,
  Type: (value: string, type: string) => GraphQLTypeDef,
  Array: (value: any[]) => GraphQLTypeDef,
  Must: (Value: any) => GraphQLTypeDef,
}

export default {
  Int: (value: number) => {
    if (value % 1 !== 0) {
      throw new TypeError(`${value} must be a whole number`);
    }
    return new Type("Int", value);
  },
  Float: (value: number) => new Type("Float", value),
  ID: (value: string) => new Type("ID", value),
  String: (value: string) => new Type("String", value),
  Enum: TypeFn,
  Type: TypeFn,
  Array,
  Must,
} as TypeFunctions;
