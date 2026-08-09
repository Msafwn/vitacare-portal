import { Search } from "lucide-react";
import Input from "./Input";

export default function SearchBar({ placeholder = "Search…", ...props }) {
  return <Input icon={Search} placeholder={placeholder} {...props} />;
}
