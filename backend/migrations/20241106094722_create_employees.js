exports.up = function (knex) {
  return knex.schema.createTable("employees", (table) => {
    table.increments("id");
    table.string("fullname").notNullable();
    table.string("email").notNullable().unique();
    table.string("tel").notNullable();
    table.string("address").notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("employees");
};
