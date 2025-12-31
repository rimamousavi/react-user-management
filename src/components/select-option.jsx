export function SelectOption({
  value,
  onChange,
  name,
  options,
  defaultOptionLabel,
  className = "",
}) {
  if (!options || options.length == 0) {
    return <p className="text-red-500">options requred</p>;
  }

  return (
    <select
      value={value}
      name={name}
      onChange={onChange}
      className={`custom-select ${className}`}
    >
      {defaultOptionLabel && <option value="">{defaultOptionLabel}</option>}

      {options?.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
