import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, TrendingUp, Users, Calendar, Home, Share2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ResultData {
  totalScore: number;
  homelessScore: number;
  dependentsScore: number;
  subscriptionScore: number;
  level: "low" | "medium" | "high";
}

interface ResultScreenProps {
  result: ResultData;
  onBack: () => void;
}

const CountUpAnimation = ({ end, duration = 800 }: { end: number; duration?: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = (currentTime - startTime) / duration;

      if (progress < 1) {
        setCount(Math.floor(end * progress));
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <span>{count}</span>;
};

export const ResultScreen = ({ result, onBack }: ResultScreenProps) => {
  useEffect(() => {
    // Kakao SDK 초기화
    const kakao = (window as any).Kakao;
    if (kakao && !kakao.isInitialized()) {
      // TODO: 실제 Kakao JavaScript 키로 교체 필요
      kakao.init('e3aa891d6d5d33a62d47dfca38e29ebd');
    }
  }, []);

  const handleKakaoShare = () => {
    const kakao = (window as any).Kakao;
    if (!kakao) {
      toast({
        title: "공유 실패",
        description: "카카오톡 공유 기능을 불러올 수 없습니다.",
        variant: "destructive",
      });
      return;
    }

    if (!kakao.isInitialized()) {
      toast({
        title: "공유 실패",
        description: "카카오톡 SDK가 초기화되지 않았습니다.",
        variant: "destructive",
      });
      return;
    }

    kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: '내 청약가점 결과',
        description: `총 ${result.totalScore}점 / 84점 (${getLevelText()} 등급)`,
        imageUrl: 'https://lovable.dev/opengraph-image-p98pqg.png',
        link: {
          mobileWebUrl: window.location.href,
          webUrl: window.location.href,
        },
      },
      buttons: [
        {
          title: '내 점수도 계산하기',
          link: {
            mobileWebUrl: window.location.origin,
            webUrl: window.location.origin,
          },
        },
      ],
    });
  };

  const getLevelColor = () => {
    switch (result.level) {
      case "high":
        return "text-score-high";
      case "medium":
        return "text-score-medium";
      case "low":
        return "text-score-low";
    }
  };

  const getLevelBgColor = () => {
    switch (result.level) {
      case "high":
        return "bg-score-high/10 border-score-high/30";
      case "medium":
        return "bg-score-medium/10 border-score-medium/30";
      case "low":
        return "bg-score-low/10 border-score-low/30";
    }
  };

  const getLevelText = () => {
    switch (result.level) {
      case "high":
        return "높음";
      case "medium":
        return "보통";
      case "low":
        return "낮음";
    }
  };

  const getLevelEmoji = () => {
    switch (result.level) {
      case "high":
        return "🎉";
      case "medium":
        return "👍";
      case "low":
        return "💪";
    }
  };

  const getLevelMessage = () => {
    switch (result.level) {
      case "high":
        return "청약 당첨 가능성이 높은 점수예요!";
      case "medium":
        return "꾸준히 관리하면 좋은 점수예요!";
      case "low":
        return "시간이 지날수록 점수가 올라가요!";
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          onClick={onBack}
          className="-ml-2 hover:bg-secondary"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          다시 계산하기
        </Button>
        
        <Button
          variant="outline"
          onClick={handleKakaoShare}
          className="hover:bg-secondary"
        >
          <Share2 className="mr-2 h-4 w-4" />
          카카오톡 공유
        </Button>
      </div>

      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
          <TrendingUp className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          내 청약가점 결과
        </h2>
        <p className="text-muted-foreground">
          84점 만점 기준으로 계산되었습니다
        </p>
      </div>

      <Card className="p-8 mb-6 shadow-lg border-0 bg-gradient-to-br from-primary/5 to-transparent">
        <div className="text-center">
          <p className="text-muted-foreground mb-2">총 청약가점</p>
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-6xl font-bold text-primary animate-count-up">
              <CountUpAnimation end={result.totalScore} />
            </span>
            <span className="text-3xl text-muted-foreground">/ 84점</span>
          </div>
        </div>
      </Card>

      <Card className={`p-6 mb-6 border ${getLevelBgColor()}`}>
        <div className="text-center">
          <div className="text-4xl mb-2">{getLevelEmoji()}</div>
          <p className={`text-xl font-bold ${getLevelColor()} mb-1`}>
            점수 등급: {getLevelText()}
          </p>
          <p className="text-sm text-muted-foreground">
            {getLevelMessage()}
          </p>
        </div>
      </Card>

      <div className="space-y-4 mb-8">
        <h3 className="font-semibold text-lg">세부 점수</h3>
        
        <Card className="p-4 border-0 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Home className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">무주택기간</p>
                <p className="text-xs text-muted-foreground">최대 32점</p>
              </div>
            </div>
            <span className="text-2xl font-bold text-primary">
              {result.homelessScore}점
            </span>
          </div>
        </Card>

        <Card className="p-4 border-0 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">부양가족</p>
                <p className="text-xs text-muted-foreground">최대 35점</p>
              </div>
            </div>
            <span className="text-2xl font-bold text-primary">
              {result.dependentsScore}점
            </span>
          </div>
        </Card>

        <Card className="p-4 border-0 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">청약통장 가입기간</p>
                <p className="text-xs text-muted-foreground">최대 17점</p>
              </div>
            </div>
            <span className="text-2xl font-bold text-primary">
              {result.subscriptionScore}점
            </span>
          </div>
        </Card>
      </div>

      <div className="bg-muted rounded-lg p-4 text-center">
        <p className="text-xs text-muted-foreground">
          이 계산기는 참고용이며, 실제 청약 시 정확한 점수는 <br />
          한국부동산원 청약홈에서 확인하세요.
        </p>
      </div>
    </div>
  );
};
