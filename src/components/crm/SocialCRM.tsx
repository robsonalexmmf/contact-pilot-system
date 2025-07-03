
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Facebook, 
  Instagram, 
  MessageCircle,
  Search,
  Filter,
  Plus,
  TrendingUp,
  Users,
  Eye,
  Heart,
  Share
} from "lucide-react";

const mockSocialLeads = [
  {
    id: 1,
    platform: "Facebook",
    type: "Ad Comment",
    user: "@maria_silva",
    message: "Interessada no produto, podem me chamar?",
    engagement: 85,
    created: "2024-01-15 14:30",
    status: "Novo"
  },
  {
    id: 2,
    platform: "Instagram",
    type: "DM",
    user: "@joao_santos",
    message: "Gostaria de saber mais sobre os preços",
    engagement: 92,
    created: "2024-01-15 13:45",
    status: "Respondido"
  }
];

const mockSocialListening = [
  {
    id: 1,
    keyword: "CRM empresa",
    mentions: 156,
    sentiment: "Positivo",
    growth: "+12%"
  },
  {
    id: 2,
    keyword: "@nossa_empresa",
    mentions: 89,
    sentiment: "Neutro",
    growth: "+5%"
  }
];

export const SocialCRM = () => {
  const [socialLeads] = useState(mockSocialLeads);
  const [socialListening] = useState(mockSocialListening);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Leads Sociais</p>
                <p className="text-2xl font-bold text-blue-600">{socialLeads.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Menções</p>
                <p className="text-2xl font-bold text-green-600">245</p>
              </div>
              <MessageCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Engajamento</p>
                <p className="text-2xl font-bold text-purple-600">88%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversões</p>
                <p className="text-2xl font-bold text-orange-600">24</p>
              </div>
              <Heart className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Social Leads */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Leads das Redes Sociais</CardTitle>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filtrar
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600">
                <Plus className="w-4 h-4 mr-2" />
                Conectar Rede Social
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {socialLeads.map((lead) => (
              <div key={lead.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    {lead.platform === "Facebook" ? (
                      <Facebook className="w-6 h-6 text-blue-600" />
                    ) : (
                      <Instagram className="w-6 h-6 text-pink-600" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold">{lead.user}</h3>
                      <Badge variant="outline" className="text-xs">
                        {lead.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{lead.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{lead.created}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <p className="text-sm font-medium">Score: {lead.engagement}</p>
                    <Badge className={lead.status === "Novo" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}>
                      {lead.status}
                    </Badge>
                  </div>
                  <Button size="sm" variant="outline">
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Social Listening */}
      <Card>
        <CardHeader>
          <CardTitle>Monitoramento Social (Social Listening)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {socialListening.map((item) => (
              <div key={item.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{item.keyword}</h3>
                  <Badge className={item.sentiment === "Positivo" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                    {item.sentiment}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-1 text-gray-500" />
                      <span className="text-sm">{item.mentions} menções</span>
                    </div>
                    <div className="flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
                      <span className="text-sm text-green-600">{item.growth}</span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
