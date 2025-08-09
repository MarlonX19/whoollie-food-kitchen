"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type DialogContextValue = {
  open: boolean;
  setOpen: (v: boolean) => void;
};

const DialogContext = React.createContext<DialogContextValue | null>(null);

export function Dialog({
  open,
  onOpenChange,
  children,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = typeof open === "boolean";
  const actualOpen = isControlled ? !!open : internalOpen;
  const setOpen = React.useCallback(
    (v: boolean) => {
      if (!isControlled) setInternalOpen(v);
      onOpenChange?.(v);
    },
    [isControlled, onOpenChange]
  );

  React.useEffect(() => {
    if (!actualOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [actualOpen, setOpen]);

  return (
    <DialogContext.Provider value={{ open: actualOpen, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
}

type AnyElement = React.ReactElement<Record<string, unknown>>;

export function DialogTrigger({
  asChild,
  children,
}: {
  asChild?: boolean;
  children: AnyElement;
}) {
  const ctx = React.useContext(DialogContext)!;
  if (asChild) {
    const child: AnyElement = children as AnyElement;
    const existingOnClick = (child.props as Record<string, unknown>)
      ?.onClick as ((e: React.MouseEvent) => void) | undefined;
    return React.cloneElement(child, {
      onClick: (e: React.MouseEvent) => {
        existingOnClick?.(e);
        ctx.setOpen(true);
      },
    });
  }
  return <button onClick={() => ctx.setOpen(true)}>{children}</button>;
}

export function DialogContent({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const ctx = React.useContext(DialogContext)!;
  if (!ctx.open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => ctx.setOpen(false)}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative z-10 w-full max-w-lg overflow-hidden rounded-2xl bg-white p-6 shadow-xl",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("mb-4 space-y-1", className)}>{children}</div>;
}

export function DialogTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <h2 className={cn("text-lg font-semibold", className)}>{children}</h2>;
}

export function DialogFooter({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mt-6 flex justify-end gap-2", className)}>
      {children}
    </div>
  );
}

export function useDialog() {
  const ctx = React.useContext(DialogContext);
  if (!ctx) throw new Error("Dialog components must be used within <Dialog>");
  return ctx;
}
