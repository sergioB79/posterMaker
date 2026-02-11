export const CREDIT_PACKS = [
  {
    id: "starter",
    name: "Starter",
    credits: 10,
    priceEur: 999,
    priceDisplay: "9.99",
    perImage: "1.00",
    popular: false,
  },
  {
    id: "creator",
    name: "Creator",
    credits: 30,
    priceEur: 2499,
    priceDisplay: "24.99",
    perImage: "0.83",
    popular: true,
  },
  {
    id: "studio",
    name: "Studio",
    credits: 100,
    priceEur: 6999,
    priceDisplay: "69.99",
    perImage: "0.70",
    popular: false,
  },
] as const;
