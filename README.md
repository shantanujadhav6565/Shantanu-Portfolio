# 👨‍💻 Shantanu Jadhav — Developer Portfolio

<p align="center">
  <img src="https://img.shields.io/badge/Portfolio-Full%20Stack%20Web%20Developer-blue?style=for-the-badge" alt="Portfolio">
  <img src="https://img.shields.io/badge/Frontend-HTML%20%7C%20CSS%20%7C%20Bootstrap%20%7C%20JavaScript-orange?style=for-the-badge" alt="Frontend">
  <img src="https://img.shields.io/badge/Backend-Node.js%20%7C%20Express.js-green?style=for-the-badge" alt="Backend">
  <img src="https://img.shields.io/badge/Database-MongoDB-brightgreen?style=for-the-badge" alt="Database">
</p>

<p align="center">
  A modern, responsive and full-stack developer portfolio website built to showcase my skills, projects, experience and contact information.
</p>

---

## 🚀 About The Project

This is my personal **Full Stack Developer Portfolio Website**, designed to present my technical skills, projects, education and professional profile in a clean and modern interface.

The portfolio includes a functional backend that allows visitors to submit messages through the contact form. Messages are securely stored in **MongoDB Atlas** and can be managed through an admin panel.

### ✨ Highlights

* 🎨 Modern and professional UI
* 📱 Fully responsive design
* 🧑‍💻 Developer profile and skills section
* 🚀 Projects showcase
* 📩 Working contact form
* 🗄️ MongoDB database integration
* 🔐 Admin panel for managing messages
* 📖 Read / unread message management
* 💬 Reply functionality
* ⚡ Node.js + Express.js backend
* ☁️ MongoDB Atlas integration
* 🔒 Environment variables for sensitive configuration

---

## 🛠️ Tech Stack

### Frontend

| Technology   | Usage                 |
| ------------ | --------------------- |
| HTML5        | Website structure     |
| CSS3         | Custom styling        |
| Bootstrap 5  | Responsive UI         |
| JavaScript   | Frontend interactions |
| Font Awesome | Icons                 |

### Backend

| Technology | Usage                  |
| ---------- | ---------------------- |
| Node.js    | JavaScript runtime     |
| Express.js | Backend framework      |
| EJS        | Dynamic page rendering |
| Mongoose   | MongoDB ODM            |

### Database & Tools

| Technology    | Usage                     |
| ------------- | ------------------------- |
| MongoDB Atlas | Cloud database            |
| Git           | Version control           |
| GitHub        | Source code management    |
| dotenv        | Environment configuration |

---

## 📂 Project Structure

```text
Shantanu-Portfolio/
│
├── assets/
│   ├── css/
│   │   └── style.css
│   │
│   ├── js/
│   │   └── script.js
│   │
│   └── images/
│
├── views/
│   ├── index.ejs
│   ├── admin.ejs
│   ├── messages.ejs
│   └── ...
│
├── models/
│   └── Message.js
│
├── routes/
│   └── ...
│
├── app.js
├── package.json
├── package-lock.json
├── .gitignore
├── .env
└── README.md
```

> **Note:** The `.env` file is intentionally excluded from GitHub using `.gitignore`.

---

## 📩 Contact Form

The portfolio contains a functional contact form where visitors can submit:

* Name
* Email
* Subject
* Message

Submitted messages are stored in MongoDB.

### Message Flow

```text
Visitor
   │
   ▼
Contact Form
   │
   ▼
Express.js Backend
   │
   ▼
Mongoose
   │
   ▼
MongoDB Atlas
   │
   ▼
Admin Panel
   │
   ├── Read Message
   ├── Mark as Read
   └── Reply
```

---

## 🔐 Admin Panel

The admin panel provides a centralized place to manage messages received from the portfolio.

### Admin Features

* 📥 View received messages
* 👁️ Read message details
* ✅ Mark messages as read
* 🗑️ Manage messages
* 💬 Reply to messages
* 📊 Manage contact requests

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/Shantanu-Portfolio.git
```

### 2. Navigate to the Project

```bash
cd Shantanu-Portfolio
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Create `.env`

Create a `.env` file in the root directory:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=3000
```

### 5. Start the Server

For development:

```bash
node index.js
```

Or, if you have nodemon installed:

```bash
npx nodemon index.js
```

### 6. Open in Browser

```text
http://localhost:3000
```

---

## 🗄️ MongoDB Setup

This project uses **MongoDB Atlas** for storing contact messages.

Basic database structure:

```text
ShantanuPortfolio
│
└── messages
    ├── name
    ├── email
    ├── subject
    ├── message
    ├── isRead
    ├── createdAt
    └── ...
```

Make sure your MongoDB Atlas connection string is correctly configured inside `.env`.

---

## 🔒 Environment Variables

Never upload sensitive credentials to GitHub.

Your `.gitignore` should contain:

```gitignore
node_modules/
.env
*.log
```

---

## 📸 Portfolio Sections

The portfolio website includes sections such as:

* 🏠 Home
* 👨‍💻 About Me
* 🛠️ Skills
* 🚀 Projects
* 🎓 Education
* 📩 Contact
* 🔐 Admin Panel

---

## 🎯 Future Improvements

Planned improvements include:

* [ ] Authentication for admin panel
* [ ] Email notification system
* [ ] Direct email reply integration
* [ ] Advanced message filtering
* [ ] Admin dashboard analytics
* [ ] Dark / Light mode
* [ ] Blog section
* [ ] Project search and filtering
* [ ] Deployment optimization
* [ ] Improved security and validation

---

## 📚 What I Learned

While developing this project, I worked with:

* Frontend development
* Responsive web design
* JavaScript DOM manipulation
* Node.js
* Express.js
* EJS templating
* REST-style backend routes
* MongoDB & Mongoose
* MongoDB Atlas
* Git & GitHub
* Environment variables
* Backend form handling
* CRUD operations
* Admin panel development

---

## 👨‍💻 Developer

### Shantanu Jadhav

**B.Tech Computer Science & Engineering Student**

Interested in:

* Full Stack Web Development
* MERN Stack
* Software Development
* Backend Development
* Database Management
* Artificial Intelligence & Machine Learning

---

## ⭐ Support

If you find this project useful or interesting, consider giving the repository a ⭐ on GitHub.

---

<p align="center">
  Made with ❤️ by <strong>Shantanu Jadhav</strong>
</p>
