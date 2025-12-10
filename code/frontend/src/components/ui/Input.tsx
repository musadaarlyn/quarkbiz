import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = ({ label, error, ...props }: InputProps) => {
  return (
    <div className="space-y-1">
      {label && <label className="font-medium">{label}</label>}

      <input
        {...props}
        className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
      />

      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
};

export default Input;
