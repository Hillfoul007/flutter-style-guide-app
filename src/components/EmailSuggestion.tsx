import React from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, ArrowRight } from "lucide-react";

interface EmailSuggestionProps {
  suggestions: string[];
  reason: string;
  onSelectSuggestion: (suggestion: string) => void;
  onDismiss: () => void;
}

const EmailSuggestion: React.FC<EmailSuggestionProps> = ({
  suggestions,
  reason,
  onSelectSuggestion,
  onDismiss,
}) => {
  return (
    <div className="mt-2 p-4 bg-amber-50 border border-amber-200 rounded-xl">
      <div className="flex items-start space-x-2">
        <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium text-amber-800">{reason}</p>

          <div className="mt-3 space-y-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => onSelectSuggestion(suggestion)}
                className="flex items-center justify-between w-full p-2 bg-white border border-amber-200 rounded-lg hover:bg-amber-50 hover:border-amber-300 transition-colors group"
              >
                <span className="text-sm text-gray-900 font-medium">
                  {suggestion}
                </span>
                <ArrowRight className="w-4 h-4 text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>

          <div className="mt-3 flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onDismiss}
              className="text-xs border-amber-300 text-amber-700 hover:bg-amber-50"
            >
              Continue with current email
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailSuggestion;
