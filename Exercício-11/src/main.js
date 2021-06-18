import Database from "./database.js";

try {
  const database = new Database();

  database
    .execute(
      "create table author (id number, name string, age number, city string, state string, country string)"
    )
    .then((result) => {
      console.log(result);
    })
    .catch((e) => {
      console.log(e);
    });

  Promise.all([
    database.execute(
      "insert into author (id, name, age) values (1, Douglas Crockford, 62)"
    ),

    database.execute(
      "insert into author (id, name, age) values (2, Linus Torvalds, 47)"
    ),

    database.execute(
      "insert into author (id, name, age) values (3, Martin Fowler, 54)"
    ),
  ])
    .then((result) => {
      console.log(result);
    })
    .catch((e) => {
      console.log(e);
    });

  database
    .execute("select name, age from author")
    .then((result) => {
      console.log(JSON.stringify(result, undefined, "  "));
    })
    .catch((e) => {
      console.log(e);
    });
} catch (e) {
  console.log(
    "Ocorreu um erro, verifique se o comando informado está correto",
    e
  );
}
