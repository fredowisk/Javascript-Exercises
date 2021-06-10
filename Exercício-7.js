function DatabaseError(statement = "", message) {
  this.statement = statement;
  this.message = message;
}

const database = {
  tables: {
    data: [],
  },
  create: function (statement) {
    const tableName = statement.match(/table (\w+)/)[1];

    const columns = statement.match(/\((.+)\)/)[1].split(", ");

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

    if (this.tables[tableName]) {
      this.tables[tableName].data.push(row);
    } else {
      throw new DatabaseError(statement, `Table ${tableName} does not exist`);
    }
  },
  select: function (statement) {
    let [_, columns, tableName, columnWhere, columnValue] = statement.match(
      /select (.+) from (\w+)(?: where (\w+) = (.+))?/
    );

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

    table.data.push(result);
  },
  delete: function (statement) {
    let [_, tableName, columnWhere, columnValue] = statement.match(
      /delete from (\w+)(?: where (\w+) = (.+))?/
    );

    const table = this.tables[tableName];

    if (columnWhere) {
      table.data = table.data.filter(
        (item) => item[columnWhere] !== columnValue
      );
    } else {
      table.data = [];
    }
  },
  execute: function (statement) {
    const [_, operation] = statement.match(/(\w+) /);
    if (operation) {
      return this[operation](statement);
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

  database.execute("delete from author where id = 2");

  database.execute("select name, age from author");
  console.log(JSON.stringify(database, undefined, "  "));
} catch (e) {
  console.log("Ocorreu um erro, verifique se o comando informado está correto");
}
