const express = require("express");
const router = express.Router();

const Contact = require("../models/Contact");

// =====================================================
// NODEMAILER
// =====================================================

const nodemailer = require("nodemailer");

// =====================================================
// GMAIL TRANSPORTER
// =====================================================

const transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// =====================================================
// CHECK EMAIL CONFIGURATION
// =====================================================

transporter.verify((error, success) => {

    if (error) {

        console.error("========================================");
        console.error("❌ Gmail transporter error");
        console.error("========================================");
        console.error(error.message);
        console.error("========================================");

    } else {

        console.log("========================================");
        console.log("✅ Gmail transporter ready");
        console.log("========================================");

    }

});

// =====================================================
// ADMIN LOGIN PAGE
// =====================================================

router.get("/login", (req, res) => {

    // Already logged in
    if (req.session && req.session.isAdmin) {

        return res.redirect("/admin");

    }

    res.render("admin-login", {
        error: null
    });

});

// =====================================================
// ADMIN LOGIN
// =====================================================

router.post("/login", (req, res) => {

    try {

        const {
            username,
            password
        } = req.body;

        // =================================================
        // GET ADMIN CREDENTIALS
        // =================================================

        const adminUsername =
            process.env.ADMIN_USERNAME;

        const adminPassword =
            process.env.ADMIN_PASSWORD;

        // =================================================
        // CHECK CREDENTIALS
        // =================================================

        if (
            username === adminUsername &&
            password === adminPassword
        ) {

            // Create admin session
            req.session.isAdmin = true;

            console.log("========================================");
            console.log("✅ Admin login successful");
            console.log("========================================");

            return res.redirect("/admin");

        }

        // =================================================
        // INVALID LOGIN
        // =================================================

        console.log("❌ Invalid admin login");

        return res.render("admin-login", {

            error: "Invalid username or password."

        });

    } catch (error) {

        console.error("========================================");
        console.error("❌ Admin login error");
        console.error("========================================");
        console.error(error);
        console.error("========================================");

        return res.render("admin-login", {

            error:
                "Something went wrong. Please try again."

        });

    }

});

// =====================================================
// ADMIN DASHBOARD
// =====================================================

router.get("/", async (req, res) => {

    // =================================================
    // CHECK ADMIN SESSION
    // =================================================

    if (
        !req.session ||
        !req.session.isAdmin
    ) {

        return res.redirect("/admin/login");

    }

    try {

        // =================================================
        // GET ALL CONTACT MESSAGES
        // =================================================

        const contacts = await Contact
            .find()
            .sort({
                createdAt: -1
            });

        // =================================================
        // COUNTS
        // =================================================

        const totalMessages =
            contacts.length;

        const unreadCount =
            contacts.filter(
                contact => !contact.isRead
            ).length;

        const repliedCount =
            contacts.filter(
                contact => contact.isReplied === true
            ).length;

        const notRepliedCount =
            contacts.filter(
                contact => contact.isReplied !== true
            ).length;

        // =================================================
        // DEBUG
        // =================================================

        console.log("========================================");
        console.log("📊 ADMIN DASHBOARD");
        console.log("========================================");
        console.log("Total:", totalMessages);
        console.log("Unread:", unreadCount);
        console.log("Replied:", repliedCount);
        console.log("Pending:", notRepliedCount);
        console.log("========================================");

        // =================================================
        // RENDER DASHBOARD
        // =================================================

        return res.render("admin", {

            contacts,

            totalMessages,

            unreadCount,

            repliedCount,

            notRepliedCount,

            success:
                req.query.success || null,

            error:
                req.query.error || null

        });

    } catch (error) {

        console.error("========================================");
        console.error("❌ Admin dashboard error");
        console.error("========================================");
        console.error(error);
        console.error("========================================");

        return res.status(500).send(
            "Unable to load admin dashboard."
        );

    }

});

// =====================================================
// MARK MESSAGE AS READ
// =====================================================

router.post("/read/:id", async (req, res) => {

    // =================================================
    // CHECK ADMIN SESSION
    // =================================================

    if (
        !req.session ||
        !req.session.isAdmin
    ) {

        return res.redirect("/admin/login");

    }

    try {

        const contact =
            await Contact.findById(
                req.params.id
            );

        // =================================================
        // MESSAGE NOT FOUND
        // =================================================

        if (!contact) {

            return res.redirect(
                "/admin?error=Message%20not%20found"
            );

        }

        // =================================================
        // UPDATE
        // =================================================

        contact.isRead = true;

        await contact.save();

        console.log(
            "✅ Message marked as read:",
            req.params.id
        );

        return res.redirect(
            "/admin?success=Message%20marked%20as%20read"
        );

    } catch (error) {

        console.error(
            "❌ Mark as read error:",
            error
        );

        return res.redirect(
            "/admin?error=Unable%20to%20mark%20message%20as%20read"
        );

    }

});

// =====================================================
// MARK MESSAGE AS UNREAD
// =====================================================

router.post("/unread/:id", async (req, res) => {

    // =================================================
    // CHECK ADMIN SESSION
    // =================================================

    if (
        !req.session ||
        !req.session.isAdmin
    ) {

        return res.redirect("/admin/login");

    }

    try {

        const contact =
            await Contact.findById(
                req.params.id
            );

        // =================================================
        // MESSAGE NOT FOUND
        // =================================================

        if (!contact) {

            return res.redirect(
                "/admin?error=Message%20not%20found"
            );

        }

        // =================================================
        // UPDATE
        // =================================================

        contact.isRead = false;

        await contact.save();

        console.log(
            "✅ Message marked as unread:",
            req.params.id
        );

        return res.redirect(
            "/admin?success=Message%20marked%20as%20unread"
        );

    } catch (error) {

        console.error(
            "❌ Mark as unread error:",
            error
        );

        return res.redirect(
            "/admin?error=Unable%20to%20mark%20message%20as%20unread"
        );

    }

});

// =====================================================
// REPLY TO CONTACT MESSAGE
// =====================================================

router.post("/reply/:id", async (req, res) => {

    // =================================================
    // CHECK ADMIN SESSION
    // =================================================

    if (
        !req.session ||
        !req.session.isAdmin
    ) {

        return res.redirect("/admin/login");

    }

    try {

        // =================================================
        // GET REPLY DATA
        // =================================================

        const {
            subject,
            message
        } = req.body;

        // =================================================
        // VALIDATE MESSAGE
        // =================================================

        if (
            !message ||
            !message.trim()
        ) {

            return res.redirect(
                "/admin?error=Reply%20message%20cannot%20be%20empty"
            );

        }

        // =================================================
        // FIND CONTACT
        // =================================================

        const contact =
            await Contact.findById(
                req.params.id
            );

        // =================================================
        // CONTACT NOT FOUND
        // =================================================

        if (!contact) {

            return res.redirect(
                "/admin?error=Original%20message%20not%20found"
            );

        }

        // =================================================
        // CHECK EMAIL
        // =================================================

        if (
            !contact.email ||
            !contact.email.trim()
        ) {

            return res.redirect(
                "/admin?error=Visitor%20email%20not%20found"
            );

        }

        // =================================================
        // SUBJECT
        // =================================================

        const replySubject =
            subject &&
            subject.trim()
                ? subject.trim()
                : `Re: ${contact.subject || "Your message"}`;

        // =================================================
        // REPLY MESSAGE
        // =================================================

        const replyMessage =
            message.trim();

        // =================================================
        // ESCAPE HTML
        // =================================================

        const htmlMessage =
            replyMessage
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/\n/g, "<br>");

        // =================================================
        // MAIL OPTIONS
        // =================================================

        const mailOptions = {

            from:
                `"Shantanu Jadhav" <${process.env.EMAIL_USER}>`,

            to:
                contact.email,

            replyTo:
                process.env.EMAIL_USER,

            subject:
                replySubject,

            text:
                replyMessage,

            html: `
                <div style="
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #212529;
                    max-width: 700px;
                    margin: auto;
                    padding: 20px;
                ">

                    <h2 style="
                        margin-bottom: 20px;
                        color: #212529;
                    ">
                        Shantanu Jadhav
                    </h2>

                    <p>
                        ${htmlMessage}
                    </p>

                    <hr style="
                        margin: 25px 0;
                        border: none;
                        border-top: 1px solid #ddd;
                    ">

                    <p style="
                        color: #6c757d;
                        font-size: 14px;
                    ">
                        This reply was sent from
                        Shantanu Jadhav's portfolio
                        contact system.
                    </p>

                </div>
            `

        };

        // =================================================
        // SEND EMAIL FIRST
        // =================================================

        console.log("========================================");
        console.log("📧 Sending reply...");
        console.log("To:", contact.email);
        console.log("Subject:", replySubject);
        console.log("========================================");

        await transporter.sendMail(
            mailOptions
        );

        console.log("========================================");
        console.log("✅ Email sent successfully");
        console.log("========================================");

        // =================================================
        // UPDATE CONTACT DOCUMENT
        // =================================================

        contact.isRead = true;

        contact.isReplied = true;

        contact.repliedAt = new Date();

        // IMPORTANT:
        // Save updated values to MongoDB
        await contact.save();

        // =================================================
        // VERIFY DATABASE UPDATE
        // =================================================

        const updatedContact =
            await Contact.findById(
                req.params.id
            );

        console.log("========================================");
        console.log("✅ REPLY STATUS UPDATED");
        console.log("========================================");
        console.log(
            "Contact ID:",
            updatedContact._id
        );
        console.log(
            "isRead:",
            updatedContact.isRead
        );
        console.log(
            "isReplied:",
            updatedContact.isReplied
        );
        console.log(
            "repliedAt:",
            updatedContact.repliedAt
        );
        console.log("========================================");

        // =================================================
        // SUCCESS
        // =================================================

        return res.redirect(
            "/admin?success=Reply%20sent%20successfully"
        );

    } catch (error) {

        console.error("========================================");
        console.error("❌ REPLY EMAIL ERROR");
        console.error("========================================");
        console.error(error);
        console.error("========================================");

        // IMPORTANT:
        // If sendMail() fails,
        // database status is NOT changed.

        return res.redirect(
            "/admin?error=Unable%20to%20send%20reply"
        );

    }

});

// =====================================================
// DELETE CONTACT MESSAGE
// =====================================================

router.post("/delete/:id", async (req, res) => {

    // =================================================
    // CHECK ADMIN SESSION
    // =================================================

    if (
        !req.session ||
        !req.session.isAdmin
    ) {

        return res.redirect("/admin/login");

    }

    try {

        const deletedContact =
            await Contact.findByIdAndDelete(
                req.params.id
            );

        // =================================================
        // MESSAGE NOT FOUND
        // =================================================

        if (!deletedContact) {

            return res.redirect(
                "/admin?error=Message%20not%20found"
            );

        }

        console.log(
            "🗑️ Contact message deleted:",
            req.params.id
        );

        return res.redirect(
            "/admin?success=Message%20deleted%20successfully"
        );

    } catch (error) {

        console.error(
            "❌ Delete message error:",
            error
        );

        return res.redirect(
            "/admin?error=Unable%20to%20delete%20message"
        );

    }

});

// =====================================================
// ADMIN LOGOUT
// =====================================================

router.get("/logout", (req, res) => {

    if (!req.session) {

        return res.redirect("/admin/login");

    }

    req.session.destroy((error) => {

        if (error) {

            console.error(
                "❌ Logout error:",
                error
            );

            return res.redirect("/admin");

        }

        console.log(
            "✅ Admin logged out"
        );

        return res.redirect(
            "/admin/login"
        );

    });

});

// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;