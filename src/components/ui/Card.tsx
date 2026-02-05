import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-background-card rounded-2xl border border-border shadow-macos relative overflow-hidden",
          hover &&
            "transition-transform duration-200 hover:scale-[1.02] hover:shadow-[0_8px_30px_rgb(0,0,0,0.3)] cursor-pointer will-change-transform",
          className,
        )}
        {...props}
      />
    );
  },
);
Card.displayName = "Card";
