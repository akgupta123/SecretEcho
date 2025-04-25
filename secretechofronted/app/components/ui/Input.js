// app/components/ui/Input.jsx
'use client';

export function Input({ className = '', ...props }) {
  return (
    <input
      className={`input ${className}`}
      {...props}
    />
  );
}
