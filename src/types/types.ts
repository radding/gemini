
export interface GraphQLType {
  getGraphQLType(): String;
}

export interface GraphQLValue {
  getGraphQLValue(): any;
}

const toString = Object.prototype.toString;

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
/* istanbul ignore next */
function getTag(value: any) {
  if (value == null) {
    return value === undefined ? '[object Undefined]' : '[object Null]';
  }
  return toString.call(value);
}

const isString = (value: any) => {
  const type = typeof value
  return type === 'string' || (type === 'object' && value != null && !Array.isArray(value) && getTag(value) == '[object String]')
}

/**
 * deriveType attempts to coerce a thing to to a graphQL type. The easies way to do this is to pass
 * in a GraphQLType object, if a scalar type is passed in it will try to guess what the scalar is. 
 * @param thing the thing to get the type of
 * 
 * @returns a string denoting the graphql type
 * 
 * @throws a TypeError if no type can be defined
 */
export const deriveType = (thing?: GraphQLType | Boolean | Number | String | null) => {
  if (thing === undefined || thing === null) {
    throw new Error("Type is undefined or null, please use an explicit graphql type instead");
  }
  if (thing.hasOwnProperty("getGraphQLType")) {
    return (thing as GraphQLType).getGraphQLType();
  }
  if (isString(thing)) {
    return "String";
  }
  switch (typeof thing) {
    case "boolean":
      return "Boolean";
    case "number": {
      let n = (thing as number);
      if (n % 1 !== 0) {
        return "Float";
      }
      return "Int"
    }
    default:
      throw new TypeError(`Type ${typeof thing} cannot be coerced to graphQL type`);
  }
}

/**
 * Get value gets the graphql value for the value
 * @param value the value to get the value fo
 * 
 * @return null if the value is undefined or value
 */
export const getValue = (value: any) => {
  if (value === undefined) {
    return null; // Always return a value GraphQL understands
  }
  if (value.hasOwnProperty("getGraphQLValue")) {
    return value.getGraphQLValue();
  }
  return value;
}