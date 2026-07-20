# 🏦 SmartBank – AI-Powered Digital Banking Platform

A full-stack digital banking application built with **Spring Boot**, **React**, **AWS**, **Docker**, and **MySQL RDS**. SmartBank provides secure banking operations such as account management, money transfers, loan applications, transaction history, and AI-powered financial insights through a modern, responsive web interface.

---

## 🌐 Live Demo



🔗 **Live Application:** [SmartBank](http:16.171.172.126)

> **Note:** The application is hosted on AWS EC2. If the server is temporarily unavailable, please contact me.

---

## ✨ Features

### 🔐 Authentication & Security
- User Registration with Email OTP Verification
- JWT-based Authentication
- Role-Based Access Control (Customer/Admin)
- BCrypt Password Encryption
- Secure REST APIs with Spring Security

### 💳 Banking Services
- Create and Manage Bank Accounts
- Deposit Funds Using RazorPay
- Secure Money Transfers
- View Account Details
- Transaction History
- Download Transaction Statement (PDF)

### 🤖 AI Financial Insights
- Personalized Spending Analysis
- Financial Health Summary
- Smart Saving Recommendations

### 📧 Notifications
- Email OTP Verification
- Account Creation Confirmation
- Transaction Notifications

---

# 🛠️ Tech Stack

| Category | Technologies |
|----------|--------------|
| Backend | Java 21, Spring Boot, Spring Security, Spring Data JPA |
| Frontend | React, JavaScript, HTML, CSS, Axios |
| Database | AWS RDS MySQL |
| Cloud | AWS EC2 |
| DevOps | Docker, Docker Hub, Nginx |
| Build Tool | Maven |

---

# 🏗️ System Architecture

```
                 +----------------------+
                 |    React Frontend    |
                 +----------+-----------+
                            |
                            |
                      HTTP Requests
                            |
                            ▼
                 +----------------------+
                 |   Nginx Reverse Proxy|
                 +----------+-----------+
                            |
                            ▼
                 +----------------------+
                 | Spring Boot Backend  |
                 |  REST APIs + JWT     |
                 +----------+-----------+
                            |
                            ▼
                 +----------------------+
                 | AWS RDS MySQL        |
                 +----------------------+
```

---

# 🚀 Deployment

The application is deployed using AWS and Docker.

- Frontend hosted on Docker
- Backend hosted on Docker
- Database hosted on AWS RDS MySQL
- Reverse Proxy using Nginx
- Hosted on AWS EC2

---

# 📂 Project Structure

```
SmartBank
│
├── backend
│   ├── controller
│   ├── service
│   ├── repository
│   ├── entity
│   ├── dto
│   ├── security
│   └── configuration
│
├── frontend
│   ├── src
│   ├── components
│   ├── pages
│   └── services
│
└── docker
```

---

# 🔑 REST APIs

## Authentication
- POST `/api/auth/register`
- POST `/api/auth/login`
- POST `/api/auth/verify-otp`

## Accounts
- POST `/api/accounts/create`
- GET `/api/accounts`

## Transactions
- POST `/api/transactions/transfer`
- GET `/api/transactions/history`

## Loans
- POST `/api/loans/apply`
- GET `/api/loans`

## AI
- GET `/api/ai/analyze`

---

# ⚙️ Run Locally

### Clone Repository

```bash
git clone https://github.com/Kolayagnesh/SmartBank
cd SmartBank
```

### Backend

```bash
cd backend
mvn spring-boot:run
```

### Frontend

```bash
cd frontend
npm install
npm start
```

Configure your MySQL database credentials in `application.properties` before running the application.

---

# 🔮 Future Improvements

- UPI Payments
- Fixed Deposits
- Credit Card Management
- Investment Portfolio
- Real-time Transaction Notifications
- Microservices Architecture
- Kubernetes Deployment
- CI/CD Pipeline with GitHub Actions

---

# 👨‍💻 Author

**Kola Dharma Raghava Yagnesh**

- GitHub: https://github.com/Kolayagnesh
- LinkedIn: https://www.linkedin.com/in/yagneshkola/

---

⭐ If you found this project interesting, feel free to star the repository!
