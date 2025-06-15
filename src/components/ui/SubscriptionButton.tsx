import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Crown, Check } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from './Button';

interface SubscriptionButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showFeatures?: boolean;
  onSubscriptionStart?: () => void;
  onSubscriptionSuccess?: () => void;
}

const SubscriptionButton: React.FC<SubscriptionButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  showFeatures = false,
  onSubscriptionStart,
  onSubscriptionSuccess
}) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<'none' | 'pending' | 'active'>('none');

  const handleSubscription = async () => {
    if (!user?.email) {
      // Redirecionar para login se não estiver logado
      window.location.href = '/login';
      return;
    }

    setIsLoading(true);
    onSubscriptionStart?.();

    try {
      // Primeiro verificar se já tem assinatura ativa
      const checkResponse = await fetch('/api/subscription/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: user.email })
      });

      const checkData = await checkResponse.json();

      if (checkData.subscription?.isActive) {
        setSubscriptionStatus('active');
        onSubscriptionSuccess?.();
        return;
      }

      // Criar nova assinatura
      const createResponse = await fetch('/api/subscription/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
          backUrl: `${window.location.origin}/subscription/success`
        })
      });

      const createData = await createResponse.json();

      if (createResponse.ok) {
        // Redirecionar para o checkout do Mercado Pago
        if (createData.subscription?.init_point) {
          window.location.href = createData.subscription.init_point;
        } else {
          // Se não tiver init_point, mostrar sucesso (modo mock)
          setSubscriptionStatus('pending');
          onSubscriptionSuccess?.();
        }
      } else {
        throw new Error(createData.error || 'Erro ao criar assinatura');
      }

    } catch (error) {
      console.error('Erro ao processar assinatura:', error);
      alert('Erro ao processar assinatura. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonText = () => {
    if (isLoading) return 'Processando...';
    if (subscriptionStatus === 'active') return 'Assinatura Ativa';
    if (subscriptionStatus === 'pending') return 'Assinatura Pendente';
    return 'Assinar por R$ 19,90/mês';
  };

  const getButtonIcon = () => {
    if (subscriptionStatus === 'active') return <Crown className="w-5 h-5" />;
    if (subscriptionStatus === 'pending') return <Check className="w-5 h-5" />;
    return <CreditCard className="w-5 h-5" />;
  };

  return (
    <div className={`subscription-button ${className}`}>
      {showFeatures && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-6 bg-primary/10 rounded-xl border border-primary/20"
        >
          <h3 className="text-lg font-bold text-white mb-4 flex items-center">
            <Crown className="w-5 h-5 text-accent mr-2" />
            Plano Premium - R$ 19,90/mês
          </h3>
          
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start">
              <Check className="w-5 h-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
              <span>Acesso prioritário a entregas de maior valor</span>
            </li>
            <li className="flex items-start">
              <Check className="w-5 h-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
              <span>Ferramentas avançadas de análise de ganhos</span>
            </li>
            <li className="flex items-start">
              <Check className="w-5 h-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
              <span>Suporte técnico prioritário 24/7</span>
            </li>
            <li className="flex items-start">
              <Check className="w-5 h-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
              <span>Participação nos lucros da cooperativa</span>
            </li>
            <li className="flex items-start">
              <Check className="w-5 h-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
              <span>Seguro premium contra acidentes</span>
            </li>
            <li className="flex items-start">
              <Check className="w-5 h-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
              <span>Programa de benefícios exclusivos</span>
            </li>
          </ul>
        </motion.div>
      )}

      <Button
        onClick={handleSubscription}
        variant={subscriptionStatus === 'active' ? 'outline' : variant}
        size={size}
        disabled={isLoading || subscriptionStatus === 'active'}
        className={`w-full ${subscriptionStatus === 'active' ? 'border-green-500 text-green-400' : ''}`}
      >
        <span className="flex items-center justify-center">
          {getButtonIcon()}
          <span className="ml-2">{getButtonText()}</span>
        </span>
      </Button>

      {subscriptionStatus === 'pending' && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 text-sm text-amber-400 text-center"
        >
          Sua assinatura está sendo processada. Você receberá uma confirmação em breve.
        </motion.p>
      )}

      {subscriptionStatus === 'active' && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 text-sm text-green-400 text-center"
        >
          ✓ Você tem acesso a todos os benefícios premium!
        </motion.p>
      )}

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          Pagamento seguro via Mercado Pago • Cancele quando quiser
        </p>
      </div>
    </div>
  );
};

export default SubscriptionButton;

