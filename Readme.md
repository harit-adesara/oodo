<div align="center">

# 🚀 AssetFlow
### Enterprise Asset & Resource Management System

A centralized **Enterprise Asset & Resource Management System (ERP)** built to simplify how organizations manage physical assets and shared resources. AssetFlow replaces spreadsheets and manual processes with a secure, role-based platform for asset tracking, allocation, maintenance, booking, and analytics.

![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=node.js)
![Express](https://img.shields.io/badge/Express.js-Framework-000000?style=for-the-badge&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb)
![JWT](https://img.shields.io/badge/JWT-Authentication-000000?style=for-the-badge&logo=jsonwebtokens)

</div>

---

# 📖 Overview

Managing organizational assets manually often leads to duplicate allocations, misplaced equipment, scheduling conflicts, and inefficient maintenance workflows.

**AssetFlow** provides a centralized ERP solution that enables organizations to efficiently manage assets throughout their lifecycle using secure, role-based access and streamlined workflows.

---

# ✨ Features

## 🔐 Authentication

- Secure Login & Signup
- JWT Authentication
- Role-Based Access Control (RBAC)
- Forgot Password
- Password Encryption using bcrypt

---

## 👨‍💼 Admin Module

- Department Management
- Employee Management
- Asset Category Management
- Role Assignment
- Organization Setup
- Dashboard & Analytics

---

## 📦 Asset Manager Module

- Register New Assets
- Asset Inventory
- Allocate Assets
- Asset Transfer Requests
- Maintenance Approval
- Asset Lifecycle Management

---

## 🏢 Department Head Module

- Department Dashboard
- View Department Assets
- Approve/Reject Asset Requests
- Approve Transfer Requests
- Manage Shared Resource Bookings

---

## 👨‍💻 Employee Module

- View Assigned Assets
- Request New Assets
- Raise Maintenance Requests
- Return Assets
- Transfer Requests
- Book Shared Resources

---

## 📊 Dashboard & Reports

- Total Assets
- Available Assets
- Allocated Assets
- Pending Requests
- Maintenance Requests
- Active Bookings
- Notifications
- Reports & Analytics

---

# 🔄 System Workflow

```text
User Login
      │
      ▼
Admin creates Departments & Employees
      │
      ▼
Asset Manager registers Assets
      │
      ▼
Employee requests Asset
      │
      ▼
Department Head reviews request
      │
      ▼
Asset Allocated
      │
      ▼
Maintenance / Return / Transfer
      │
      ▼
Real-Time Dashboard & Reports
```

---

# 👥 User Roles

| Role | Responsibilities |
|------|-------------------|
| 👨‍💼 Admin | Manage departments, employees, categories, roles, analytics |
| 📦 Asset Manager | Register assets, allocate assets, manage maintenance, approve transfers |
| 🏢 Department Head | Approve requests, monitor department assets, manage bookings |
| 👨‍💻 Employee | Request assets, raise maintenance requests, return assets, book resources |

---

# 🛠️ Tech Stack

## Frontend

- React.js
- JavaScript
- HTML5
- CSS3

## Backend

- Node.js
- Express.js

## Database

- MongoDB
- Mongoose

## Authentication

- JWT (JSON Web Token)
- bcrypt.js

---

# 📂 Project Structure

```text
AssetFlow/
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── ...
│
├── README.md
└── package.json
```

---

# ⚙️ Installation

## 1️⃣ Clone the Repository

```bash
git clone <repository-url>
cd AssetFlow
```

---

## 2️⃣ Install Backend

```bash
cd backend
npm install
npm run dev
```

---

## 3️⃣ Install Frontend

```bash
cd frontend
npm install
npm run dev
```

---

# 🚀 Future Enhancements

- ✅ QR Code Based Asset Tracking
- ✅ Barcode Scanner Integration
- ✅ Email Notifications
- ✅ AI-Powered Asset Insights
- ✅ Predictive Maintenance
- ✅ Mobile Application
- ✅ Advanced Analytics Dashboard
- ✅ Audit Logs
- ✅ Multi-Organization Support

---

# 🌟 Key Highlights

- 📦 Centralized Asset Management
- 🔐 Secure Role-Based Authentication
- 🔄 Complete Asset Lifecycle Tracking
- 📅 Conflict-Free Resource Booking
- 🛠️ Maintenance Workflow
- 📊 Interactive Dashboard
- 🔔 Notifications & Reports
- 🚀 Scalable ERP Architecture

---

# 📸 Screenshots

> Add your application screenshots here.

```text
assets/
├── login.png
├── dashboard.png
├── assets.png
├── bookings.png
└── reports.png
```

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create your feature branch

```bash
git checkout -b feature-name
```

3. Commit your changes

```bash
git commit -m "Add feature"
```

4. Push to your branch

```bash
git push origin feature-name
```

5. Open a Pull Request

---

# 👨‍💻 Team

Developed as part of the **AssetFlow ERP Hackathon Project**.

---

# 📄 License

This project was developed for **educational and hackathon purposes**.

---

<div align="center">

### ⭐ If you found this project useful, consider giving it a star!

**Made with ❤️ using React, Node.js, Express & MongoDB**

</div>
