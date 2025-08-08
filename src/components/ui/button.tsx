import * as React from "react";
import { cn } from "../../lib/utils";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50 disabled:pointer-events-none";
    const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
      primary: "bg-amber-600 text-white hover:bg-amber-700",
      secondary: "bg-zinc-200 text-zinc-900 hover:bg-zinc-300",
      ghost: "bg-transparent hover:bg-zinc-100 text-zinc-900",
      danger: "bg-rose-600 text-white hover:bg-rose-700",
    };
    return (
      <button ref={ref} className={cn(base, variants[variant], className)} {...props} />
    );
  }
);
Button.displayName = "Button";


