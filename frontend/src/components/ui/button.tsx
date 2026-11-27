import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "dark" | "danger-outline";
export type ButtonSize = "lg" | "md" | "sm";

const VARIANT: Record<ButtonVariant, string> = {
  primary: "bg-brand text-white shadow-cta disabled:shadow-none",
  secondary: "border border-line bg-white text-ink",
  dark: "bg-ink text-white",
  "danger-outline": "border border-danger-line bg-white text-danger",
};

const SIZE: Record<ButtonSize, string> = {
  lg: "h-13.5 rounded-btn px-5 text-[17px]",
  md: "h-11 rounded-btn px-4 text-sm",
  sm: "h-9 rounded-[10px] px-3.5 text-[13px]",
};

/** <button>과 <Link>에 같은 모양을 주기 위한 클래스 생성기 */
export function buttonClass(variant: ButtonVariant = "primary", size: ButtonSize = "lg", className?: string) {
  return cn(
    "inline-flex items-center justify-center gap-2.5 font-bold whitespace-nowrap transition-colors",
    "disabled:border-transparent disabled:bg-line disabled:text-ink-faint",
    VARIANT[variant],
    SIZE[size],
    className,
  );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({ variant = "primary", size = "lg", className, type = "button", ...rest }: ButtonProps) {
  return <button type={type} className={buttonClass(variant, size, className)} {...rest} />;
}

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("size-4.5 animate-spin rounded-full border-[2.5px] border-white/40 border-t-white", className)}
    />
  );
}
