import { cn } from "@/lib/utils";

export function SunMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={cn("size-7 text-sun", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.1"
      strokeLinecap="round"
    >
      <circle cx="16" cy="16" r="5.4" fill="currentColor" stroke="none" />
      <path d="M16 2.6v3.4M16 26v3.4M2.6 16H6M26 16h3.4M6.6 6.6l2.4 2.4M23 23l2.4 2.4M25.4 6.6L23 9M9 23l-2.4 2.4" />
    </svg>
  );
}

export function DaylyLogo({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const text = size === "lg" ? "text-4xl" : size === "sm" ? "text-lg" : "text-2xl";
  const mark = size === "lg" ? "size-10" : size === "sm" ? "size-5" : "size-7";
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <SunMark className={mark} />
      <span className={cn("font-extrabold tracking-tight", text)}>Dayly</span>
    </span>
  );
}
