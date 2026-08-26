'use client';

import React from 'react';
import { SUPPORTED_LANGUAGES } from '@/lib/judge0';
import type { CodingLanguage } from '@/types';

interface LanguageSelectorProps {
  value: CodingLanguage;
  onChange: (lang: CodingLanguage) => void;
  allowedLanguages?: CodingLanguage[];
  className?: string;
}

export default function LanguageSelector({ value, onChange, allowedLanguages, className }: LanguageSelectorProps) {
  const langs = allowedLanguages
    ? SUPPORTED_LANGUAGES.filter(l => allowedLanguages.includes(l.key as CodingLanguage))
    : SUPPORTED_LANGUAGES;

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as CodingLanguage)}
      className={`h-8 px-2 text-xs font-medium bg-[#1e1e1e] text-gray-300 border border-[#3e3e3e] rounded focus:outline-none focus:border-blue-500 ${className || ''}`}
    >
      {langs.map(l => (
        <option key={l.key} value={l.key}>{l.name}</option>
      ))}
    </select>
  );
}
