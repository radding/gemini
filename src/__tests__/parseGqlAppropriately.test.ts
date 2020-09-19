import { gql } from "../query";
import { RemoveWhiteSpace } from "./utils";


describe("the query tag", () => {
  it("Adds the variables in the front", () => {
    let nameThing = "foobar";
    let page = 1;
    let que = gql`{
        someExampleQuery(someOption: ${nameThing}, nameThing: ${page}) {
          hello
        }
      }`;
    expect(que).not.toBeUndefined();
    let q = que.toJson();
    expect(RemoveWhiteSpace(q.query)).toEqual(RemoveWhiteSpace(`
        query($variable0: String, $variable1: Int) {
          someExampleQuery(someOption: $variable0, nameThing: $variable1) {
            hello
          }
        }
      `));
    expect(q.variables).toEqual({
      "variable0": nameThing,
      "variable1": page,
    });
    expect(true).toBeTruthy();

    nameThing = "foobar";
    page = 1;
    que = gql.query`{
        someExampleQuery(someOption: ${nameThing}, nameThing: ${page}) {
          hello
        }
      }`;
    expect(que).not.toBeUndefined();
    q = que.toJson();
    expect(RemoveWhiteSpace(q.query)).toEqual(RemoveWhiteSpace(`
        query($variable0: String, $variable1: Int) {
          someExampleQuery(someOption: $variable0, nameThing: $variable1) {
            hello
          }
        }
      `));
    expect(q.variables).toEqual({
      "variable0": nameThing,
      "variable1": page,
    });
    expect(true).toBeTruthy();
  });

  it("works for mutations", () => {
    const nameThing = "foobar";
    const page = 1;
    const que = gql.mutation`{
        someExampleQuery(someOption: ${nameThing}, nameThing: ${page}) {
          hello
        }
      }`;
    expect(que).not.toBeUndefined();
    const q = que.toJson();
    expect(RemoveWhiteSpace(q.query)).toEqual(RemoveWhiteSpace(`
        mutation($variable0: String, $variable1: Int) {
          someExampleQuery(someOption: $variable0, nameThing: $variable1) {
            hello
          }
        }
      `));
    expect(q.variables).toEqual({
      "variable0": nameThing,
      "variable1": page,
    });
    expect(true).toBeTruthy();
  });

  it("works with helper functions", () => {
    const val = gql.query`{
      someExampleQuery(boo: ${gql.Must("1234")}) {
        xxxx
      }
    }`;
    const q = val.toJson();
    expect(RemoveWhiteSpace(q.query)).toEqual(RemoveWhiteSpace(`
        query($variable0: String!) {
          someExampleQuery(boo: $variable0) {
           xxxx 
          }
        }
      `));
    expect(q.variables).toEqual({
      "variable0": "1234",
    });
  });
});
