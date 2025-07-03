
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Copy, ExternalLink } from "lucide-react";
import { VideoCallSession } from "@/hooks/useVideoCall";
import { useToast } from "@/hooks/use-toast";

interface VideoCallInviteProps {
  call: VideoCallSession;
  contactName: string;
  onJoin: () => void;
  onEnd: () => void;
}

export const VideoCallInvite = ({ call, contactName, onJoin, onEnd }: VideoCallInviteProps) => {
  const { toast } = useToast();

  const copyInviteLink = () => {
    navigator.clipboard.writeText(call.inviteLink);
    toast({
      title: "Link copiado!",
      description: "O link da videochamada foi copiado para a área de transferência.",
    });
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(call.roomId);
    toast({
      title: "Código copiado!",
      description: "O código da reunião foi copiado para a área de transferência.",
    });
  };

  const getStatusColor = () => {
    switch (call.status) {
      case 'waiting': return 'text-yellow-600 bg-yellow-50';
      case 'active': return 'text-green-600 bg-green-50';
      case 'ended': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = () => {
    switch (call.status) {
      case 'waiting': return 'Aguardando participantes';
      case 'active': return 'Chamada ativa';
      case 'ended': return 'Chamada encerrada';
      default: return 'Status desconhecido';
    }
  };

  return (
    <Card className="mb-4 border-blue-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Video className="w-5 h-5 text-blue-600" />
            <h4 className="font-semibold text-blue-900">Videochamada com {contactName}</h4>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>
        
        {/* Código da Reunião em Destaque */}
        <div className="bg-blue-50 p-4 rounded-lg mb-3 border border-blue-200">
          <p className="text-sm font-medium text-blue-800 mb-2">Código da Reunião:</p>
          <div className="flex items-center space-x-2">
            <code className="bg-white px-3 py-2 rounded text-lg font-mono font-bold text-blue-900 flex-1 border text-center tracking-wider">
              {call.roomId}
            </code>
            <Button size="sm" variant="outline" onClick={copyRoomCode}>
              <Copy className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-blue-600 mt-2 text-center">
            Use este código no Google Meet para entrar na reunião
          </p>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg mb-3">
          <p className="text-sm text-gray-600 mb-2">Link direto da videochamada:</p>
          <div className="flex items-center space-x-2">
            <code className="bg-white px-2 py-1 rounded text-xs flex-1 border">
              {call.inviteLink}
            </code>
            <Button size="sm" variant="outline" onClick={copyInviteLink}>
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex space-x-2">
          {call.status === 'waiting' || call.status === 'active' ? (
            <>
              <Button size="sm" onClick={onJoin} className="flex-1">
                <ExternalLink className="w-4 h-4 mr-2" />
                Entrar na chamada
              </Button>
              <Button size="sm" variant="outline" onClick={onEnd}>
                Encerrar
              </Button>
            </>
          ) : (
            <Button size="sm" variant="outline" disabled className="flex-1">
              Chamada encerrada
            </Button>
          )}
        </div>

        <p className="text-xs text-gray-500 mt-2">
          Criada em: {new Date(call.startedAt).toLocaleString('pt-BR')}
        </p>
      </CardContent>
    </Card>
  );
};
