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
  MessageSquare
} from "lucide-react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { cn } from "../../lib/utils";
import { useGetAdminRequestsQuery, useGetMessagesQuery } from "@/features/admin/adminApiSlice";

const items = [
  { section: "Overview" },
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/reports", label: "Reports", icon: BarChart3 },
  { section: "Management" },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/donors", label: "Donors", icon: UserCheck },
  { to: "/admin/requests", label: "Blood Requests", icon: FileText, badge: 0 },
  { to: "/admin/donations", label: "Donations", icon: HeartHandshake },
  { to: "/admin/inventory", label: "Blood Inventory", icon: Boxes },
  { section: "System" },
  { to: "/admin/messages", label: "Messages", icon: MessageSquare, badge: 0 },
  { to: "/admin/notifications", label: "Notifications", icon: Bell },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({ children }) {
  const [open, setOpen] = useState(false);
  const { data: response } = useGetAdminRequestsQuery({ limit: 1, status: 'pending' });

  const { data: messagesResponse } = useGetMessagesQuery();

  const pendingCount = response?.data?.pendingCount || 0;
  const pendingMessagesCount = (messagesResponse?.data || []).filter(msg => msg.status === 'pending').length;

  const dynamicItems = items.map((item) => {
    if (item.to === "/admin/requests") {
      return { ...item, badge: pendingCount > 0 ? pendingCount : undefined };
    }
    if (item.to === "/admin/messages") {
      return { ...item, badge: pendingMessagesCount > 0 ? pendingMessagesCount : undefined };
    }
    return item;
  });

  return (
    <div className={cn('min-h-screen', 'bg-background')}>
      <Navbar onMenu={() => setOpen(true)} admin />
      <div className={cn('mx-auto', 'flex', 'w-full', 'max-w-[1400px]', '2xl:max-w-[2560px]')}>
        <Sidebar items={dynamicItems} open={open} onClose={() => setOpen(false)} />
        <main className={cn('min-w-0', 'flex-1', 'px-4', 'py-6', 'sm:px-6', 'lg:px-8')}>{children}</main>
      </div>
    </div>
  );
}
