const command =
  "create table author (id number, name string, age number, city string, state string, country string)";

const tableName = command.match(/table (\w+)/)[1];

console.log(`"${tableName}"`);

const columns = command.match(/\((.+)\)/)[1].split(", ");

console.log(columns);
