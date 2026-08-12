// ========================================
// MongoDB Atlas Connection Test
// Portfolio Project
// ========================================

// ================= DNS FIX =================

const dns = require("dns");

dns.setServers([
    "8.8.8.8",
    "1.1.1.1"
]);

// ================= LOAD ENV =================

require("dotenv").config();

const mongoose = require("mongoose");

// ================= START =================

console.log("========================================");
console.log("MongoDB Atlas Connection Test");
console.log("========================================");

// ================= CHECK MONGO_URI =================

const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
    console.error("❌ MONGO_URI not found in .env");
    process.exit(1);
}

// ================= HIDE PASSWORD =================

const safeURI = mongoURI.replace(
    /:\/\/([^:]+):([^@]+)@/,
    "://$1:****@"
);

console.log("✅ MONGO_URI found in .env");

console.log("Connection URI:");
console.log(safeURI);

console.log("");

console.log("Connecting to MongoDB Atlas...");

// ================= CONNECT =================

mongoose
    .connect(mongoURI, {
        serverSelectionTimeoutMS: 15000
    })

    // ================= SUCCESS =================

    .then(() => {

        console.log("");
        console.log("========================================");
        console.log("✅ ATLAS CONNECTED SUCCESSFULLY!");
        console.log("========================================");

        console.log("Host:", mongoose.connection.host);

        console.log(
            "Database:",
            mongoose.connection.name
        );

        console.log(
            "Ready State:",
            mongoose.connection.readyState
        );

        console.log("");

        console.log("MongoDB connection is working correctly.");

        console.log("========================================");

        // Close connection after successful test
        return mongoose.connection.close();
    })

    // ================= CONNECTION CLOSED =================

    .then(() => {

        console.log("");
        console.log("🔌 MongoDB connection closed.");
        console.log("Test completed successfully.");

        process.exit(0);
    })

    // ================= ERROR =================

    .catch((err) => {

        console.log("");
        console.log("========================================");
        console.log("❌ MONGODB ATLAS CONNECTION FAILED!");
        console.log("========================================");

        console.log("");

        console.log("Error Name:");
        console.log(err.name);

        console.log("");

        console.log("Error Message:");
        console.log(err.message);

        console.log("");

        console.log("Full Error:");
        console.log(err);

        console.log("");

        console.log("========================================");
        console.log("Possible reasons:");
        console.log("========================================");

        console.log("1. MongoDB username/password is incorrect");
        console.log("2. IP address is not allowed in Atlas");
        console.log("3. MongoDB user has insufficient permissions");
        console.log("4. Network/DNS problem");
        console.log("5. Password contains special characters");
        console.log("6. Atlas cluster is unavailable");

        console.log("========================================");

        process.exit(1);
    });