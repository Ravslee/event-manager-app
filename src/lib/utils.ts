import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number) {
  let currency = "USD";
  let locale = "en-US";
  
  try {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.currency) {
        currency = user.currency;
      }
    }
  } catch (e) {
    // Ignore parse error
  }

  // Set locale based on currency for better formatting
  if (currency === "INR") {
    locale = "en-IN";
  } else if (currency === "EUR") {
    locale = "de-DE";
  } else if (currency === "GBP") {
    locale = "en-GB";
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(amount);
}
