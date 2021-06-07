function DatabaseError(statement = "", message) {
  this.statement = statement;
  this.message = message;
}

const database = {
  tables: {
    name: "",
    columns: {},
    data: [],
  },
  createTable: function (statement) {
    const tableName = statement.match(/table (\w+)/)[1];

    const columns = statement.match(/\((.+)\)/)[1].split(", ");

    let parsedColumns = {};

    for (let key in columns) {
      const [columnName, columnType] = columns[key].split(" ");

      Object.assign(parsedColumns, {
        [columnName]: columnType,
      });
    }

    this.tables = {
      name: tableName,
      columns: parsedColumns,
      data: [],
    };
  },
  insert: function (statement) {
    let [_, tableName, columns, values] = statement.match(
      /into (\w+) \((.+)\) values \((.+)\)/
    );

    columns = columns.split(", ");
    values = values.split(", ");

    let row = {};

    for (let key in columns) {
      Object.assign(row, {
        [columns[key]]: values[key],
      });
    }

    let { name, data } = this.tables;

    if (name === tableName) {
      data.push(row);
    } else {
      throw new DatabaseError(statement, `Table ${tableName} does not exist`);
    }
  },
  select: function (statement) {
    let [_, columns, tableName, columnWhere, columnValue] = statement.match(
      /select (.+) from (\w+) where (\w+) = (\w+)/
    );

    columns = columns.split(", ");

    const result = this.tables.data.find(
      (item) => item[columnWhere] === columnValue
    );

    let { name, data } = this.tables;

    if (name === tableName) {
      let newResult = [];
      Object.keys(result).map((item) =>
        columns.includes(item)
          ? (newResult = {...newResult, [item]: result[item]})
          : ""
      );

      data.push(newResult);
    } else {
      throw new DatabaseError(statement, `Table ${tableName} does not exist`);
    }
  },
  execute: function (statement) {
    if (statement.startsWith("create table")) {
      return this.createTable(statement);
    } else if (statement.startsWith("insert into")) {
      return this.insert(statement);
    } else if (statement.startsWith("select")) {
      return this.select(statement);
    } else {
      throw new DatabaseError(statement, `Syntax error: '${statement}'`);
    }
  },
};

try {
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

  database.execute("select name, age from author where id = 1");
  console.log(JSON.stringify(database, undefined, "  "));
} catch ({ message }) {
  console.log(message);
}
