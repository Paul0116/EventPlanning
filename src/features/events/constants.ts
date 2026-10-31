export const supportedCurrencies = [
  "AUD",
  "CAD",
  "EUR",
  "GBP",
  "HKD",
  "INR",
  "MYR",
  "NZD",
  "PHP",
  "SGD",
  "THB",
  "USD",
] as const;

export type SupportedCurrency = (typeof supportedCurrencies)[number];

export const eventTypes = ["BIRTHDAY", "WEDDING", "PARTY", "CORPORATE", "OTHER"] as const;
export type GatherlyEventType = (typeof eventTypes)[number];

export const defaultBudgetCategories = [
  "Venue",
  "Catering",
  "Decor",
  "Entertainment",
  "Logistics",
  "Other",
] as const;
