interface FormSelectProps {
    label: string;
    name: string;
    required?: boolean;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: { value: string; label: string }[];
    placeholder?: string;
    error?: string;
}

export default function FormSelect({
    label,
    name,
    required = false,
    value,
    onChange,
    options,
    placeholder = 'Sélectionnez une option',
    error,
}: FormSelectProps) {
    return (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1.5">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <select
                id={name}
                name={name}
                required={required}
                value={value}
                onChange={onChange}
                aria-invalid={!!error}
                aria-describedby={error ? `${name}-error` : undefined}
                className={`w-full px-4 py-3 rounded-xl border outline-none transition-all text-sm bg-white appearance-none ${
                    error
                        ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                        : 'border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
                }`}
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 12px center',
                    paddingRight: '40px',
                }}
            >
                <option value="" disabled>
                    {placeholder}
                </option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            {error && (
                <p id={`${name}-error`} className="text-red-500 text-xs mt-1" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
}
