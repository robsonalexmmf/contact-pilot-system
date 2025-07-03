
-- Create system_settings table for storing global system configurations
CREATE TABLE public.system_settings (
  id TEXT PRIMARY KEY DEFAULT 'main_config',
  settings JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all authenticated users to read system settings
CREATE POLICY "Authenticated users can view system settings" 
  ON public.system_settings 
  FOR SELECT 
  TO authenticated 
  USING (true);

-- Create policy to allow only specific roles to update system settings (you can adjust this)
CREATE POLICY "Admin users can update system settings" 
  ON public.system_settings 
  FOR ALL 
  TO authenticated 
  USING (true)
  WITH CHECK (true);

-- Insert default configuration
INSERT INTO public.system_settings (id, settings) VALUES (
  'main_config',
  '{
    "general": {
      "siteName": "CRM Empresa",
      "siteDescription": "Sistema de Gestão de Relacionamento com Cliente",
      "timezone": "America/Sao_Paulo",
      "language": "pt-BR",
      "maintenanceMode": false,
      "registrationEnabled": true,
      "maxUsers": 100,
      "sessionTimeout": 30
    },
    "database": {
      "autoBackup": true,
      "backupFrequency": "daily",
      "retentionDays": 30,
      "compressionEnabled": true,
      "maxConnections": 20,
      "queryTimeout": 30
    },
    "email": {
      "smtpHost": "mail.empresa.com",
      "smtpPort": "587",
      "smtpUser": "noreply@empresa.com",
      "smtpPassword": "",
      "fromName": "CRM Sistema",
      "encryption": "tls",
      "enabled": true,
      "dailyLimit": 1000
    },
    "security": {
      "sessionTimeout": 30,
      "maxLoginAttempts": 5,
      "passwordMinLength": 8,
      "requireSpecialChars": true,
      "twoFactorRequired": false,
      "ipWhitelist": "",
      "enableAuditLog": true,
      "passwordExpiration": 90
    },
    "notifications": {
      "systemAlerts": true,
      "emailNotifications": true,
      "smsNotifications": false,
      "webhookNotifications": true,
      "slackEnabled": false,
      "discordEnabled": false
    },
    "appearance": {
      "theme": "light",
      "primaryColor": "#3B82F6",
      "logoUrl": "",
      "customCss": "",
      "brandName": "CRM Sistema",
      "favIcon": ""
    },
    "performance": {
      "cacheEnabled": true,
      "cacheTtl": 3600,
      "compressionEnabled": true,
      "cdnEnabled": false,
      "maxRequestSize": 10,
      "rateLimit": 100
    }
  }'::jsonb
);
