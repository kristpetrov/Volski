"use client";

import { focusRing } from "@/components/console/styles";

export function FilterBar<T extends string>({
  query,
  onQuery,
  placeholder,
  filters,
  value,
  onChange,
  label,
}: {
  query: string;
  onQuery: (value: string) => void;
  placeholder: string;
  filters: { id: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  label: string;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <form
        role="search"
        className="sm:w-64"
        onSubmit={(event) => event.preventDefault()}
      >
        <label>
          <span className="sr-only">{placeholder}</span>
          <input
            value={query}
            onChange={(event) => onQuery(event.target.value)}
            placeholder={placeholder}
            className={`h-10 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 text-sm outline-none placeholder:text-muted/70 focus:border-accent/50 ${focusRing}`}
          />
        </label>
      </form>
      <div role="group" aria-label={label} className="flex flex-wrap gap-1">
        {filters.map((filter) => {
          const selected = value === filter.id;
          return (
            <button
              key={filter.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(filter.id)}
              className={`rounded-full px-3 py-1 font-mono text-[10px] tracking-[0.14em] uppercase ${focusRing} ${selected ? "bg-accent/15 text-accent" : "text-muted hover:bg-white/5"}`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
