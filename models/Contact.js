const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

const Contact = require("../models/Contact");

// =====================================================
// ADMIN AUTHENTICATION MIDDLEWARE
// =====================================================

function requireAdmin(req, res, next) {
    if (req.session && req.session.isAdmin) {
        return next();
    }

    return res.redirect("/admin/login");
}

// =====================================================
// ADMIN LOGIN PAGE
// =====================================================

router.get("/login", (req, res) => {
    if (req.session && req.session.isAdmin) {
        return res.redirect("/admin");
    }

    res.render("admin/login", {
        error: null,
    });
});

// =====================================================
// ADMIN LOGIN
// =====================================================

router.post("/login", (req, res) => {
    const { username, password } = req.body;

    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    // =========================================
    // VALIDATION
    // =========================================

    if (!username || !password) {
        return res.render("admin/login", {
            error: "Username and password are required.",
        });
    }

    // =========================================
    // CHECK CREDENTIALS
    // =========================================

    if (
        username === adminUsername &&
        password === adminPassword
    ) {
        req.session.isAdmin = true;

        return res.redirect("/admin");
    }

    // =========================================
    // INVALID LOGIN
    // =========================================

    return res.render("admin/login", {
        error: "Invalid username or password.",
    });
});

// =====================================================
// ADMIN DASHBOARD
// =====================================================

router.get("/", requireAdmin, async (req, res) => {
    try {
        // =========================================
        // GET ALL CONTACTS
        // =========================================

        const contacts = await Contact.find({})
            .sort({ createdAt: -1 });

        // =========================================
        // STATISTICS
        // =========================================

        const totalMessages = contacts.length;

        const unreadCount = contacts.filter(
            (contact) => !contact.isRead
        ).length;

        const repliedCount = contacts.filter(
            (contact) => contact.isReplied
        ).length;

        const notRepliedCount = contacts.filter(
            (contact) => !contact.isReplied
        ).length;

        // =========================================
        // RENDER DASHBOARD
        // =========================================

        res.render("admin/dashboard", {
            contacts,
            totalMessages,
            unreadCount,
            repliedCount,
            notRepliedCount,
            success: req.query.success || null,
            error: req.query.error || null,
        });

    } catch (error) {
        console.error("========================================");
        console.error("❌ Admin Dashboard Error");
        console.error(error);
        console.error("========================================");

        res.status(500).send("Something went wrong.");
    }
});

// =====================================================
// MARK MESSAGE AS READ
// =====================================================

router.post("/read/:id", requireAdmin, async (req, res) => {
    try {
        await Contact.findByIdAndUpdate(
            req.params.id,
            {
                isRead: true,
            }
        );

        return res.redirect(
            "/admin?success=Message%20marked%20as%20read."
        );

    } catch (error) {
        console.error("Mark read error:", error);

        return res.redirect(
            "/admin?error=Unable%20to%20mark%20message%20as%20read."
        );
    }
});

// =====================================================
// MARK MESSAGE AS UNREAD
// =====================================================

router.post("/unread/:id", requireAdmin, async (req, res) => {
    try {
        await Contact.findByIdAndUpdate(
            req.params.id,
            {
                isRead: false,
            }
        );

        return res.redirect(
            "/admin?success=Message%20marked%20as%20unread."
        );

    } catch (error) {
        console.error("Mark unread error:", error);

        return res.redirect(
            "/admin?error=Unable%20to%20mark%20message%20as%20unread."
        );
    }
});

// =====================================================
// REPLY TO CONTACT
// =====================================================

router.post("/reply/:id", requireAdmin, async (req, res) => {
    try {
        const { subject, message } = req.body;

        // =========================================
        // VALIDATION
        // =========================================

        if (!subject || !message) {
            return res.redirect(
                "/admin?error=Reply%20subject%20and%20message%20are%20required."
            );
        }

        // =========================================
        // FIND CONTACT
        // =========================================

        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.redirect(
                "/admin?error=Contact%20message%20not%20found."
            );
        }

        // =========================================
        // EMAIL TRANSPORTER
        // =========================================

        const transporter = nodemailer.createTransport({
            service: "gmail",

            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // =========================================
        // SEND EMAIL
        // =========================================

        await transporter.sendMail({
            from: `"Shantanu Jadhav" <${process.env.EMAIL_USER}>`,

            to: contact.email,

            subject: subject.trim(),

            text: message.trim(),

            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.7; color: #222;">

                    <h2 style="margin-bottom: 20px;">
                        ${subject.trim()}
                    </h2>

                    <p style="white-space: pre-wrap;">
                        ${message.trim()}
                    </p>

                    <hr style="margin: 30px 0;">

                    <p style="color: #666;">
                        Regards,<br>
                        <strong>Shantanu Jadhav</strong>
                    </p>

                </div>
            `,
        });

        // =========================================
        // IMPORTANT
        // UPDATE DATABASE ONLY AFTER EMAIL SUCCESS
        // =========================================

        await Contact.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    isRead: true,
                    isReplied: true,
                    repliedAt: new Date(),
                },
            },
            {
                new: true,
            }
        );

        console.log("========================================");
        console.log("✅ Reply email sent successfully!");
        console.log("📧 To:", contact.email);
        console.log("🆔 Contact ID:", contact._id);
        console.log("✅ isReplied: true");
        console.log("✅ isRead: true");
        console.log("========================================");

        // =========================================
        // SUCCESS
        // =========================================

        return res.redirect(
            "/admin?success=Reply%20sent%20successfully."
        );

    } catch (error) {

        // =========================================
        // EMAIL / DATABASE ERROR
        // =========================================

        console.error("========================================");
        console.error("❌ Reply Error");
        console.error(error);
        console.error("========================================");

        // IMPORTANT:
        // येथे isReplied update केलेले नाही.
        // त्यामुळे email fail झाला तर
        // message Pending Reply मध्येच राहील.

        return res.redirect(
            "/admin?error=Unable%20to%20send%20reply.%20Please%20try%20again."
        );
    }
});

// =====================================================
// DELETE CONTACT
// =====================================================

router.post("/delete/:id", requireAdmin, async (req, res) => {
    try {
        await Contact.findByIdAndDelete(req.params.id);

        return res.redirect(
            "/admin?success=Message%20deleted%20successfully."
        );

    } catch (error) {
        console.error("Delete error:", error);

        return res.redirect(
            "/admin?error=Unable%20to%20delete%20message."
        );
    }
});

// =====================================================
// LOGOUT
// =====================================================

router.get("/logout", (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            console.error("Logout error:", error);

            return res.redirect(
                "/admin?error=Unable%20to%20logout."
            );
        }

        res.redirect("/admin/login");
    });
});

// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;