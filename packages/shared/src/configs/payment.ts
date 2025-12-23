export type PaymentData = {
  image: string;
  label: string;
  value: string;
  disabledTopup?: boolean;
  description?: string;
  default?: boolean;
};

export const paymentMethods: PaymentData[] = [
  {
    image: "assets/images/fallback-product.png",
    label: "Pawpal Wallet",
    value: "pawpal-wallet",
    disabledTopup: true,
    description: undefined,
  },
  {
    image: "assets/images/fallback-product.png",
    label: "PromptPay",
    description: undefined,
    value: "promptpay",
    default: true,
  },
];

export type PaymentMethod = (typeof paymentMethods)[number]["value"];

export const defaultPaymentMethod =
  paymentMethods.find((method) => method.default)?.value ||
  paymentMethods[0]?.value ||
  "";
