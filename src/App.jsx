import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";

// Public Routes
const Index = lazy(() => import("./routes/public/index"));
const Login = lazy(() => import("./routes/public/login"));
const Register = lazy(() => import("./routes/public/register"));
const About = lazy(() => import("./routes/public/about"));
const Contact = lazy(() => import("./routes/public/contact"));
const ForgotPassword = lazy(() => import("./routes/public/forgot-password"));
const ResetPassword = lazy(() => import("./routes/public/reset-password"));

// User Routes
const Dashboard = lazy(() => import("./routes/user/dashboard"));
const Profile = lazy(() => import("./routes/user/profile"));
const Notifications = lazy(() => import("./routes/user/notifications"));
const FindDonors = lazy(() => import("./routes/user/find-donors"));
const DonationHistory = lazy(() => import("./routes/user/donation-history"));
const DonationDetails = lazy(() => import("./routes/user/donation-details"));
const BecomeDonor = lazy(() => import("./routes/user/become-donor"));
const DonorsDetails = lazy(() => import("./routes/user/donors.$donorId"));
const RequestsIndex = lazy(() => import("./routes/user/requests.index"));
const RequestsNew = lazy(() => import("./routes/user/requests.new"));
const RequestsDetails = lazy(() => import("./routes/user/requests.$requestId"));
const Settings = lazy(() => import("./routes/user/settings"));

import AdminProtectedRoute from "./components/auth/AdminProtectedRoute";

// Admin Routes
const AdminLogin = lazy(() => import("./routes/admin/login"));
const AdminDashboard = lazy(() => import("./routes/admin/dashboard"));
const AdminDonations = lazy(() => import("./routes/admin/donations"));
const AdminDonors = lazy(() => import("./routes/admin/donors"));
const AdminInventory = lazy(() => import("./routes/admin/inventory"));
const AdminNotifications = lazy(() => import("./routes/admin/notifications"));
const AdminReports = lazy(() => import("./routes/admin/reports"));
const AdminRequests = lazy(() => import("./routes/admin/requests"));
const AdminSettings = lazy(() => import("./routes/admin/settings"));
const AdminUsers = lazy(() => import("./routes/admin/users"));
const AdminProfile = lazy(() => import("./routes/admin/profile"));
const AdminMessages = lazy(() => import("./routes/admin/messages"));

import { Toaster } from "@/components/blood/Toast";

const LoadingScreen = () => (
  <div className="flex h-screen w-screen items-center justify-center bg-background">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-red-500 border-t-transparent" />
  </div>
);

function App() {
  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Suspense fallback={<LoadingScreen />}>
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
        </Suspense>
      </BrowserRouter>
    </>
  );
}

export default App;
