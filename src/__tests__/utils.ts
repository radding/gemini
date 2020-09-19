export const RemoveWhiteSpace = (str: String): String => {
  return str.replace(/\s+/g, '');
}

it("shuts jest up", () => {
  expect(true).toBeTruthy();
});