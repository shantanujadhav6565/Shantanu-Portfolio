require("dotenv").config();

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  console.log("MONGO_URI NOT FOUND");
  process.exit(1);
}

try {
  const parsed = new URL(mongoUri);

  console.log("MongoDB URI CHECK");
  console.log("-----------------");
  console.log("Protocol :", parsed.protocol);
  console.log("Hostname :", parsed.hostname);
  console.log("Username :", parsed.username);
  console.log("Password :", parsed.password ? "********" : "NOT SET");
  console.log("Database :", parsed.pathname);
} catch (error) {
  console.log("Invalid MONGO_URI");
  console.log(error.message);
}