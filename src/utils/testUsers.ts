
export interface TestUser {
  id: string;
  email: string;
  password: string;
  name: string;
  plan: 'free' | 'pro' | 'premium' | 'admin';
  avatar?: string;
}

export const TEST_USERS: TestUser[] = [
  {
    id: '1',
    email: 'free@test.com',
    password: '123456',
    name: 'Usuário Free',
    plan: 'free'
  },
  {
    id: '2',
    email: 'pro@test.com',
    password: '123456',
    name: 'Usuário Pro',
    plan: 'pro'
  },
  {
    id: '3',
    email: 'premium@test.com',
    password: '123456',
    name: 'Usuário Premium',
    plan: 'premium'
  },
  {
    id: '4',
    email: 'admin@test.com',
    password: '123456',
    name: 'Administrador',
    plan: 'admin'
  }
];

/**
 * Autentica um usuário de teste
 */
export const authenticateTestUser = (email: string, password: string): TestUser | null => {
  const user = TEST_USERS.find(u => u.email === email && u.password === password);
  
  if (user) {
    console.log('Usuário autenticado:', user);
    
    // Salvar dados do usuário logado
    localStorage.setItem('user_logged_in', 'true');
    localStorage.setItem('user_email', user.email);
    localStorage.setItem('user_name', user.name);
    localStorage.setItem('user_id', user.id);
    
    // Ativar o plano correspondente
    activateUserPlan(user.plan);
    
    return user;
  }
  
  return null;
};

/**
 * Ativa o plano do usuário baseado no tipo
 */
export const activateUserPlan = (planType: 'free' | 'pro' | 'premium' | 'admin'): void => {
  // Admin tem acesso premium
  const actualPlan = planType === 'admin' ? 'premium' : planType;
  
  const planData = {
    planType: actualPlan,
    startDate: new Date().toISOString(),
    isActive: true,
    daysUsed: planType === 'free' ? 0 : 0 // Free começa do zero para testar limite
  };
  
  // Para plano Pro, definir expiração
  if (actualPlan === 'pro') {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 30);
    (planData as any).expiresAt = expiry.toISOString();
  }
  
  localStorage.setItem('user_plan', JSON.stringify(planData));
  localStorage.setItem('last_usage_update', new Date().toDateString());
  
  console.log(`Plano ${actualPlan} ativado para usuário ${planType}`);
};

/**
 * Obtém usuário logado atual
 */
export const getCurrentUser = (): TestUser | null => {
  const userId = localStorage.getItem('user_id');
  if (!userId) return null;
  
  return TEST_USERS.find(u => u.id === userId) || null;
};

/**
 * Verifica se o usuário é admin
 */
export const isAdminUser = (): boolean => {
  const user = getCurrentUser();
  return user?.plan === 'admin' || false;
};
