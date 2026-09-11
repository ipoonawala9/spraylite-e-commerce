"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { AnimatePresence, useReducedMotion } from "motion/react";
import { type ReactNode, useEffect } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/cn";
import { m } from "@/lib/motion";
import { IconButton } from "./IconButton";

/** Where a flick would come to rest (Apple's projection, deceleration 0.998). */
const project = (velocity: number) => ((velocity / 1000) * 0.998) / (1 - 0.998);

/** Projected travel past which a release dismisses the sheet. */
const DISMISS_DISTANCE = 140;

interface SheetProps {
  open: boolean;
  onClose: () => void;
  /** The edge it slides from, next to the button that opened it. */
  side?: "left" | "right";
  title: string;
  description?: string;
  footer?: ReactNode;
  children: ReactNode;
}

/**
 * Side sheet on Radix Dialog (focus trap, Esc, focus return) with a spring
 * that starts from wherever the sheet is. Drag it toward its edge to dismiss;
 * a quick flick counts, because the release velocity is projected forward.
 */
export function Sheet({
  open,
  onClose,
  side = "right",
  title,
  description,
  footer,
  children,
}: SheetProps) {
  const reduce = useReducedMotion();
  const direction = side === "right" ? 1 : -1;
  const hidden = reduce ? { opacity: 0 } : { x: `${direction * 100}%` };
  const shown = reduce ? { opacity: 1 } : { x: 0 };

  // Toasts sit above everything; clear them so they don't cover the sheet.
  useEffect(() => {
    if (open) toast.dismiss();
  }, [open]);

  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <m.div
                className="fixed inset-0 z-50 bg-ink/40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              />
            </Dialog.Overlay>
            <Dialog.Content
              asChild
              forceMount
              {...(description ? {} : { "aria-describedby": undefined })}
            >
              <m.div
                className={cn(
                  "fixed inset-y-0 z-50 flex w-full max-w-[26rem] flex-col bg-tin shadow-sheet outline-none sm:inset-y-2 sm:rounded-panel",
                  side === "right" ? "right-0 sm:right-2" : "left-0 sm:left-2",
                )}
                initial={hidden}
                animate={shown}
                exit={hidden}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                drag={reduce ? false : "x"}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={
                  side === "right"
                    ? { left: 0.04, right: 0.8 }
                    : { left: 0.8, right: 0.04 }
                }
                onDragEnd={(_, info) => {
                  const travel =
                    (info.offset.x + project(info.velocity.x)) * direction;
                  if (travel > DISMISS_DISTANCE) onClose();
                }}
              >
                <header className="flex items-start justify-between gap-4 px-6 pt-5 pb-4">
                  <div>
                    <Dialog.Title className="type-h3">{title}</Dialog.Title>
                    {description && (
                      <Dialog.Description className="mt-0.5 type-small text-ink-soft">
                        {description}
                      </Dialog.Description>
                    )}
                  </div>
                  <Dialog.Close asChild>
                    <IconButton label="Close" className="-mt-1 -mr-2">
                      <X className="size-5" aria-hidden />
                    </IconButton>
                  </Dialog.Close>
                </header>
                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pb-6">
                  {children}
                </div>
                {footer && (
                  <footer className="border-t border-ink/10 px-6 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
                    {footer}
                  </footer>
                )}
              </m.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
