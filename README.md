# VitaCare Portal - Blood Donation Management System

VitaCare Portal is a modern, responsive, and professional frontend interface for a Blood Donation Management System. It is designed with a clean healthcare SaaS aesthetic to facilitate blood donation requests, donor management, and administrative operations.

## Features

### 👤 User Portal
- **Dashboard:** Overview of donation history and active requests.
- **Find Donors:** Search for available blood donors by blood group and city.
- **Blood Requests:** Create new blood requests and view details of urgent needs.
- **Profile & Settings:** Manage personal information and notification preferences.

### 🛡️ Admin Panel
- **Admin Dashboard:** Centralized view of system metrics.
- **User & Donor Management:** Manage registered users and active donors.
- **Blood Inventory:** Monitor available blood stock.
- **Reports & Notifications:** System-wide announcements and detailed reports.

## Tech Stack

This project is built using modern web technologies:
- **React.js (Vite)**
- **JavaScript (ESNext) / JSX**
- **React Router (v7)**
- **Tailwind CSS** (for styling)
- **Redux Toolkit** (RTK Query for state management)
- **Shadcn UI** (Radix UI + Tailwind for accessible components)

## Project Structure

The routing architecture is logically separated into domains:
- `/src/routes/public/` - Accessible to everyone (Login, Register, About)
- `/src/routes/user/` - Protected routes for Donors/Users
- `/src/routes/admin/` - Protected routes for Administrators

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites
- [Node.js](https://nodejs.org/en/) (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/vitacare-portal.git
   cd vitacare-portal
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:5173` in your browser.

## Backend Integration
This is the **frontend-only** portion of the application. It is structured to be easily attached to a REST API (Node.js/Express, Python, etc.). API calls are managed via `src/store/apiSlice.js` using Redux RTK Query. To connect your backend, update the base URLs in the `apiSlice`.
