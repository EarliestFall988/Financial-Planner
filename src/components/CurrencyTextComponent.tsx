import React from "react";
import { formatCurrency } from "~/utils/currency";

export const CurrencyTextComponent: React.FC<{
  value?: number;
  className?: string;
}> = ({ value, className }) => {
  const negative = value ? value < 0 : false;
  return (
    <>
      {negative ? (
        <p className={`text-lg font-semibold text-red-500 ${className}`}>
          ({formatCurrency.format(Math.abs(value ?? 0))})
        </p>
      ) : (
        <p className={`text-lg font-semibold text-green-500 ${className}`}>
          {formatCurrency.format(Math.abs(value ?? 0))}
        </p>
      )}
    </>
  );
};
