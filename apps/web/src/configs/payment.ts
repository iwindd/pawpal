export type PaymentData = {
  image: string;
  label: string;
  value: string;
  disabledTopup?: boolean;
  description?: string;
};

const paymentMethods: PaymentData[] = [
  {
    image: "assets/images/fallback-product.jpg",
    label: "Pawpal Wallet",
    value: "pawpal-wallet",
    disabledTopup: true,
    description: undefined,
  },
  {
    image: "assets/images/fallback-product.jpg",
    label: "True Money Wallet",
    value: "true-money-wallet",
    description: undefined,
  },
  {
    image: "assets/images/fallback-product.jpg",
    label: "PromptPay",
    description: undefined,
    value: "promptpay",
  },
];

export type PaymentMethod = (typeof paymentMethods)[number]["value"];

export default paymentMethods;
