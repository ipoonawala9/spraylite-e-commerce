import type { ReactNode } from "react";

interface EmptyStateProps {
  visual: ReactNode;
  title: string;
  body: string;
  action?: ReactNode;
}

export function EmptyState({ visual, title, body, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center py-10 text-center">
      {visual}
      <h3 className="mt-6 type-h3">{title}</h3>
      <p className="mt-2 max-w-[30ch] text-ink-soft">{body}</p>
      {action && <div className="mt-6 w-full">{action}</div>}
    </div>
  );
}
