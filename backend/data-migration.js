require("dotenv").config();
const knexConfig = require("./knexfile");

async function migrateData() {
  // Source (local) database
  const sourceDb = require("knex")(knexConfig.development);

  // Target (Neon) database
  const targetDb = require("knex")(knexConfig.production);

  try {
    // Migrate employees
    console.log("Fetching employees from local database...");
    const employees = await sourceDb("employees").select("*");

    if (employees.length > 0) {
      console.log(`Migrating ${employees.length} employees...`);
      await targetDb("employees").insert(employees);
    }

    // Migrate users
    console.log("Fetching users from local database...");
    const users = await sourceDb("users").select("*");

    if (users.length > 0) {
      console.log(`Migrating ${users.length} users...`);
      await targetDb("users").insert(users);
    }

    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await sourceDb.destroy();
    await targetDb.destroy();
  }
}

migrateData();
