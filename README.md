# SmartInventory - Frontend Repository

SmartInventory is a **responsive web application** that provides an intuitive UI for managing inventory efficiently. Built using **React.js**, this frontend connects with the SmartInventory backend to enable inventory tracking, category and supplier management, stock movement logging, and real-time alerts for **low stock** and **expiring products**.

## Features

### 🔹 Dashboard
- Overview of inventory with **low stock** and **expiry alerts**.
- Quick access to inventory statistics and reports.

### 🔹 Inventory Management
- Add, update, delete products.
- Consume product stock and track movements.

### 🔹 Category & Supplier Management
- **CRUD operations** for categories and suppliers.

### 🔹 User Authentication
- **JWT-based login & logout**.
- **Role-based access** (Admin, User).

### 🔹 Reports & Activity Logs
- **Daily & weekly reports**.
- View user activity logs (login, logout, inventory updates, etc.).

### 🔹 Responsive UI
- Fully responsive **dashboard** with mobile and tablet support.

---

## 🛠 Tech Stack

- **Frontend Framework:** React.js, Vite, React Router 
- **Styling:** Tailwind CSS
- **API Client:** Axios

---

## Project Setup

### Step 1: Clone the Repository
```bash
  git clone https://github.com/GazalBandil/smartInventory-frontend.git
  cd smartInventory-frontend
```

### Step 2: Install Dependencies
```bash
  npm install
```

### Step 3: Set Up Environment Variables
- Create a `.env` file in the root directory.
- Add the backend API URL:
```env
REACT_APP_API_URL=http://localhost:8080
```

### Step 4: Start the Development Server
```bash
  npm run dev
```

### Step 5: Access the Application
- Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📌 Usage Guide

### 🔹 Admin Credentials (Default)
- **Email:** antrabandil@nucleusteq.com
- **Password:** 123
  
Use these credentials to log in and access the admin resources and functionalities.

**For Full Project Setup:**
- Connect to the backend ([SmartInventory Backend](https://github.com/GazalBandil/smartInventory)) running on `http://localhost:8080`
  
---

## Navigation & Features

### 🔹 **Dashboard**
- View **low stock alerts** and **expiring products**.

### 🔹 **Inventory Management**
- Add, update, delete, and consume inventory.

### 🔹 **Category & Supplier Management**
- Add, update, and remove categories and suppliers.

### 🔹 **User Authentication**
- Secure login/logout with JWT authentication.

### 🔹 **Reports & Logs**
- Generate **daily and weekly reports**.
- Monitor **user activity logs**.

### 🔹 **Tracking Stock Movements**
- Record **stock movements** and generate reports.

---



