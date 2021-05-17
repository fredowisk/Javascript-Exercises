const command =
  "create table author (id number, name string, age number, city string, state string, country string)";

const tableName = command.match(/table (\w+) /)[1];

const columns = command.match(/\((.+)\)/)[1].split(", ");

let parsedColumns = {};

for (let key in columns) {
  const [newArray, newArray2] = columns[key].split(" ");

  Object.assign(parsedColumns, {
    [newArray]: newArray2,
  });
}

const database = {
  tables: {
    name: tableName,
    columns: parsedColumns,
    data: [],
  },
};

console.log(JSON.stringify(database, undefined, "  "));
