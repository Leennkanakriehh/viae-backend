# 🧠 Viae Backend (Node.js + Express + PostgreSQL)

## 📌 Description

This is the backend for the Viae full-stack fleet management system.  
It provides RESTful APIs for authentication, user management, driver operations, ride management, vehicle management, and administrative workflows.

The backend is responsible for enforcing role-based access control, handling business logic, and persisting data securely using a relational database.

---

## 🛠 Tech Stack

- **Node.js** – JavaScript runtime environment
- **Express.js** – Backend web framework for building RESTful APIs
- **PostgreSQL** – Relational database for persistent data storage
- **pg** – PostgreSQL client for Node.js
- **dotenv** – Environment variable management
- **cors** – Cross-Origin Resource Sharing middleware

---
## 🔌 API Endpoints

The backend exposes a set of RESTful API endpoints to handle authentication, user management, driver operations, ride management, vehicle management, and administrative actions.  
Access to endpoints is controlled using role-based middleware (`adminAuth` and `driverAuth`).

The API runs locally at:

```

---

### 🔐 Authentication Routes

**Base URL:** `/api/auth`

| Method | Endpoint | Description |
|------|--------|------------|
| POST | `/signup` | Register a new user (admin or driver). Drivers are created with a pending status. |
| POST | `/login` | Authenticate an existing user and return basic user information (id, email, role). |

---

### 👤 Admin Routes

**Base URL:** `/api/admin`  
**Access:** Admin only

| Method | Endpoint | Description |
|------|--------|------------|
| GET | `/pending-drivers` | Retrieve all drivers with pending approval status. |
| PATCH | `/approve-driver/:id` | Approve a pending driver application. |
| PATCH | `/reject-driver/:id` | Reject a pending driver application. |

---

### 🚗 Driver Routes

**Base URL:** `/api/drivers`

#### Driver (Authenticated Driver Only)

| Method | Endpoint | Description |
|------|--------|------------|
| POST | `/apply` | Submit a request to apply as a driver. |
| GET | `/me` | Retrieve the authenticated driver’s profile. |
| PUT | `/me/availability` | Update the driver’s availability status. |

#### Admin (Admin Only)

| Method | Endpoint | Description |
|------|--------|------------|
| GET | `/` | Retrieve all registered drivers. |
| GET | `/:id` | Retrieve a specific driver by ID. |
| PUT | `/:id` | Update driver information. |
| DELETE | `/:id` | Delete a driver account. |

---

### 🚕 Ride Routes

**Base URL:** `/api/rides`

#### Admin Only

| Method | Endpoint | Description |
|------|--------|------------|
| POST | `/` | Create a new ride request. |
| PUT | `/:id/assign` | Assign a driver to a ride. |

#### Shared (Admin & Driver)

| Method | Endpoint | Description |
|------|--------|------------|
| GET | `/` | Retrieve all rides. |

#### Driver Only

| Method | Endpoint | Description |
|------|--------|------------|
| GET | `/my/history` | Retrieve ride history for the authenticated driver. |
| PUT | `/:id/start` | Mark an assigned ride as started. |
| PUT | `/:id/complete` | Mark an assigned ride as completed. |

---

### 👥 User Management Routes

**Base URL:** `/api/users`  
**Access:** Admin only

| Method | Endpoint | Description |
|------|--------|------------|
| POST | `/` | Create a new user account. |
| GET | `/` | Retrieve all users. |
| GET | `/:id` | Retrieve a specific user by ID. |
| PUT | `/:id/email` | Update a user’s email address. |
| DELETE | `/:id` | Delete a user account. |

---

### 🚙 Vehicle Routes

**Base URL:** `/api/vehicles`

#### Driver

| Method | Endpoint | Description |
|------|--------|------------|
| GET | `/driver/:driver_id` | Retrieve the vehicle assigned to a specific driver. |
| POST | `/` | Create a new vehicle (linked to the authenticated driver). |
| PUT | `/:id` | Update vehicle information. |
| DELETE | `/:id` | Delete a vehicle. |
| GET | `/:id` | Retrieve vehicle details by ID. |

#### Admin

| Method | Endpoint | Description |
|------|--------|------------|
| GET | `/` | Retrieve all vehicles in the system. |

---

### 🔒 Authorization & Middleware

- **Admin-only routes** are protected using `adminAuth` middleware.
- **Driver-only routes** are protected using `driverAuth` middleware.
- Authorization is role-based and enforced through request headers.


## 🚀 Getting Started

Follow the steps below to run the backend server locally.

### 1️⃣ Install dependencies
```bash
cd viae-backend
npm install
