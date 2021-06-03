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

    return console.log(JSON.stringify(this.tables, undefined, "  "));
  },
  insert: function (statement) {
    let [_,tableName, columns, values] = statement.match(
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

    return console.log(JSON.stringify(this.tables, undefined, "  "));
  },
  execute: function (statement) {
    if (statement.startsWith("create table")) {
      return this.createTable(statement);
    } else if (statement.startsWith("insert into")) {
      return this.insert(statement);
    } else {
      throw new DatabaseError(statement, `Syntax error: '${statement}'`);
    }
  },
};

try {
  database.execute(
    "create table author (id number, name string, age number, city string, state string, country string)"
  );
  // console.log(JSON.stringify(database.execute("select id, name from author")));
  database.execute(
    "insert into author (id, name, age) values (1, Douglas Crockford, 62)"
  );
  database.execute(
    "insert into author (id, name, age) values (2, Linus Torvalds, 47)"
  );
  database.execute(
    "insert into author (id, name, age) values (3, Martin Fowler, 54)"
  );
} catch ({ message }) {
  console.log(message);
}
