
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Crown, Zap } from "lucide-react";
import { getUsageInfo } from "@/utils/planService";

interface PlanLimitDialogProps {
  open: boolean;
  onClose: () => void;
  limitType: string;
  currentCount: number;
}

export const PlanLimitDialog = ({ open, onClose, limitType, currentCount }: PlanLimitDialogProps) => {
  const { plan, limits, daysRemaining } = getUsageInfo();

  const planUpgradeOptions = [
    {
      name: "Pro",
      price: "R$ 99/mês",
      benefits: [
        "1.000 leads",
        "5 pipelines",
        "10 automações",
        "30 dias de uso",
        "Relatórios avançados"
      ],
      color: "border-blue-500",
      icon: <Zap className="w-5 h-5" />
    },
    {
      name: "Premium",
      price: "R$ 199/mês",
      benefits: [
        "Leads ilimitados",
        "Pipelines ilimitados",
        "Automações ilimitadas",
        "Uso ilimitado",
        "Suporte 24/7"
      ],
      color: "border-purple-500",
      icon: <Crown className="w-5 h-5" />
    }
  ];

  const getLimitMessage = () => {
    if (limitType === 'days') {
      return `Seu período de teste de ${limits.daysLimit} dias expirou. Faça upgrade para continuar usando o sistema.`;
    }
    
    const limitValue = limits[limitType as keyof typeof limits] as number;
    return `Você atingiu o limite de ${limitValue} ${limitType} do plano ${plan.planType.toUpperCase()}. Faça upgrade para aumentar seus limites.`;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-orange-500" />
            Limite do Plano Atingido
          </DialogTitle>
          <DialogDescription>
            {getLimitMessage()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Status Atual */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg">Plano Atual: {plan.planType.toUpperCase()}</CardTitle>
                  <CardDescription>
                    {daysRemaining !== null && `${daysRemaining} dias restantes`}
                  </CardDescription>
                </div>
                <Badge variant="outline">{currentCount} / {limits[limitType as keyof typeof limits] as number}</Badge>
              </div>
            </CardHeader>
          </Card>

          {/* Opções de Upgrade */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Escolha seu novo plano:</h3>
            {planUpgradeOptions.map((option) => (
              <Card key={option.name} className={`${option.color} cursor-pointer hover:shadow-md transition-shadow`}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      {option.icon}
                      <div>
                        <CardTitle className="text-lg">{option.name}</CardTitle>
                        <CardDescription className="font-semibold text-lg">{option.price}</CardDescription>
                      </div>
                    </div>
                    <Button size="sm">
                      Escolher {option.name}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm space-y-1">
                    {option.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Continuar com Plano Atual
            </Button>
            <div className="text-sm text-gray-500">
              Precisa de ajuda? <span className="text-blue-600 cursor-pointer">Fale conosco</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
