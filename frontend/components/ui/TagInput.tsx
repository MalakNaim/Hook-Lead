'use client';
import { useState, KeyboardEvent } from 'react';

interface TagInputProps {
  label?: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  hint?: string;
  error?: string;
  suggestions?: string[];
  disabled?: boolean;
}

export function TagInput({
  label,
  tags,
  onChange,
  placeholder = 'Type and press Enter…',
  hint,
  error,
  suggestions,
  disabled,
}: TagInputProps) {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const addTag = (value: string) => {
    const trimmed = value.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInput('');
    setShowSuggestions(false);
  };

  const removeTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(input);
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const filteredSuggestions =
    suggestions?.filter(
      (s) => s.toLowerCase().includes(input.toLowerCase()) && !tags.includes(s)
    ) ?? [];

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      )}
      <div
        className={`min-h-[42px] w-full rounded-lg border px-2 py-1.5 transition-colors focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 ${
          error ? 'border-red-400 bg-red-50' : 'border-slate-300 bg-white hover:border-slate-400'
        } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
      >
        <div className="flex flex-wrap gap-1.5 items-center">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium"
            >
              {tag}
              {!disabled && (
                <button
                  type="button"
                  onClick={() => removeTag(i)}
                  className="hover:text-indigo-900 transition-colors leading-none"
                  aria-label={`Remove ${tag}`}
                >
                  <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
            </span>
          ))}
          {!disabled && (
            <div className="relative flex-1 min-w-[120px]">
              <input
                type="text"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setShowSuggestions(true);
                }}
                onKeyDown={handleKeyDown}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                placeholder={tags.length === 0 ? placeholder : ''}
                className="w-full text-sm text-slate-900 placeholder-slate-400 outline-none py-0.5 px-1 bg-transparent"
              />
              {showSuggestions && input && filteredSuggestions.length > 0 && (
                <div className="absolute top-full left-0 mt-1 w-52 bg-white border border-slate-200 rounded-lg shadow-lg z-20 py-1 overflow-hidden">
                  {filteredSuggestions.slice(0, 6).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onMouseDown={() => addTag(s)}
                      className="w-full text-left px-3 py-1.5 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
      {hint && !error && <p className="mt-1.5 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}
