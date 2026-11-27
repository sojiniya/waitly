import { cn } from "@/lib/cn";
import { ClockIcon } from "./icons";

export function LogoMark({ className, iconSize = 22 }: { className?: string; iconSize?: number }) {
  return (
    <span className={cn("flex items-center justify-center bg-brand text-white", className)}>
      <ClockIcon size={iconSize} strokeWidth={2.4} />
    </span>
  );
}
