'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  children?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'danger';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen, title, message, children,
  confirmText = 'Confirm', cancelText = 'Cancel',
  variant = 'default', onConfirm, onCancel,
}: ConfirmDialogProps) {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
      <div
        className="bg-surface rounded-lg border border-border shadow-lg w-full max-w-md mx-4"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'scale(1)' : 'scale(0.95)',
          transition: 'opacity 0.15s ease, transform 0.15s ease',
        }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="text-base font-semibold text-text">{title}</h3>
          <button onClick={onCancel} className="p-1 rounded-md hover:bg-[var(--color-sidebar-hover)] text-text-secondary">
            <X size={18} />
          </button>
        </div>
        <div className="px-5 py-4">
          <p className="text-sm text-text-secondary">{message}</p>
          {children && <div className="mt-3">{children}</div>}
        </div>
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-border bg-bg rounded-b-lg">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-text-secondary bg-surface border border-border rounded-md hover:bg-[var(--color-sidebar-hover)] transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors ${
              variant === 'danger'
                ? 'bg-error hover:bg-red-700'
                : 'bg-primary hover:bg-primary-hover'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
