import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  validateIndianPhoneNumber,
  getCarrierInfo,
} from "@/utils/indianPhoneValidation";
import { AlertCircle, CheckCircle, Phone } from "lucide-react";

interface PhoneNumberInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  showCarrierInfo?: boolean;
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  value,
  onChange,
  label = "Mobile Number",
  placeholder = "98765 43210",
  required = false,
  className = "",
  showCarrierInfo = true,
}) => {
  const [validation, setValidation] = useState(validateIndianPhoneNumber(""));
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (value) {
      const result = validateIndianPhoneNumber(value);
      setValidation(result);
    } else {
      setValidation({ isValid: true, formatted: "" });
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const result = validateIndianPhoneNumber(inputValue);
    onChange(result.formatted);
  };

  const getBorderColor = () => {
    if (!value) return "border-blue-200";
    return validation.isValid ? "border-green-300" : "border-red-300";
  };

  const carrier = value && validation.isValid ? getCarrierInfo(value) : "";

  return (
    <div>
      <Label htmlFor="phone" className="text-gray-700 font-semibold">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>

      <div className="relative">
        <div className="absolute left-3 top-3 flex items-center space-x-2">
          <span className="text-gray-500 text-sm font-medium">+91</span>
          <div className="w-px h-4 bg-gray-300"></div>
        </div>

        <Input
          id="phone"
          type="tel"
          value={value}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          required={required}
          className={`mt-2 rounded-xl pl-16 pr-10 ${getBorderColor()} focus:border-blue-500 focus:ring-blue-200 ${className}`}
          placeholder={placeholder}
          maxLength={12} // Allow space for formatting
        />

        {value && (
          <div className="absolute right-3 top-5">
            {validation.isValid ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600" />
            )}
          </div>
        )}
      </div>

      {/* Validation Message */}
      {value && !validation.isValid && validation.message && (
        <p className="mt-1 text-sm text-red-600">{validation.message}</p>
      )}

      {/* Carrier Info */}
      {showCarrierInfo &&
        value &&
        validation.isValid &&
        carrier &&
        carrier !== "Unknown" && (
          <div className="mt-1 flex items-center space-x-1">
            <Phone className="w-3 h-3 text-blue-600" />
            <span className="text-xs text-blue-600 font-medium">{carrier}</span>
          </div>
        )}

      {/* Helper Text */}
      {focused && !value && (
        <p className="mt-1 text-xs text-gray-500">
          Enter 10-digit Indian mobile number (starts with 6, 7, 8, or 9)
        </p>
      )}
    </div>
  );
};

export default PhoneNumberInput;
