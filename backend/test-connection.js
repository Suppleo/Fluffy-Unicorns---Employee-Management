require("dotenv").config();
const knexConfig = require("./knexfile");

async function testConnection() {
  const env = process.env.NODE_ENV || "development";
  console.log(`Testing ${env} connection...`);

  const knex = require("knex")(knexConfig[env]);

  try {
    // Test connection
    await knex.raw("SELECT NOW()");
    console.log("Database connection successful!");

    // Count employees
    const employeeCount = await knex("employees").count("id as count").first();
    console.log(`Number of employees: ${employeeCount.count}`);

    // Count users
    const userCount = await knex("users").count("id as count").first();
    console.log(`Number of users: ${userCount.count}`);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await knex.destroy();
  }
}

testConnection();
