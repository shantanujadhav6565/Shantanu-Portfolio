const dns = require("dns");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");

require("dotenv").config();

// =====================================================
// ROUTES
// =====================================================

const contactRoutes = require("./routes/contact");
const adminRoutes = require("./routes/admin");

// =====================================================
// DNS CONFIGURATION
// =====================================================

dns.setServers([
    "8.8.8.8",
    "1.1.1.1"
]);

// =====================================================
// EXPRESS APP
// =====================================================

const app = express();

// =====================================================
// PORT
// =====================================================

const PORT = process.env.PORT || 3000;

// =====================================================
// MONGODB CONNECTION
// =====================================================

mongoose
    .connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 15000
    })
    .then(() => {

        console.log("========================================");
        console.log("✅ MongoDB Connected Successfully!");
        console.log("========================================");

        console.log("Host:", mongoose.connection.host);
        console.log("Database:", mongoose.connection.name);

    })
    .catch((err) => {

        console.error(
            "\n================ MONGODB ERROR ================\n"
        );

        console.error("Message:");
        console.error(err.message);

        console.error("\nName:");
        console.error(err.name);

        console.error("\nReason:");
        console.error(err.reason);

        console.error(
            "\n=================================================\n"
        );

    });

// =====================================================
// MIDDLEWARE
// =====================================================

// Parse HTML form data
app.use(
    express.urlencoded({
        extended: true
    })
);

// Parse JSON data
app.use(express.json());

// Serve static files
app.use(
    express.static(
        path.join(__dirname, "public")
    )
);

// =====================================================
// SESSION
// =====================================================

app.use(
    session({
        secret:
            process.env.SESSION_SECRET ||
            "portfolio_secret_key",

        resave: false,

        saveUninitialized: false,

        cookie: {
            maxAge: 1000 * 60 * 60 * 2
        }
    })
);

// =====================================================
// EJS CONFIGURATION
// =====================================================

app.set(
    "view engine",
    "ejs"
);

app.set(
    "views",
    path.join(__dirname, "views")
);

// =====================================================
// HOME ROUTE
// =====================================================

app.get("/", (req, res) => {

    const success =
        req.query.success === "true";

    const error =
        req.query.error || null;

    res.render("index", {
        success,
        error
    });

});

// =====================================================
// CONTACT ROUTES
// =====================================================

app.use(
    "/contact",
    contactRoutes
);

// =====================================================
// ADMIN ROUTES
// =====================================================

app.use(
    "/admin",
    adminRoutes
);

// =====================================================
// 404 ROUTE
// =====================================================

app.use((req, res) => {

    res.status(404).send(
        "Page Not Found"
    );

});

// =====================================================
// GLOBAL ERROR HANDLER
// =====================================================

app.use((err, req, res, next) => {

    console.error("========================================");
    console.error("❌ GLOBAL SERVER ERROR");
    console.error("========================================");

    console.error(err);

    res.status(500).send(
        "Internal Server Error"
    );

});

// =====================================================
// SERVER
// =====================================================

app.listen(PORT, () => {

    console.log("========================================");
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log("========================================");

});