import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatter = (locale = "en-US", currency = "USD") =>
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  });
