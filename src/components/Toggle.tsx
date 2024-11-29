import React from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  icon?: React.ReactNode;
}

export function Toggle({ checked, onChange, label, icon }: ToggleProps) {
  return (
    <div className="flex items-center justify-between w-full px-4 py-2 text-sm hover:bg-surface-secondary dark:hover:bg-surface-dark-secondary">
      <div className="flex items-center">
        {icon && <span className="mr-3 text-secondary dark:text-text-dark-secondary">{icon}</span>}
        <span className="text-text-primary dark:text-text-dark-primary">{label}</span>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
          checked ? 'bg-primary dark:bg-accent' : 'bg-gray-200 dark:bg-gray-700'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}