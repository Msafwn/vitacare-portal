import Navbar from "./Navbar";
import Footer from "./Footer";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
  { to: "/find-donors", label: "Find Donors" },
];

export default function SiteLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar links={links} showSearch={false} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
