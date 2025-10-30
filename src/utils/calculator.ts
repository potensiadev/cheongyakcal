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

const calculateSubscriptionScore = (years: number): number => {
  if (years < 1) return 0;
  if (years < 2) return 3;
  if (years < 3) return 4;
  if (years < 4) return 5;
  if (years < 5) return 6;
  if (years < 6) return 7;
  if (years < 7) return 8;
  if (years < 8) return 9;
  if (years < 9) return 10;
  if (years < 10) return 11;
  if (years < 11) return 12;
  if (years < 12) return 13;
  if (years < 13) return 14;
  if (years < 14) return 15;
  if (years < 15) return 16;
  return 17; // 15년 이상
};

const calculateYearsBetween = (startDate: string, endDate?: string): number => {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);
  
  return diffYears;
};

export const calculateScore = (formData: FormData): ResultData => {
  // 무주택기간 점수 (1년당 2점, 최대 32점)
  const homelessYears = parseInt(formData.homelessYears);
  const homelessScore = Math.min(homelessYears * 2, 32);

  // 부양가족 점수 (0명 5점, 이후 1명당 +5점, 최대 35점)
  const dependents = parseInt(formData.dependents);
  const dependentsScore = Math.min(5 + (dependents * 5), 35);

  // 청약통장 가입기간 점수
  const subscriptionYears = calculateYearsBetween(formData.subscriptionDate);
  const subscriptionScore = calculateSubscriptionScore(subscriptionYears);

  // 총점 계산
  const totalScore = homelessScore + dependentsScore + subscriptionScore;

  // 등급 계산 (84점 만점 기준)
  let level: "low" | "medium" | "high";
  if (totalScore >= 60) {
    level = "high"; // 71% 이상
  } else if (totalScore >= 40) {
    level = "medium"; // 48% 이상
  } else {
    level = "low"; // 48% 미만
  }

  return {
    totalScore,
    homelessScore,
    dependentsScore,
    subscriptionScore,
    level,
  };
};
