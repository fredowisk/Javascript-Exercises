export default class Parser {
  constructor() {
    this.commands = new Map([
      ["create", /(\w+) table (\w+) \((.+)\)/],
      ["insert", /(\w+) into (\w+) \((.+)\) values \((.+)\)/],
      ["select", /(\w+) (.+) from (\w+)(?: where (\w+) = (.+))?/],
      ["delete", /(\w+) from (\w+)(?: where (\w+) = (.+))?/],
    ]);
  }

  parse(statement) {
    for (let [name, regexp] of this.commands) {
      const operation = statement.match(regexp);
      if (operation) {
        const [_, ...rest] = operation;
        return {
          command: name,
          parsedStatement: rest,
        };
      }
    }
  }
}