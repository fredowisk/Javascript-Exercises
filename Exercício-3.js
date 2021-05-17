const command =
  "create table author (id number, name string, age number, city string, state string, country string)";

const database = {
  createTable(command) {
    const tableName = command.match(/table (\w+) /)[1];

    const columns = command.match(/\((.+)\)/)[1].split(", ");

    let parsedColumns = {};

    for(let key in columns) {
      const [newArray, newArray2] = columns[key].split(" ");

      Object.assign(parsedColumns, {
        [newArray]: newArray2,
      });
    }

    const tables = {
      name: tableName,
      columns: parsedColumns,
      data: [],
    }

    return console.log(JSON.stringify(tables, undefined, "  "));
  },
  execute() {
    if(command.startsWith("create table"))
      return this.createTable(command)
    else
      return console.log('Erro!');
  }
}

database.execute()