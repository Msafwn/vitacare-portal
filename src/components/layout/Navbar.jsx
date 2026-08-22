import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, LogOut, Menu, Settings, User } from "lucide-react";
import Logo from "../blood/Logo";
import Avatar from "../blood/Avatar";
import Dropdown, { DropdownItem, DropdownLabel } from "../blood/Dropdown";
import SearchBar from "../blood/SearchBar";
import { useGetCurrentUserQuery, useLogoutMutation } from "@/features/users/userApiSlice";
import { useGetNotificationsQuery } from "@/features/notifications/notificationApiSlice";
import { currentUser as mockUser } from "@/data/mock";

export default function Navbar({ onMenu, admin = false, links = [], showSearch = true, guest = false }) {
  const { data: response, isLoading } = useGetCurrentUserQuery();
  const { data: notifResponse } = useGetNotificationsQuery(undefined, { skip: !response?.data });
  const [logoutMutation] = useLogoutMutation();
  const navigate = useNavigate();
  const location = useLocation();

  // Use real data, fallback to mock only if explicitly allowed or during dev if you want, 
  // but for auth state we MUST use real data presence.
  const currentUser = response?.data;
  const isDonor = currentUser?.isDonor;

  // A user is a guest if explicitly passed OR if we have no user data from API (and not loading)
  const isActuallyGuest = guest ? (!currentUser) : (!currentUser && !isLoading);

  const notifications = notifResponse?.data || [];
  const hasUnread = notifications.some(n => !n.isRead);

  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
    } catch (err) {
      console.error("Logout failed", err);
    }
    navigate(admin ? "/admin/login" : "/login");
  };
  return (
    <header className="sticky top-0 z-40 h-16 border-b border-border bg-card/90 backdrop-blur">
      <div className="mx-auto flex h-full max-w-[1400px] 2xl:max-w-[2560px] items-center gap-4 px-4 sm:px-6">
        {onMenu && (
          <button
            onClick={onMenu}
            aria-label="Open menu"
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <Logo />
        {admin && (
          <span className="hidden rounded-full bg-primary-soft px-2.5 py-1 text-xs font-semibold text-primary sm:inline">
            Admin
          </span>
        )}

        {links.length > 0 && (
          <nav className="ml-6 hidden items-center gap-1 md:flex">
            {links.map((l) => {
              if (l.to === "/find-donors" && isActuallyGuest) return null;
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground ${location.pathname === l.to ? '!text-foreground !bg-muted' : 'text-muted-foreground'}`}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>
        )}

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          {isActuallyGuest ? (
            <>
              <Link
                to="/login"
                className="rounded-xl px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                Log in
              </Link>
              <Link
                to="/login?redirect=/become-donor"
                className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-brand-2"
              >
                Become a donor
              </Link>
            </>
          ) : currentUser ? (
            <>
              {!admin && !isDonor && (
                <Link
                  to="/become-donor"
                  className="hidden sm:inline-flex rounded-xl bg-primary/10 text-primary px-4 py-2 text-sm font-semibold transition-colors hover:bg-primary/20"
                >
                  Become a donor
                </Link>
              )}
              {showSearch && (
                <div className="hidden w-64 xl:block">
                  <SearchBar placeholder="Search donors, requests…" />
                </div>
              )}
              <Link
                to={admin ? "/admin/notifications" : "/notifications"}
                className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                {hasUnread && (
                  <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
                )}
              </Link>
              <Dropdown
                trigger={
                  <span className="flex items-center gap-2 rounded-xl px-1.5 py-1 hover:bg-muted">
                    <Avatar name={admin ? (currentUser?.name || "Admin User") : currentUser.name} src={!admin ? currentUser?.avatar : undefined} size="sm" />
                    <span className="hidden text-sm font-medium text-foreground sm:block">
                      {admin ? (currentUser?.name || "Admin User") : currentUser.name}
                    </span>
                  </span>
                }
              >
                <DropdownLabel>{admin ? (currentUser?.email || "admin@lifedrop.org") : currentUser.email}</DropdownLabel>
                <Link to={admin ? "/admin/profile" : "/profile"}>
                  <DropdownItem>
                    <User className="h-4 w-4" /> Profile
                  </DropdownItem>
                </Link>
                <Link to="/settings">
                  <DropdownItem>
                    <Settings className="h-4 w-4" /> Settings
                  </DropdownItem>
                </Link>
                <div onClick={handleLogout}>
                  <DropdownItem className="text-primary cursor-pointer">
                    <LogOut className="h-4 w-4" /> Sign out
                  </DropdownItem>
                </div>
              </Dropdown>
            </>
          ) : (
            <div className="h-8 w-8 animate-pulse rounded-full bg-muted"></div>
          )}
        </div>
      </div>
    </header>
  );
}
