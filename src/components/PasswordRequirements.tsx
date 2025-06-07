import React from "react";
import { CheckCircle, XCircle } from "lucide-react";
import {
  PasswordValidation,
  getPasswordStrengthColor,
  getPasswordStrengthBgColor,
} from "@/utils/passwordValidation";

interface PasswordRequirementsProps {
  validation: PasswordValidation;
  show: boolean;
}

const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({
  validation,
  show,
}) => {
  if (!show) return null;

  return (
    <div className="mt-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-700">
          Password Requirements
        </span>
        <div className="flex items-center space-x-1">
          <span
            className={`text-xs font-medium ${getPasswordStrengthColor(validation.strength)}`}
          >
            {validation.strength.charAt(0).toUpperCase() +
              validation.strength.slice(1)}
          </span>
          <div
            className={`w-2 h-2 rounded-full ${getPasswordStrengthBgColor(validation.strength)}`}
          ></div>
        </div>
      </div>

      <div className="space-y-1">
        {validation.requirements.map((req, index) => (
          <div key={index} className="flex items-center space-x-2">
            {req.met ? (
              <CheckCircle className="w-3 h-3 text-green-600" />
            ) : (
              <XCircle className="w-3 h-3 text-red-400" />
            )}
            <span
              className={`text-xs ${req.met ? "text-green-700" : "text-gray-600"}`}
            >
              {req.label}
            </span>
          </div>
        ))}
      </div>

      {validation.isValid && (
        <div className="mt-2 flex items-center space-x-1">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span className="text-xs font-medium text-green-700">
            Password meets all requirements!
          </span>
        </div>
      )}
    </div>
  );
};

export default PasswordRequirements;
