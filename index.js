const mongoose = require("mongoose");
require("dotenv").config();
const dataSeeder = require("./seed.json");

async function main() {
  /**--------------- Not allowed to be edited - start - --------------------- */
  const mongoUri = process.env.MONGODB_URI;
  const collection = process.env.MONGODB_COLLECTION;

  const args = process.argv.slice(2);

  const command = args[0];
  /**--------------- Not allowed to be edited - end - --------------------- */

  // Connect to MongoDB
  await mongoose.connect(mongoUri);

  // Define a schema for the collection
  const schema = new mongoose.Schema({}, { strict: false });
  const Model = mongoose.model(collection, schema);

  switch (command) {
    case "check-db-connection":
      await checkConnection();
      break;
    case "reset-db":
      await resetDb();
      break;
    case "bulk-insert":
      await bulkInsert();
      break;
    case "get-all":
      await getAll();
      break;
    default:
      throw Error("command not found");
  }

  await mongoose.disconnect();

  async function bulkInsert() {
    console.log("bulk insert started...");
    const bulk = Model.collection.initializeUnorderedBulkOp();
    dataSeeder.forEach((item) => {
      bulk.insert(item);
    });
    const result = await bulk.execute();
    console.log("bulk insert result:", result);

    if (result) {
      console.log("bulk insert success");
    } else {
      console.log("bulk insert failed");
    }
    console.log("bulk insert ended...");
  }

  async function resetDb() {
    console.log("reset db started...");
    const result = await Model.deleteMany({});
    if (result) {
      console.log("reset db success");
    } else {
      console.log("reset db failed");
    }
    console.log("reset db ended...");
  }

  async function getAll() {
    console.log("get all started...");
    const result = await Model.find({});
    console.log("get all result:", result);
    if (result) {
      console.log("get all success");
    } else {
      console.log("get all failed");
    }
    console.log("get all ended...");
  }

  return;
}

async function checkConnection() {
  console.log("check db connection started...");
  try {
    await mongoose.connection.db.admin().ping();
    console.log("MongoDB connection is successful!");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
  }
  console.log("check db connection ended...");
}

main();
