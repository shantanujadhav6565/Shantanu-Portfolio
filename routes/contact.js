const express = require("express");
const router = express.Router();

const Contact = require("../models/Contact");

// ================= CONTACT FORM SUBMIT =================

router.post("/", async (req, res) => {
    try {

        const { name, email, subject, message } = req.body;

        // ================= VALIDATION =================

        if (!name || !email || !message) {

            return res.redirect(
                "/?error=Name%2C%20Email%20and%20Message%20are%20required."
            );

        }

        // ================= CREATE CONTACT =================

        const newContact = new Contact({
            name: name.trim(),
            email: email.trim(),
            subject: subject ? subject.trim() : "",
            message: message.trim()
        });

        // ================= SAVE TO MONGODB =================

        await newContact.save();

        console.log("========================================");
        console.log("✅ Contact message saved successfully!");
        console.log("========================================");

        // ================= SUCCESS =================

        res.redirect("/?success=true");

    } catch (error) {

        console.error("========================================");
        console.error("❌ Contact form error:");
        console.error(error);
        console.error("========================================");

        // ================= ERROR =================

        res.redirect(
            "/?error=Something%20went%20wrong.%20Please%20try%20again."
        );
    }
});

module.exports = router;