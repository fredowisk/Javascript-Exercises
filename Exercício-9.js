class DatabaseError {
  constructor(statement = "", message) {
    this.statement = statement;
    this.message = message;
  }
}

class Parser {
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

class Database {
  constructor() {
    this.tables = {
      data: [],
    };
    this.parser = new Parser();
  }

  create(parsedStatement) {
    let [_, tableName, columns] = parsedStatement;

    columns = columns.split(", ");

    let parsedColumns = {};

    for (let key in columns) {
      const [columnName, columnType] = columns[key].split(" ");

      Object.assign(parsedColumns, {
        [columnName]: columnType,
      });
    }

    this.tables[tableName] = {
      columns: parsedColumns,
      data: [],
    };
  }

  insert(parsedStatement) {
    let [_, tableName, columns, values] = parsedStatement;

    columns = columns.split(", ");
    values = values.split(", ");

    let row = {};

    for (let key in columns) {
      Object.assign(row, {
        [columns[key]]: values[key],
      });
    }

    this.tables[tableName].data.push(row);
  }

  select(parsedStatement) {
    let [_, columns, tableName, columnWhere, columnValue] = parsedStatement;

    const table = this.tables[tableName];

    columns = columns.split(", ");

    let result = table.data;

    if (columnWhere) {
      result = result.filter((item) => item[columnWhere] === columnValue);

      if (!result)
        throw new DatabaseError(
          statement,
          `O valor ${columnWhere} = ${columnValue} não existe`
        );
    }

    result = result.map((row) => {
      let newResult = {};
      columns.forEach((column) => {
        newResult[column] = row[column];
      });
      return newResult;
    });

    return result;
  }

  delete(parsedStatement) {
    let [_, tableName, columnWhere, columnValue] = parsedStatement;

    const table = this.tables[tableName];

    if (columnWhere) {
      table.data = table.data.filter(
        (item) => item[columnWhere] !== columnValue
      );
    } else {
      table.data = [];
    }
  }

  execute(statement) {
    const { command, parsedStatement } = this.parser.parse(statement);
    if (command) {
      return this[command](parsedStatement);
    } else {
      throw new DatabaseError(statement, `Syntax error: '${statement}'`);
    }
  }
}


try {
  const database = new Database();
  database.execute(
    "create table author (id number, name string, age number, city string, state string, country string)"
  );
  database.execute(
    "insert into author (id, name, age) values (1, Douglas Crockford, 62)"
  );
  database.execute(
    "insert into author (id, name, age) values (2, Linus Torvalds, 47)"
  );
  database.execute(
    "insert into author (id, name, age) values (3, Martin Fowler, 54)"
  );

  database.execute("delete from author where id = 2");

  console.log(
    JSON.stringify(
      database.execute("select name, age from author"),
      undefined,
      "  "
    )
  );
} catch (e) {
  console.log("Ocorreu um erro, verifique se o comando informado está correto");
}
