export function TextArea({
  label,
  value,
  onChange,
  helper,
  error,
  placeholder,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  helper?: string;
  error?: string | null;
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <textarea value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} disabled={disabled} />
      {helper && !error && <small>{helper}</small>}
      {error && <small className="field-error">{error}</small>}
    </label>
  );
}
