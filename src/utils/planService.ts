
export interface PlanLimits {
  maxLeads: number;
  maxPipelines: number;
  maxAutomations: number;
  maxIntegrations: number;
  maxUsers: number;
  daysLimit?: number;
  hasAdvancedReports: boolean;
  hasApiAccess: boolean;
  has24x7Support: boolean;
}

export interface UserPlan {
  planType: 'free' | 'pro' | 'premium';
  startDate: string;
  expiresAt?: string;
  isActive: boolean;
  daysUsed: number;
}

export const PLAN_LIMITS: Record<string, PlanLimits> = {
  free: {
    maxLeads: 10,
    maxPipelines: 1,
    maxAutomations: 0,
    maxIntegrations: 0,
    maxUsers: 1,
    daysLimit: 2,
    hasAdvancedReports: false,
    hasApiAccess: false,
    has24x7Support: false
  },
  pro: {
    maxLeads: 1000,
    maxPipelines: 5,
    maxAutomations: 10,
    maxIntegrations: 5,
    maxUsers: 5,
    daysLimit: 30,
    hasAdvancedReports: true,
    hasApiAccess: false,
    has24x7Support: false
  },
  premium: {
    maxLeads: -1, // ilimitado
    maxPipelines: -1, // ilimitado
    maxAutomations: -1, // ilimitado
    maxIntegrations: -1, // ilimitado
    maxUsers: -1, // ilimitado
    hasAdvancedReports: true,
    hasApiAccess: true,
    has24x7Support: true
  }
};

/**
 * Obtém o plano atual do usuário
 */
export const getCurrentPlan = (): UserPlan => {
  try {
    const stored = localStorage.getItem('user_plan');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Erro ao recuperar plano:', error);
  }
  
  // Plano padrão: Free
  return {
    planType: 'free',
    startDate: new Date().toISOString(),
    isActive: true,
    daysUsed: 0
  };
};

/**
 * Salva o plano do usuário
 */
export const savePlan = (plan: UserPlan): void => {
  localStorage.setItem('user_plan', JSON.stringify(plan));
  console.log('Plano salvo:', plan);
};

/**
 * Atualiza os dias de uso
 */
export const updateDaysUsed = (): void => {
  const currentPlan = getCurrentPlan();
  const today = new Date().toDateString();
  const lastUpdate = localStorage.getItem('last_usage_update');
  
  if (lastUpdate !== today) {
    currentPlan.daysUsed += 1;
    localStorage.setItem('last_usage_update', today);
    savePlan(currentPlan);
    
    console.log(`Dias de uso atualizados: ${currentPlan.daysUsed}`);
  }
};

/**
 * Verifica se o plano está ativo
 */
export const isPlanActive = (): boolean => {
  // Se for admin, sempre ativo
  const userEmail = localStorage.getItem('user_email');
  if (userEmail === 'admin@test.com') return true;
  
  const plan = getCurrentPlan();
  const limits = PLAN_LIMITS[plan.planType];
  
  if (!plan.isActive) return false;
  
  // Verificar limite de dias
  if (limits.daysLimit && plan.daysUsed >= limits.daysLimit) {
    return false;
  }
  
  return true;
};

/**
 * Verifica se uma funcionalidade está disponível
 */
export const isFeatureAvailable = (feature: keyof PlanLimits): boolean => {
  // Admin tem acesso a tudo
  const userEmail = localStorage.getItem('user_email');
  if (userEmail === 'admin@test.com') return true;
  
  const plan = getCurrentPlan();
  const limits = PLAN_LIMITS[plan.planType];
  
  if (!isPlanActive()) return false;
  
  return limits[feature] as boolean;
};

/**
 * Verifica se o limite de um recurso foi atingido
 */
export const isLimitReached = (resource: string, currentCount: number): boolean => {
  // Admin nunca atinge limite
  const userEmail = localStorage.getItem('user_email');
  if (userEmail === 'admin@test.com') return false;
  
  const plan = getCurrentPlan();
  const limits = PLAN_LIMITS[plan.planType];
  
  const limit = limits[resource as keyof PlanLimits] as number;
  
  // -1 significa ilimitado
  if (limit === -1) return false;
  
  return currentCount >= limit;
};

/**
 * Obtém informações de uso e limites
 */
export const getUsageInfo = () => {
  const plan = getCurrentPlan();
  const limits = PLAN_LIMITS[plan.planType];
  
  return {
    plan,
    limits,
    isActive: isPlanActive(),
    daysRemaining: limits.daysLimit ? Math.max(0, limits.daysLimit - plan.daysUsed) : null
  };
};

/**
 * Ativa um novo plano
 */
export const activatePlan = (planType: 'free' | 'pro' | 'premium'): void => {
  const newPlan: UserPlan = {
    planType,
    startDate: new Date().toISOString(),
    isActive: true,
    daysUsed: 0
  };
  
  // Definir data de expiração para planos pagos
  if (planType === 'pro') {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 30);
    newPlan.expiresAt = expiry.toISOString();
  }
  
  savePlan(newPlan);
  localStorage.setItem('last_usage_update', new Date().toDateString());
  
  console.log(`Plano ${planType} ativado:`, newPlan);
};

/**
 * Aplica limites do plano
 */
export const checkPlanLimits = (resource: string, currentCount: number): { allowed: boolean; message?: string } => {
  if (!isPlanActive()) {
    return {
      allowed: false,
      message: 'Seu plano expirou. Faça upgrade para continuar usando.'
    };
  }

  if (isLimitReached(resource, currentCount)) {
    const plan = getCurrentPlan();
    const limits = PLAN_LIMITS[plan.planType];
    const limit = limits[resource as keyof PlanLimits] as number;
    
    return {
      allowed: false,
      message: `Limite de ${limit} ${resource} atingido. Faça upgrade para aumentar seus limites.`
    };
  }

  return { allowed: true };
};
