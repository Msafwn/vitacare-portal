# Routes Directory

This project uses **React Router (`react-router-dom`)** for routing. All route configurations are manually defined in the `src/App.jsx` file. We do NOT use file-based routing.

## Folder Structure

To keep the project organized and maintainable, route components are divided into three main domains:

### 1. `/public/`
Contains pages that are accessible to everyone without logging in.
- Example: `index.jsx`, `login.jsx`, `about.jsx`, etc.

### 2. `/user/`
Contains pages specific to the user portal (donors/receivers). These routes will eventually be protected by an authentication check.
- Example: `dashboard.jsx`, `profile.jsx`, `donations.jsx`, etc.

### 3. `/admin/`
Contains pages specific to the administration panel. These are protected routes meant only for admin staff.
- Example: `dashboard.jsx`, `users.jsx`, `reports.jsx`, etc.

## How to add a new route?

1. Create your component `.jsx` file in the appropriate folder (`public`, `user`, or `admin`).
2. Go to `src/App.jsx`.
3. Import your new component at the top of the file.
4. Add a new `<Route />` tag inside the `<Routes>` block in `App.jsx`.
