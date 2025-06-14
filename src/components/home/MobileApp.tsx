import React from 'react';
import { motion } from 'framer-motion';
import { Download, Smartphone, Star, Users, TrendingUp } from 'lucide-react';
import { Button } from '../ui/Button';
import Card from '../ui/Card';
import SectionHeading from '../ui/SectionHeading';

const MobileApp: React.FC = () => {
  const features = [
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Rede de Motoboys',
      description: 'Conecte-se com centenas de motoboys da Monopoly Express'
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: 'Sistema de Avaliação',
      description: 'Avalie e seja avaliado para manter a qualidade dos serviços'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Acompanhe seus Ganhos',
      description: 'Monitore seus ganhos diários, semanais e mensais em tempo real'
    }
  ];

  return (
    <section id="app" className="py-20 bg-gradient-to-br from-secondary-dark to-secondary">
      <div className="container mx-auto px-4 md:px-8">
        <SectionHeading
          title="Aplicativo Monopoly Express"
          subtitle="Baixe nosso app e tenha controle total das suas entregas na palma da mão"
          centered
          className="mb-12"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Lado esquerdo - Informações do App */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <Smartphone className="w-8 h-8 text-accent" />
                <h3 className="text-2xl font-bold text-white">App do Motoboy</h3>
              </div>

              <p className="text-gray-300 text-lg mb-8">
                Desenvolvido especialmente para os motoboys da Monopoly Express, 
                nosso aplicativo oferece todas as ferramentas que você precisa para 
                gerenciar suas entregas de forma eficiente e profissional.
              </p>

              <div className="space-y-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start space-x-4"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center text-accent">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-1">{feature.title}</h4>
                      <p className="text-gray-400">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Botão de Download */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="pt-8"
              >
                <a
                  href="https://github.com/AstridNielsen-lab/Monopoly-Express-Cooperative/blob/main/CooperativaMotoboy/CooperativaMotoboy-v3.0-legacy.apk"
                  download="CooperativaMotoboy-v4.0.apk"
                  className="inline-flex items-center px-8 py-4 bg-accent hover:bg-accent-dark text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <Download className="w-5 h-5 mr-3" />
                  Baixar APK v4.0 (5.87MB)
                </a>
                <p className="text-sm text-gray-400 mt-3">
                  Versão 4.0 • Compatível com Android 7.0+ • <a href="https://github.com/AstridNielsen-lab/Monopoly-Express-Cooperative/blob/main/CooperativaMotoboy/CooperativaMotoboy-v3.0-legacy.apk" className="text-accent hover:text-accent-light underline">Todas as versões</a>
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Lado direito - Screenshots do App */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative mx-auto max-w-sm">
              {/* Moldura do celular */}
              <div className="relative bg-gray-900 rounded-[2.5rem] p-4 shadow-2xl">
                <div className="bg-black rounded-[2rem] overflow-hidden">
                  {/* Tela do app */}
                  <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 text-white">
                    {/* Header do app */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">Monopoly Express</h3>
                          <p className="text-sm opacity-80">Área do Motoboy</p>
                        </div>
                      </div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>

                    {/* Stats cards */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="bg-white/20 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold">4.8</div>
                        <div className="text-xs opacity-80">Avaliação</div>
                      </div>
                      <div className="bg-white/20 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold">R$ 89</div>
                        <div className="text-xs opacity-80">Hoje</div>
                      </div>
                    </div>

                    {/* Lista de entregas */}
                    <div className="space-y-3">
                      <div className="bg-white/10 rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <div className="text-sm font-medium">Rua das Flores → Av. Brasil</div>
                          <div className="text-lg font-bold">R$ 25</div>
                        </div>
                        <div className="text-xs opacity-80 mb-2">Documentos • 5.2 km</div>
                        <button className="w-full bg-accent text-white py-2 rounded-lg text-sm font-medium">
                          Aceitar Corrida
                        </button>
                      </div>
                      <div className="bg-white/10 rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <div className="text-sm font-medium">Shopping → Centro</div>
                          <div className="text-lg font-bold">R$ 18</div>
                        </div>
                        <div className="text-xs opacity-80 mb-2">Medicamentos • 3.1 km</div>
                        <button className="w-full bg-white/20 text-white py-2 rounded-lg text-sm font-medium">
                          Aceitar Corrida
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Elementos decorativos */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent/20 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/20 rounded-full animate-pulse delay-700"></div>
            </div>
          </motion.div>
        </div>

        {/* Instruções de instalação */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <Card className="bg-gray-800/50 border-gray-700 p-8">
            <h3 className="text-xl font-bold text-white mb-6 text-center">Como instalar no seu celular</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center text-accent mx-auto mb-3">
                  <span className="font-bold text-lg">1</span>
                </div>
                <h4 className="font-semibold text-white mb-2">Baixe o APK</h4>
                <p className="text-gray-400 text-sm">Clique no botão "Baixar APK" acima</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center text-accent mx-auto mb-3">
                  <span className="font-bold text-lg">2</span>
                </div>
                <h4 className="font-semibold text-white mb-2">Permita instalação</h4>
                <p className="text-gray-400 text-sm">Habilite "Fontes desconhecidas" no Android</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center text-accent mx-auto mb-3">
                  <span className="font-bold text-lg">3</span>
                </div>
                <h4 className="font-semibold text-white mb-2">Instale e use</h4>
                <p className="text-gray-400 text-sm">Abra o arquivo e instale o aplicativo</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default MobileApp;

