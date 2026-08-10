import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Bell,
  Droplet,
  FileText,
  HeartHandshake,
  LayoutDashboard,
  PlusCircle,
  Search,
  Settings,
  User,
} from "lucide-react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Button from "../blood/Button";

const items = [
  { section: "Overview" },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/find-donors", label: "Find Donors", icon: Search, match: "/donors" },
  { section: "Requests" },
  { to: "/requests/new", label: "Create Request", icon: PlusCircle },
  { to: "/requests", label: "My Requests", icon: FileText },
  { to: "/donation-history", label: "Donation History", icon: HeartHandshake },
  { section: "Account" },
  { to: "/notifications", label: "Notifications", icon: Bell, badge: 2 },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function UserLayout({ children }) {
  const [open, setOpen] = useState(false);
  const { isDonor } = useSelector(state => state.user);

  return (
    <div className="min-h-screen bg-background">
      <Navbar onMenu={() => setOpen(true)} />
      <div className="mx-auto flex w-full max-w-[1400px]">
        <Sidebar
          items={items}
          open={open}
          onClose={() => setOpen(false)}
          footer={
            isDonor ? (
              <div className="rounded-xl border border-border bg-primary-soft p-4">
                <Droplet className="h-5 w-5 fill-current text-primary" />
                <p className="mt-2 text-sm font-semibold text-foreground">You can donate again</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  It has been 56 days since your last donation.
                </p>
              </div>
            ) : (
              <div className="rounded-xl border border-border bg-muted/50 p-4">
                <HeartHandshake className="h-5 w-5 text-primary" />
                <p className="mt-2 text-sm font-semibold text-foreground">Become a Donor</p>
                <p className="mt-1 text-xs text-muted-foreground mb-3">
                  Help someone in need by becoming a blood donor today.
                </p>
                <Button as="link" to="/become-donor" className="w-full text-xs h-8">
                  Become a Donor
                </Button>
              </div>
            )
          }
        />
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
