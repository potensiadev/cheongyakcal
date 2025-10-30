import { useState } from "react";
import { CalculatorForm } from "@/components/CalculatorForm";
import { ResultScreen } from "@/components/ResultScreen";
import { calculateScore } from "@/utils/calculator";

interface FormData {
  birthDate: string;
  homelessYears: string;
  dependents: string;
  subscriptionDate: string;
}

interface ResultData {
  totalScore: number;
  homelessScore: number;
  dependentsScore: number;
  subscriptionScore: number;
  level: "low" | "medium" | "high";
}

const Index = () => {
  const [result, setResult] = useState<ResultData | null>(null);

  const handleCalculate = (formData: FormData) => {
    const calculatedResult = calculateScore(formData);
    setResult(calculatedResult);
  };

  const handleBack = () => {
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {result ? (
        <ResultScreen result={result} onBack={handleBack} />
      ) : (
        <CalculatorForm onCalculate={handleCalculate} />
      )}
    </div>
  );
};

export default Index;
