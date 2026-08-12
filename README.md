# Universal Sales ERP

A comprehensive, production-ready Sales Enterprise Resource Planning (ERP) application built with the MERN Stack (MongoDB, Express.js, React.js, Node.js). 

This system is designed to manage the end-to-end sales lifecycle, from managing customers and products to generating quotations, processing sales orders, generating invoices, and tracking inventory and payments.

## 🚀 Technology Stack

### Frontend
- **Framework:** React.js (Vite)
- **Routing:** React Router
- **Styling:** Tailwind CSS
- **State Management:** Context API
- **HTTP Client:** Axios
- **Form Handling:** React Hook Form
- **Animations:** Framer Motion
- **Charts:** Recharts
- **Icons:** Lucide React

### Backend
- **Environment:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JSON Web Tokens (JWT) & bcrypt

---

## 🌟 Key Features

- **Role-Based Authentication (RBAC):** Super Admin, Manager, and Sales Executive roles with protected routes and module-specific access permissions.
- **Interactive Dashboard:** Statistical overviews of customers, products, quotations, orders, and revenue, accompanied by visual charts.
- **Customer Management:** Comprehensive CRUD operations with soft-delete functionality and strict business rule validations (e.g., cannot delete customers with active orders).
- **Product & Inventory Management:** Auto-updating stock tracking linked to order processing and cancellations.
- **Quotation & Order Lifecycle:** Seamless conversion from Quotations to Sales Orders, respecting credit limits and valid-till dates.
- **Invoicing & Payments:** Tracking of outstanding amounts, partial payments, and secure invoice generation.

---

## 📂 Folder Structure

```text
universal-sales-erp/
├── backend/
│   ├── src/
│   │   ├── config/          # Database & environment configurations
│   │   ├── controllers/     # API route logic and business rules
│   │   ├── middlewares/     # Auth and error handling middlewares
│   │   ├── models/          # Mongoose database schemas
│   │   └── routes/          # Express route definitions
│   ├── server.js            # Main application entry point
│   ├── seeder.js            # Database seeder script
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/      # Reusable UI components
    │   ├── context/         # State management (Context API)
    │   ├── hooks/           # Custom React hooks
    │   ├── layouts/         # Page layouts (Sidebar, Header)
    │   ├── pages/           # Application views/pages
    │   ├── routes/          # React Router configuration
    │   ├── services/        # Axios API call functions
    │   └── utils/           # Helper functions
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher recommended)
- MongoDB (Local instance or MongoDB Atlas cluster)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd universal-sales-erp
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the root of the `backend` directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/universal-erp
JWT_SECRET=your_super_secret_key_here
```

Seed the database with sample data:
```bash
node seeder.js
```

Start the backend development server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window, navigate to the frontend directory, and install dependencies:
```bash
cd frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
```

The frontend will typically run on `http://localhost:5173` and the backend API on `http://localhost:5000`.

---

## 👤 Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@erp.com | password123 |
| Manager | manager@erp.com | password123 |
| Sales Executive | sales@erp.com | password123 |

---

## 📋 Business Rules Enforced

1. Customers cannot be deleted if any Quotation, Order, or Invoice exists.
2. Approved Quotations cannot be edited.
3. Sales Orders can only be created from Approved Quotations.
4. An Invoice cannot be created twice for the same Order.
5. Cancelling an Order automatically restores the Product Stock.
6. Outstanding Amounts automatically update whenever a payment is received.
7. Sales Executives can only view their assigned customers.
8. Quotations automatically expire when the Valid Till date passes.
9. New Sales Orders cannot be created if a Customer's Credit Limit is exceeded.
