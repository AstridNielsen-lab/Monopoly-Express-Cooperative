import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { CheckCircle, Crown, CreditCard } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';

const SubscriptionSuccess: React.FC = () => {
  const { user, checkSubscription } = useAuth();

  useEffect(() => {
    // Verificar status da assinatura quando a página carregar
    checkSubscription();
  }, [checkSubscription]);

  return (
    <>
      <Helmet>
        <title>Assinatura Confirmada | Monopoly Express</title>
        <meta name="description" content="Sua assinatura premium foi confirmada com sucesso! Aproveite todos os benefícios da Monopoly Express." />
      </Helmet>
      
      <section className="min-h-screen flex items-center justify-center pt-32 pb-20 bg-secondary">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <div className="inline-flex items-center justify-center w-24 h-24 bg-green-500/20 rounded-full mb-6">
                <CheckCircle className="w-12 h-12 text-green-400" />
              </div>
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              🎉 Parabéns!
            </h1>
            
            <h2 className="text-2xl md:text-3xl font-bold text-accent mb-4">
              Sua assinatura foi confirmada!
            </h2>
            
            <p className="text-xl text-gray-300 mb-8">
              Agora você tem acesso a todos os benefícios premium da Monopoly Express.
            </p>
            
            <div className="bg-primary/10 p-6 rounded-xl border border-primary/20 mb-8">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center justify-center">
                <Crown className="w-5 h-5 text-accent mr-2" />
                Seus Benefícios Premium
              </h3>
              
              <ul className="space-y-3 text-gray-300 text-left max-w-md mx-auto">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                  <span>Acesso prioritário a entregas de maior valor</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                  <span>Ferramentas avançadas de análise de ganhos</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                  <span>Suporte técnico prioritário 24/7</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                  <span>Participação nos lucros da cooperativa</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                  <span>Seguro premium contra acidentes</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                  <span>Programa de benefícios exclusivos</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-secondary-light p-6 rounded-xl mb-8">
              <div className="flex items-center justify-center mb-4">
                <CreditCard className="w-6 h-6 text-accent mr-2" />
                <h3 className="text-lg font-bold text-white">Detalhes da Assinatura</h3>
              </div>
              
              <div className="space-y-2 text-gray-300">
                <p><strong className="text-white">Plano:</strong> Premium Monopoly Express</p>
                <p><strong className="text-white">Valor:</strong> R$ 19,90/mês</p>
                <p><strong className="text-white">Status:</strong> <span className="text-green-400">Ativo</span></p>
                {user?.email && (
                  <p><strong className="text-white">Email:</strong> {user.email}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <Button
                to={user?.user_type === 'motoboy' ? '/motoboy' : '/app'}
                variant="primary"
                size="lg"
                className="w-full sm:w-auto"
              >
                Acessar minha conta
              </Button>
              
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 justify-center">
                <Button
                  to="/"
                  variant="outline"
                  size="md"
                >
                  Voltar ao início
                </Button>
                
                <Button
                  href="https://wa.me/5511970603441?text=Olá!%20Acabei%20de%20assinar%20o%20plano%20premium"
                  variant="outline"
                  size="md"
                >
                  Falar no WhatsApp
                </Button>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-accent/10 rounded-lg border border-accent/20">
              <p className="text-sm text-gray-400">
                💡 <strong className="text-accent">Dica:</strong> Seus benefícios premium já estão ativos! 
                Faça login no app para começar a aproveitar todas as vantagens.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default SubscriptionSuccess;

