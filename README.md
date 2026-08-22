# VitaCare Portal — Full-Stack Blood Donation Management System

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Sequelize ORM](https://img.shields.io/badge/Sequelize_ORM-52B0E7?style=for-the-badge&logo=sequelize&logoColor=white)](https://sequelize.org/)

VitaCare Portal is a modern, responsive, and professional full-stack platform designed to facilitate blood donation requests, donor management, real-time inventory control, and administrative operations.

---

## 🚀 Key Features

### 👤 User Portal
* **Donor Search Matrix:** Find voluntary blood donors filtered by city, neighborhood, and compatible blood group in real-time.
* **Interactive Blood Requests:** Raise targeted blood requests directly to matched donors or broadcast requests to all compatible donors in a specific city.
* **Smart Notification Center:** Staggered, interactive system notifications. Accept or decline targeted incoming requests directly from notification action badges.
* **Form Progress Persistence:** Multi-step "Become a Donor" signup saves input progress and current step in browser state (`localStorage`) to prevent data loss on page refreshes or connection drops.
* **Interactive Dashboard:** Tracks total donations, lives impacted, and local active blood shortages.

### 🛡️ Admin Panel
* **User & Donor Administration:** Complete user account governance, verification status toggles, and safety suspension parameters.
* **Request Auditing & Verification:** Verify blood requests, trace requester contact details, and review if a request is a targeted request (displays specific targeted recipient name) or a general broadcast.
* **Real-time Inventory Control:** Monitor and adjust hospital blood bank stock levels. Deduct and fulfill requests directly from physical blood stock inventories.
* **Unresolved Inbox Badges:** The Admin sidebar displays real-time badges indicating the count of unresolved inquiries and support tickets.
* **Custom Modals:** Native confirm popups are replaced with beautiful custom confirmation modals for notifications, messages, and deletion activities.

### 🔒 Enterprise-Grade Security
* **Stateless Password Reset:** Generates stateless cryptographic JWT reset tokens signed with a combination of server secrets and the user's current password hash. Links expire in **5 minutes** and are strictly **single-use** (invalidated instantly once password updates).
* **Disposable Mailbox Blocking:** Blocks registration from throwaway/temporary mailboxes (e.g., `yopmail.com`, `mailinator.com`, `tempmail.com`).
* **Honeypot Bot Protection:** Hidden input fields identify automated spam bots during registration and contact submissions, dropping requests silently to shield database assets.
* **Secure Cookie Authentication:** Access (15m) and Refresh (7d) tokens are signed and delivered inside secure HTTP-Only SameSite Lax cookies to block CSRF and XSS token interception.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React (Vite), Redux Toolkit (RTK), RTK Query (API Caching), Tailwind CSS (v4 with OKLCH Color Variables), Lucide Icons |
| **Backend** | Node.js, Express.js (MVC Architecture), Sequelize ORM, Nodemailer SMTP, Node-Cron, JWT Security |
| **Database** | PostgreSQL |

---

## 📁 Repository Structure

```
├── Backend/
│   └── blood_donation/        # Express API Server
│       ├── config/            # DB & Environment Configuration
│       ├── controllers/       # Business Logic Handlers (Auth, Requests, Admin)
│       ├── middlewares/       # JWT Auth and Admin Authorization Guards
│       ├── models/            # Sequelize PostgreSQL Schemas & Associations
│       └── routes/            # Route Mappings
└── vitacare-portal/           # React Portal Client
    ├── src/
    │   ├── app/               # Redux Store Configuration
    │   ├── components/        # Glassmorphic Layouts, Cards, Tables, Buttons
    │   ├── features/          # Redux API Slices (RTK Query integration)
    │   ├── routes/            # Public, User and Admin Views
    │   └── styles.css         # Tailwind v4 Global Base Styles
```

---

## ⚙️ Installation & Setup

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd Backend/blood_donation
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on configuration keys:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=your_postgres_user
   DB_PASS=your_postgres_password
   DB_NAME=blood_donation
   JWT_SECRET=your_jwt_access_secret
   REFRESH_TOKEN_SECRET=your_jwt_refresh_secret
   EMAIL_USER=your_gmail_username@gmail.com
   EMAIL_PASS=your_gmail_app_password
   CLIENT_URL=http://localhost:5173
   ```
4. Run migrations and seeders to populate database:
   ```bash
   npx sequelize-cli db:migrate
   npx sequelize-cli db:seed:all
   ```
5. Start development server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd vitacare-portal
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start Vite dev server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser.
