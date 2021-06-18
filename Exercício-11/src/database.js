import Parser from "./parser.js";
import DatabaseError from "./databaseError.js";

export default class Database {
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

    return (this.tables[tableName] = {
      columns: parsedColumns,
      data: [],
    });
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

    return row;
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
    return new Promise((resolve, reject) => {
      if (!statement) return reject("Invalid statement");
      setTimeout(() => {
        const { command, parsedStatement } = this.parser.parse(statement);

        if (command) {
          resolve(this[command](parsedStatement));
        } else {
          throw new DatabaseError(statement, `Syntax error: '${statement}'`);
        }
      }, 1000);
    });
  }
}
