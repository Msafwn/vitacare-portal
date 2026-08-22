import { forwardRef } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { inputBase } from "./Input";

const Select = forwardRef(({ className, options = [], placeholder, ...props }, ref) => {
  return (
    <div className="relative">
      <select ref={ref} className={cn(inputBase, "appearance-none pr-10", className)} {...props}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((o) => {
          const value = typeof o === "string" ? o : o.value;
          const label = typeof o === "string" ? o : o.label;
          return (
            <option key={value} value={value}>
              {label}
            </option>
          );
        })}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
});
Select.displayName = "Select";

export default Select;
