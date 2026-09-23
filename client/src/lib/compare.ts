import { useSyncExternalStore } from "react";
import { toast } from "sonner";

export const COMPARE_LIMIT = 3;
const STORAGE_KEY = "streamflo:compare";

function readStored(): string[] {
  try {
    const parsed: unknown = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((slug): slug is string => typeof slug === "string").slice(0, COMPARE_LIMIT) : [];
  } catch {
    return [];
  }
}

let selection = readStored();
const listeners = new Set<() => void>();

function commit(next: string[]) {
  selection = next;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage can be unavailable (private mode); the in-memory list still works.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export const compare = {
  has: (slug: string) => selection.includes(slug),
  add(slug: string) {
    if (selection.includes(slug)) return "exists" as const;
    if (selection.length >= COMPARE_LIMIT) return "full" as const;
    commit([...selection, slug]);
    return "added" as const;
  },
  remove: (slug: string) => commit(selection.filter((s) => s !== slug)),
  set: (slugs: string[]) => commit(Array.from(new Set(slugs)).slice(0, COMPARE_LIMIT)),
  clear: () => commit([]),
};

export function useCompare() {
  return useSyncExternalStore(subscribe, () => selection);
}

export function toggleCompare(slug: string, name: string) {
  if (compare.has(slug)) {
    compare.remove(slug);
    toast(`${name} removed from comparison`);
    return;
  }
  if (compare.add(slug) === "full") toast(`You can compare up to ${COMPARE_LIMIT} schools. Remove one to add ${name}.`);
  else toast(`${name} added to comparison`);
}
