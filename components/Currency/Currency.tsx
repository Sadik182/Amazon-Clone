import React from "react";

interface CurrencyProps {
  amount: number;
  currency?: string;
  className?: string;
}

export default function Currency({
  amount,
  currency = "USD",
  className = "",
}: CurrencyProps) {
  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);

  return <span className={className}>{formattedAmount}</span>;
}
