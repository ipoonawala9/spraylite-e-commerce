"use client";

import { m } from "@/lib/motion";

interface NoticeProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

/**
 * Inline confirmation inside a sheet. Toasts can't be used there: the modal
 * makes everything behind it inert. The action takes focus, because the
 * control the user just pressed has gone.
 */
export function Notice({ message, actionLabel, onAction }: NoticeProps) {
  return (
    <m.div
      role="status"
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-3 flex items-center justify-between gap-3 rounded-field bg-aluminium px-4 py-3 text-sm"
    >
      <span>{message}</span>
      {actionLabel && onAction && (
        <button
          type="button"
          autoFocus
          onClick={onAction}
          className="shrink-0 press rounded-full px-2 py-1 font-semibold underline underline-offset-4"
        >
          {actionLabel}
        </button>
      )}
    </m.div>
  );
}
