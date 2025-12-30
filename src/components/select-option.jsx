export function SelectOption({
  value,
  onChange,
  name,
  options,
  defaultOptionLabel,
  className = "",
}) {
  return (
    <select
      value={value}
      name={name}
      onChange={onChange}
      className={`custom-select ${className}`}
    >
      {defaultOptionLabel && <option value="">{defaultOptionLabel}</option>}

      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
