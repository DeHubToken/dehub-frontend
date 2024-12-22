/* eslint-disable */

import React, { InputHTMLAttributes, ReactNode, ReactText } from "react";

export interface BalanceInputProps {
  value: ReactText;
  onUserInput: (input: string) => void;
  currencyValue?: ReactNode;
  placeholder?: string;
  innerRef?: React.RefObject<HTMLInputElement>;
  inputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "placeholder" | "onChange">;
  isWarning?: boolean;
  isDisabled?: boolean;
  decimals?: number;
  unit?: string;
  switchEditingUnits?: () => void;
}

const BalanceInput = ({
  value,
  onUserInput,
  currencyValue,
  placeholder = "0",
  innerRef,
  inputProps,
  isWarning = false,
  isDisabled = false,
  decimals = 18,
  unit,
  ...props
}: BalanceInputProps) => {
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.validity.valid) {
      onUserInput(e.currentTarget.value.replace(/,/g, "."));
    }
  };

  return (
    <div
      className={`flex flex-col items-end rounded-lg p-2 ${
        isWarning
          ? "border-[#545B67] bg-[#3E4754] shadow-[0px_0px_0px_1px_#ED4B9E,0px_0px_0px_4px_rgba(237,_75,_158,_0.2)]"
          : "shadow-inner border-[#545B67] bg-[#3E4754]"
      }`}
      {...props}
    >
      <div className="flex items-center justify-end">
        <input
          type="text"
          pattern={`^[0-9]*[.,]?[0-9]{0,${decimals}}$`}
          inputMode="decimal"
          minLength={1}
          maxLength={80}
          min="0"
          value={value}
          onChange={handleOnChange}
          placeholder={placeholder}
          ref={innerRef}
          disabled={isDisabled}
          className="w-full border-none bg-transparent p-0 text-right text-[#EAEBEC] placeholder-[#bfc2c6] outline-none focus:ring-0"
          {...inputProps}
        />
        {unit && <span className="ml-1 whitespace-nowrap text-[#bfc2c6]">{unit}</span>}
      </div>
      {currencyValue && (
        <span className="text-right text-[14px] text-[#bfc2c6]">{currencyValue}</span>
      )}
    </div>
  );
};

export default BalanceInput;
