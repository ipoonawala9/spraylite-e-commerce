"use client";

import { Toaster } from "sonner";

export function AppToaster() {
  return (
    <Toaster
      position="bottom-center"
      offset={20}
      mobileOffset={12}
      duration={4000}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "flex w-full items-center gap-3 rounded-2xl bg-ink px-4 py-3 text-tin shadow-sheet font-sans",
          title: "text-sm",
          actionButton:
            "press ml-auto h-8 shrink-0 rounded-full bg-lite px-3.5 text-sm font-semibold text-ink",
        },
      }}
    />
  );
}
