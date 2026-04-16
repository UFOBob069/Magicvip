import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function fmtDate(iso: string, opts?: Intl.DateTimeFormatOptions) {
  return new Date(iso + "T12:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    ...opts,
  });
}

export function fmtDateRange(a: string, b: string) {
  const start = new Date(a + "T12:00:00");
  const end = new Date(b + "T12:00:00");
  const sameMonth = start.getMonth() === end.getMonth();
  const startStr = start.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const endStr = sameMonth
    ? end.getDate().toString()
    : end.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${startStr}–${endStr}`;
}

export function eachDateInclusive(startISO: string, endISO: string): string[] {
  const out: string[] = [];
  const d = new Date(startISO + "T12:00:00");
  const end = new Date(endISO + "T12:00:00");
  while (d <= end) {
    out.push(d.toISOString().slice(0, 10));
    d.setDate(d.getDate() + 1);
  }
  return out;
}

export function intersectDates(a1: string, a2: string, b1: string, b2: string): string[] {
  const start = a1 > b1 ? a1 : b1;
  const end = a2 < b2 ? a2 : b2;
  if (start > end) return [];
  return eachDateInclusive(start, end);
}
