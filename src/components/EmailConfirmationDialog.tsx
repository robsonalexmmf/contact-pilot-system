
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Mail, CheckCircle } from "lucide-react";

interface EmailConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userEmail?: string;
}

export function EmailConfirmationDialog({ open, onOpenChange, userEmail }: EmailConfirmationDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full">
            <Mail className="w-6 h-6 text-blue-600" />
          </div>
          <AlertDialogTitle className="text-center">
            Confirme seu Email para Acessar o CRM
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center space-y-3">
            <div className="flex items-center justify-center space-x-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Pagamento Aprovado!</span>
            </div>
            
            <p>
              Enviamos um email de confirmação para:
              <br />
              <strong className="text-blue-600">{userEmail}</strong>
            </p>
            
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-orange-800">
              <p className="text-sm">
                <strong>⚠️ Importante:</strong> Você precisa confirmar seu email para fazer login e acessar todas as funcionalidades do CRM.
              </p>
            </div>
            
            <p className="text-sm text-gray-600">
              Verifique sua caixa de entrada (e spam) e clique no link de confirmação.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col space-y-2">
          <AlertDialogAction 
            onClick={() => onOpenChange(false)}
            className="w-full"
          >
            Entendi, vou confirmar meu email
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
