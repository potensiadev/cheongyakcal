import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Calendar } from "lucide-react";

interface FormData {
  birthDate: string;
  homelessYears: string;
  dependents: string;
  subscriptionDate: string;
}

interface CalculatorFormProps {
  onCalculate: (data: FormData) => void;
}

export const CalculatorForm = ({ onCalculate }: CalculatorFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    birthDate: "",
    homelessYears: "",
    dependents: "",
    subscriptionDate: "",
  });

  const [error, setError] = useState("");

  const handleChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    setError("");
  };

  const validateAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const birth = new Date(formData.birthDate);
    const subscription = new Date(formData.subscriptionDate);

    if (birth >= subscription) {
      setError("가입자 생일 이전에 청약통장 가입은 어려워요. 다시 확인해주세요.");
      return;
    }

    if (!formData.birthDate || !formData.homelessYears || !formData.dependents || !formData.subscriptionDate) {
      setError("모든 항목을 입력해주세요.");
      return;
    }

    onCalculate(formData);
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
          청약가점 계산기
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          간편하게 내 청약가점을 확인해보세요
        </p>
      </div>

      <Card className="p-6 md:p-8 shadow-lg border-0">
        <form onSubmit={validateAndSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="birthDate" className="text-base font-semibold">
              가입자 생년월일
            </Label>
            <div className="relative">
              <Input
                id="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={handleChange("birthDate")}
                className="h-14 text-base pr-12"
                required
              />
              <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="homelessYears" className="text-base font-semibold">
              무주택기간 (년)
            </Label>
            <Input
              id="homelessYears"
              type="number"
              min="0"
              max="16"
              placeholder="예: 5"
              value={formData.homelessYears}
              onChange={handleChange("homelessYears")}
              className="h-14 text-base"
              required
            />
            <p className="text-xs text-muted-foreground">
              1년당 2점, 최대 32점
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dependents" className="text-base font-semibold">
              부양가족 수 (명)
            </Label>
            <Input
              id="dependents"
              type="number"
              min="0"
              max="6"
              placeholder="예: 3"
              value={formData.dependents}
              onChange={handleChange("dependents")}
              className="h-14 text-base"
              required
            />
            <p className="text-xs text-muted-foreground">
              0명 5점, 이후 1명당 +5점 (최대 35점)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subscriptionDate" className="text-base font-semibold">
              청약통장 가입일
            </Label>
            <div className="relative">
              <Input
                id="subscriptionDate"
                type="date"
                value={formData.subscriptionDate}
                onChange={handleChange("subscriptionDate")}
                className="h-14 text-base pr-12"
                required
              />
              <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 pointer-events-none" />
            </div>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
              <p className="text-destructive text-sm font-medium">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 transition-all duration-200"
          >
            내 청약가점 계산하기
          </Button>
        </form>
      </Card>

      <div className="mt-6 text-center text-xs text-muted-foreground">
        <p>청약가점은 무주택기간, 부양가족, 청약통장 가입기간으로 산정됩니다.</p>
      </div>
    </div>
  );
};
