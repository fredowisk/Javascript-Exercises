function DatabaseError(statement = "", message) {
  this.statement = statement;
  this.message = message;
}

const database = {
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

    const tables = {
      name: tableName,
      columns: parsedColumns,
      data: [],
    };

    return console.log(JSON.stringify(tables, undefined, "  "));
  },
  execute: function (statement) {
    if (statement.startsWith("create table")) {
      return this.createTable(statement);
    } else {
      throw new DatabaseError(statement, `Syntax error: '${statement}'`);
    }
  },
};

try {
  // console.log(JSON.stringify(database.execute("create table author (id number, name string, age number, city string, state string, country string)")));
  console.log(JSON.stringify(database.execute("select id, name from author")));
} catch ({ message }) {
  console.log(message);
}
