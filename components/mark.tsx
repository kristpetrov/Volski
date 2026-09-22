export function Mark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`grid size-8 place-items-center rounded-md border border-accent/30 bg-accent/10 text-accent ${className}`}
    >
      <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
        <path
          d="M4 7 L12 18 L20 7"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
