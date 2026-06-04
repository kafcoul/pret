interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

export default function FormInput({
  label,
  name,
  type = 'text',
  required = false,
  placeholder,
  value,
  onChange,
  error,
}: FormInputProps) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`w-full px-4 py-3 rounded-xl border outline-none transition-all text-sm ${error
            ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
            : 'border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
          }`}
      />
      {error && (
        <p id={`${name}-error`} className="text-red-500 text-xs mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
