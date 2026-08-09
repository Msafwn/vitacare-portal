import { useState } from "react";
import {
  Bell,
  BarChart3,
  Boxes,
  FileText,
  HeartHandshake,
  LayoutDashboard,
  Settings,
  UserCheck,
  Users,
} from "lucide-react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const items = [
  { section: "Overview" },
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/reports", label: "Reports", icon: BarChart3 },
  { section: "Management" },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/donors", label: "Donors", icon: UserCheck },
  { to: "/admin/requests", label: "Blood Requests", icon: FileText, badge: 4 },
  { to: "/admin/donations", label: "Donations", icon: HeartHandshake },
  { to: "/admin/inventory", label: "Blood Inventory", icon: Boxes },
  { section: "System" },
  { to: "/admin/notifications", label: "Notifications", icon: Bell },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar onMenu={() => setOpen(true)} admin />
      <div className="mx-auto flex w-full max-w-[1400px]">
        <Sidebar items={items} open={open} onClose={() => setOpen(false)} />
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
