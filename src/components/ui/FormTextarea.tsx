interface FormTextareaProps {
  label: string;
  name: string;
  required?: boolean;
  placeholder?: string;
  rows?: number;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
}

export default function FormTextarea({
  label,
  name,
  required = false,
  placeholder,
  rows = 5,
  value,
  onChange,
  error,
}: FormTextareaProps) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        required={required}
        placeholder={placeholder}
        rows={rows}
        value={value}
        onChange={onChange}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`w-full px-4 py-3 rounded-xl border ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500/20'} focus:ring-2 outline-none transition-all text-sm resize-vertical`}
      />
      {error && <p id={`${name}-error`} role="alert" className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
