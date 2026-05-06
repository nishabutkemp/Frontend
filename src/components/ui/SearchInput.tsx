import { Search } from "lucide-react";

export function SearchInput({ value, onChange, placeholder, label }: { value: string; onChange: (value: string) => void; placeholder: string; label: string }) {
  return (
    <label className="search">
      <span className="sr-only">{label}</span>
      <Search size={18} aria-hidden="true" />
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
    </label>
  );
}
