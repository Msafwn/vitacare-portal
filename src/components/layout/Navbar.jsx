import { Link } from "react-router-dom";
import { Bell, LogOut, Menu, Settings, User } from "lucide-react";
import Logo from "../blood/Logo";
import Avatar from "../blood/Avatar";
import Dropdown, { DropdownItem, DropdownLabel } from "../blood/Dropdown";
import SearchBar from "../blood/SearchBar";
import { currentUser } from "@/data/mock";

export default function Navbar({ onMenu, admin = false, links = [], showSearch = true, guest = false }) {
  return (
    <header className="sticky top-0 z-40 h-16 border-b border-border bg-card/90 backdrop-blur">
      <div className="mx-auto flex h-full max-w-[1400px] items-center gap-4 px-4 sm:px-6">
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
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeProps={{ className: "!text-foreground !bg-muted" }}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        )}

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          {guest ? (
            <>
              <Link
                to="/login"
                className="rounded-xl px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-brand-2"
              >
                Become a donor
              </Link>
            </>
          ) : (
          <>
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
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
          </Link>
          <Dropdown
            trigger={
              <span className="flex items-center gap-2 rounded-xl px-1.5 py-1 hover:bg-muted">
                <Avatar name={admin ? "Admin User" : currentUser.name} size="sm" />
                <span className="hidden text-sm font-medium text-foreground sm:block">
                  {admin ? "Admin User" : currentUser.name}
                </span>
              </span>
            }
          >
            <DropdownLabel>{admin ? "admin@lifedrop.org" : currentUser.email}</DropdownLabel>
            <Link to={admin ? "/admin/settings" : "/profile"}>
              <DropdownItem>
                <User className="h-4 w-4" /> Profile
              </DropdownItem>
            </Link>
            <Link to={admin ? "/admin/settings" : "/settings"}>
              <DropdownItem>
                <Settings className="h-4 w-4" /> Settings
              </DropdownItem>
            </Link>
            <Link to={admin ? "/admin/login" : "/login"}>
              <DropdownItem className="text-primary">
                <LogOut className="h-4 w-4" /> Sign out
              </DropdownItem>
            </Link>
          </Dropdown>
          </>
          )}
        </div>
      </div>
    </header>
  );
}
