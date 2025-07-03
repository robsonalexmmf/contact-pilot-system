
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, Calendar, User, Plus, MoreHorizontal } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { NewDealDialog } from "./NewDealDialog";

const pipelineStages = [
  { id: "qualification", name: "Qualificação", color: "bg-blue-500" },
  { id: "proposal", name: "Proposta", color: "bg-yellow-500" },
  { id: "negotiation", name: "Negociação", color: "bg-orange-500" },
  { id: "closing", name: "Fechamento", color: "bg-green-500" }
];

const mockDeals = [
  {
    id: 1,
    title: "Sistema ERP - Empresa XYZ",
    value: 45000,
    probability: 80,
    stage: "negotiation",
    contact: "Maria Santos",
    company: "Empresa XYZ",
    expectedClose: "2024-02-15",
    lastActivity: "Apresentação realizada"
  },
  {
    id: 2,
    title: "Consultoria TI - StartupTech",
    value: 15000,
    probability: 60,
    stage: "proposal",
    contact: "João Silva",
    company: "StartupTech",
    expectedClose: "2024-02-20",
    lastActivity: "Proposta enviada"
  },
  {
    id: 3,
    title: "Software Personalizado - ABC Corp",
    value: 75000,
    probability: 90,
    stage: "closing",
    contact: "Ana Costa",
    company: "ABC Corp",
    expectedClose: "2024-02-10",
    lastActivity: "Contrato em análise"
  },
  {
    id: 4,
    title: "Plataforma E-commerce - Varejo Plus",
    value: 32000,
    probability: 40,
    stage: "qualification",
    contact: "Pedro Oliveira",
    company: "Varejo Plus",
    expectedClose: "2024-03-01",
    lastActivity: "Reunião de descoberta"
  }
];

export const SalesPipeline = () => {
  const [deals, setDeals] = useState(mockDeals);
  const { t } = useLanguage();
  const [, forceUpdate] = useState({});

  // Listen for language changes to force re-render
  useEffect(() => {
    const handleLanguageChange = () => {
      forceUpdate({});
    };

    window.addEventListener('languageChanged', handleLanguageChange);
    return () => window.removeEventListener('languageChanged', handleLanguageChange);
  }, []);

  const handleCreateDeal = (newDeal: any) => {
    setDeals(prev => [...prev, newDeal]);
    console.log("Negócio adicionado ao pipeline:", newDeal);
  };

  const getDealsByStage = (stageId: string) => {
    return deals.filter(deal => deal.stage === stageId);
  };

  const getStageTotal = (stageId: string) => {
    return getDealsByStage(stageId).reduce((sum, deal) => sum + deal.value, 0);
  };

  const getStageName = (stageId: string) => {
    switch(stageId) {
      case 'qualification': return t('qualification');
      case 'proposal': return t('proposal');
      case 'negotiation': return t('negotiation');
      case 'closing': return t('closing');
      default: return stageId;
    }
  };

  return (
    <div className="space-y-6">
      {/* Pipeline Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {pipelineStages.map((stage) => {
          const stageDeals = getDealsByStage(stage.id);
          const stageTotal = getStageTotal(stage.id);
          
          return (
            <Card key={stage.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-3 h-3 rounded-full ${stage.color}`}></div>
                  <span className="text-sm font-medium text-gray-500">
                    {stageDeals.length} {t('deals')}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{getStageName(stage.id)}</h3>
                <p className="text-2xl font-bold text-gray-900">
                  R$ {stageTotal.toLocaleString()}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Pipeline Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {pipelineStages.map((stage) => {
          const stageDeals = getDealsByStage(stage.id);
          
          return (
            <div key={stage.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${stage.color}`}></div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {getStageName(stage.id)}
                  </h3>
                  <Badge variant="secondary">{stageDeals.length}</Badge>
                </div>
                <NewDealDialog 
                  stage={stage.id}
                  onCreateDeal={handleCreateDeal}
                />
              </div>

              <div className="space-y-3">
                {stageDeals.map((deal) => (
                  <Card key={deal.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-2">
                          {deal.title}
                        </h4>
                        <Button size="sm" variant="ghost">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <DollarSign className="w-4 h-4 mr-1" />
                            R$ {deal.value.toLocaleString()}
                          </div>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              deal.probability >= 80 ? 'border-green-500 text-green-700' :
                              deal.probability >= 60 ? 'border-yellow-500 text-yellow-700' :
                              'border-red-500 text-red-700'
                            }`}
                          >
                            {deal.probability}%
                          </Badge>
                        </div>

                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <User className="w-4 h-4 mr-1" />
                          {deal.contact}
                        </div>

                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(deal.expectedClose).toLocaleDateString('pt-BR')}
                        </div>

                        <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {deal.lastActivity}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {stageDeals.length === 0 && (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-2">
                      <DollarSign className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t('noDealsinStage')}
                    </p>
                    <div className="mt-2">
                      <NewDealDialog 
                        stage={stage.id}
                        onCreateDeal={handleCreateDeal}
                        trigger={
                          <Button size="sm" variant="ghost">
                            <Plus className="w-4 h-4 mr-1" />
                            {t('add')}
                          </Button>
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pipeline Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('totalPipelineValue')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              R$ {deals.reduce((sum, deal) => sum + deal.value, 0).toLocaleString()}
            </div>
            <p className="text-sm text-gray-500">
              {deals.length} {t('activeDeals')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('averageProbability')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {Math.round(deals.reduce((sum, deal) => sum + deal.probability, 0) / deals.length)}%
            </div>
            <p className="text-sm text-gray-500">
              {t('basedOnDeals')} {deals.length} {t('deals')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('projectedRevenue')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 mb-2">
              R$ {Math.round(deals.reduce((sum, deal) => sum + (deal.value * deal.probability / 100), 0)).toLocaleString()}
            </div>
            <p className="text-sm text-gray-500">
              {t('basedOnProbability')}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
