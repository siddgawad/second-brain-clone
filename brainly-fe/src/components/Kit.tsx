import React, { ReactElement, ReactNode, useEffect } from "react";
import clsx from "clsx";
import { X, Loader2 } from "lucide-react";

/* Container */
export const Container = ({ className = "", children }: { className?: string; children: ReactNode }) => (
  <div className={clsx("px-4 md:px-8 lg:px-12", className)}>{children}</div>
);

/* Card */
export const Card = ({ className = "", children }: { className?: string; children: ReactNode }) => (
  <div className={clsx("bg-white rounded-xl border border-gray-200 shadow-card", className)}>{children}</div>
);

/* Button */
export function Button({
  text,
  onClick,
  startIcon,
  endIcon,
  variant = "primary",
  size = "md",
  fullWidth,
  loading,
  className = "",
  type = "button",
  disabled
}: {
  text: string;
  onClick?: () => void;
  startIcon?: ReactElement;
  endIcon?: ReactElement;
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  loading?: boolean;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const v = {
    primary: "bg-primary-600 hover:bg-primary-700 text-white",
    secondary: "bg-primary-50 text-primary-700 hover:bg-primary-100",
    ghost: "text-primary-700 hover:bg-primary-50",
    outline: "border border-primary-600 text-primary-700 hover:bg-primary-50"
  }[variant];

  const s = {
    sm: "px-3 py-1.5 text-sm rounded-md",
    md: "px-4 py-2 text-sm md:text-base rounded-lg",
    lg: "px-6 py-3 text-base md:text-lg rounded-lg"
  }[size];

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={clsx(
        "inline-flex items-center justify-center gap-2 font-medium transition-colors disabled:opacity-50",
        v, s, fullWidth && "w-full", className
      )}
    >
      {loading ? <Loader2 className="animate-spin" size={16} /> : startIcon}
      <span>{text}</span>
      {!loading && endIcon}
    </button>
  );
}

/* Input */
export function Input({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  textarea,
  required,
  error
}: {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (v: string) => void;
  type?: "text" | "email" | "password" | "url";
  textarea?: boolean;
  required?: boolean;
  error?: string;
}) {
  return (
    <label className="block space-y-1">
      {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
      {textarea ? (
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          required={required}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          rows={4}
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          required={required}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </label>
  );
}

/* Badge (tag pill) */
export const Badge = ({ children }: { children: ReactNode }) => (
  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-primary-50 text-primary-700">
    {children}
  </span>
);

/* Modal w/ overlay + outside-click close */
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = "max-w-xl"
}: {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  maxWidth?: string;
}) {
  useEffect(() => {
    if (!isOpen) return;
    const onEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/60 animate-fadeIn"
        onClick={onClose}
        aria-hidden
      />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          className={clsx("w-full bg-white rounded-xl shadow-xl animate-slideUp", maxWidth)}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>
          <div className="p-5">{children}</div>
        </div>
      </div>
    </div>
  );
}
