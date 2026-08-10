import { Link } from "react-router-dom";
import { Droplet } from "lucide-react";

export default function Logo({ compact = false }) {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <Droplet className="h-5 w-5 fill-current" />
      </span>
      {!compact && (
        <span className="text-base font-semibold tracking-tight text-foreground">
          Life<span className="text-primary">Drop</span>
        </span>
      )}
    </Link>
  );
}
