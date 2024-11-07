const bcrypt = require("bcrypt");

exports.seed = function (knex) {
  return knex("users")
    .del()
    .then(async function () {
      const hashedPassword = await bcrypt.hash("admin", 10);
      return knex("users").insert([
        {
          username: "admin",
          password: hashedPassword,
        },
      ]);
    });
};
