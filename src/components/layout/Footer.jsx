import { Link } from "react-router-dom";
import Logo from "../blood/Logo";
import { useGetCurrentUserQuery } from "@/features/users/userApiSlice";

export default function Footer() {
  const { data: response } = useGetCurrentUserQuery();
  const currentUser = response?.data;

  const groups = [
    {
      title: "Platform",
      links: [
        { label: "Find donors", to: currentUser ? "/find-donors" : "/login?redirect=/find-donors" },
        { label: "Create request", to: currentUser ? "/requests/new" : "/login?redirect=/requests/new" },
        { label: "Dashboard", to: currentUser ? `/dashboard?email=${encodeURIComponent(currentUser.email)}` : "/login?redirect=/dashboard" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", to: "/about" },
        { label: "Contact", to: "/contact" },
        { label: "Admin portal", to: "/admin/login" },
      ],
    },
  ];

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto grid max-w-[1400px] 2xl:max-w-[2560px] gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            LifeDrop connects verified blood donors with patients in need — safely, quickly and
            transparently.
          </p>
        </div>
        {groups.map((g) => (
          <div key={g.title}>
            <h4 className="text-sm font-semibold text-foreground">{g.title}</h4>
            <ul className="mt-4 space-y-2.5">
              {g.links.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-[1400px] 2xl:max-w-[2560px] flex-col items-center gap-3 px-4 py-6 text-center text-xs text-muted-foreground sm:flex-row sm:justify-between sm:text-left sm:px-6">
          <p className="text-balance">© 2026 LifeDrop Blood Donation Management System. All rights reserved.</p>
          <p>Privacy · Terms · Donor safety</p>
        </div>
      </div>
    </footer>
  );
}
