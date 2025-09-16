import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { each } from "lodash";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function createActions(prefix: string, types: string[]) {
  const results: Record<string, string> = {};

  each(types, (type) => {
    results[type] = `${prefix}.${type}`;
  });

  return results;
}
