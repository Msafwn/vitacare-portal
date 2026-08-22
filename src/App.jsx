import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Index from "./routes/public/index";
import Login from "./routes/public/login";
import Register from "./routes/public/register";
import About from "./routes/public/about";
import Contact from "./routes/public/contact";
import ForgotPassword from "./routes/public/forgot-password";
import ResetPassword from "./routes/public/reset-password";

import Dashboard from "./routes/user/dashboard";
import Profile from "./routes/user/profile";
import Notifications from "./routes/user/notifications";
import FindDonors from "./routes/user/find-donors";
import DonationHistory from "./routes/user/donation-history";
import DonationDetails from "./routes/user/donation-details";
import BecomeDonor from "./routes/user/become-donor";
import DonorsDetails from "./routes/user/donors.$donorId";
import RequestsIndex from "./routes/user/requests.index";
import RequestsNew from "./routes/user/requests.new";
import RequestsDetails from "./routes/user/requests.$requestId";
import Settings from "./routes/user/settings";

import AdminProtectedRoute from "./components/auth/AdminProtectedRoute";

import AdminLogin from "./routes/admin/login";
import AdminDashboard from "./routes/admin/dashboard";
import AdminDonations from "./routes/admin/donations";
import AdminDonors from "./routes/admin/donors";
import AdminInventory from "./routes/admin/inventory";
import AdminNotifications from "./routes/admin/notifications";
import AdminReports from "./routes/admin/reports";
import AdminRequests from "./routes/admin/requests";
import AdminSettings from "./routes/admin/settings";
import AdminUsers from "./routes/admin/users";
import AdminProfile from "./routes/admin/profile";
import AdminMessages from "./routes/admin/messages";

import { Toaster } from "@/components/blood/Toast";

function App() {
  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* User Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/find-donors" element={<FindDonors />} />
          <Route path="/donation-history" element={<DonationHistory />} />
          <Route path="/donations/:id" element={<DonationDetails />} />
          <Route path="/become-donor" element={<BecomeDonor />} />
          <Route path="/donors/:donorId" element={<DonorsDetails />} />
          <Route path="/requests" element={<RequestsIndex />} />
          <Route path="/requests/new" element={<RequestsNew />} />
          <Route path="/requests/:requestId" element={<RequestsDetails />} />
          <Route path="/settings" element={<Settings />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          
          <Route element={<AdminProtectedRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/donations" element={<AdminDonations />} />
            <Route path="/admin/donors" element={<AdminDonors />} />
            <Route path="/admin/inventory" element={<AdminInventory />} />
            <Route path="/admin/notifications" element={<AdminNotifications />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/admin/requests" element={<AdminRequests />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/profile" element={<AdminProfile />} />
            <Route path="/admin/messages" element={<AdminMessages />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
