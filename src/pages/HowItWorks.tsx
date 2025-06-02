import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  UserPlus, 
  FileCheck, 
  Smartphone, 
  Users, 
  TrendingUp, 
  Shield 
} from 'lucide-react';
import SectionHeading from '../components/ui/SectionHeading';
import Button from '../components/ui/Button';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: <UserPlus size={40} className="text-accent" />,
      title: "Cadastro",
      description: "Preencha o formulário com seus dados e documentos básicos."
    },
    {
      icon: <FileCheck size={40} className="text-accent" />,
      title: "Análise",
      description: "Nossa equipe valida suas informações em até 48 horas."
    },
    {
      icon: <Smartphone size={40} className="text-accent" />,
      title: "Integração",
      description: "Baixe nosso aplicativo e complete seu treinamento online."
    },
    {
      icon: <Users size={40} className="text-accent" />,
      title: "Boas-vindas",
      description: "Participe de um encontro presencial com outros membros."
    },
    {
      icon: <TrendingUp size={40} className="text-accent" />,
      title: "Primeiras entregas",
      description: "Comece a realizar entregas e receba 100% do valor."
    },
    {
      icon: <Shield size={40} className="text-accent" />,
      title: "Benefícios",
      description: "Acesse todos os benefícios e participe das decisões da cooperativa."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Como Funciona | Monopoly Express</title>
        <meta name="description" content="Entenda como funciona a Monopoly Express, do cadastro aos benefícios para os entregadores membros da cooperativa." />
      </Helmet>
      
      <section className="pt-32 pb-20 bg-secondary">
        <div className="container mx-auto px-4 md:px-8">
          <SectionHeading
            title="Como Funciona"
            subtitle="Entenda o passo a passo para fazer parte da Monopoly Express e transformar sua carreira como entregador."
            centered
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-secondary-light p-6 rounded-xl shadow-card"
              >
                <div className="relative mb-6">
                  <div className="absolute -left-2 -top-2 w-16 h-16 bg-primary/10 rounded-full"></div>
                  <div className="relative z-10">{step.icon}</div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {index + 1}. {step.title}
                </h3>
                <p className="text-gray-400">{step.description}</p>
              </motion.div>
            ))}
          </div>
          
          <div className="bg-primary/5 rounded-xl p-8 mb-16">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">O modelo cooperativo</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <p className="text-gray-300 mb-4">
                  A Monopoly Express funciona como uma <strong className="text-accent">cooperativa de trabalho</strong>, onde cada entregador é um membro associado com direito a voto nas decisões.
                </p>
                <p className="text-gray-300 mb-4">
                  Diferente dos aplicativos tradicionais, aqui o entregador não é explorado por algoritmos obscuros ou taxas abusivas. Você recebe o valor integral das entregas, contribuindo apenas com uma taxa fixa mensal que sustenta a estrutura coletiva.
                </p>
                <p className="text-gray-300">
                  Os lucros gerados são reinvestidos na cooperativa ou distribuídos entre os membros, conforme decisão coletiva nas assembleias realizadas mensalmente.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <img 
                  src="https://images.pexels.com/photos/6169659/pexels-photo-6169659.jpeg?auto=compress&cs=tinysrgb&w=1600" 
                  alt="Modelo cooperativo" 
                  className="rounded-lg shadow-lg"
                />
                <div className="absolute -bottom-4 -right-4 bg-accent p-3 rounded-lg shadow-lg">
                  <p className="text-secondary font-bold">100% do valor vai para você</p>
                </div>
              </motion.div>
            </div>
          </div>
          
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Benefícios para membros</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-secondary-light p-6 rounded-xl shadow-card"
              >
                <h4 className="text-xl font-bold text-white mb-4">Benefícios financeiros</h4>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>100% do valor das entregas para o entregador</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>Participação nos lucros da cooperativa</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>Acesso a crédito facilitado para manutenção da moto</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>Fundo de emergência para situações imprevistas</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>Descontos em combustível e manutenção em parceiros</span>
                  </li>
                </ul>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="bg-secondary-light p-6 rounded-xl shadow-card"
              >
                <h4 className="text-xl font-bold text-white mb-4">Proteção e suporte</h4>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>Seguro de vida e acidentes pessoais</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>Assistência jurídica para questões de trânsito</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>Suporte médico 24h via telemedicina</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>Zona de descanso nas bases da cooperativa</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">✓</span>
                    <span>Representação sindical unificada</span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Pronto para transformar sua carreira como entregador e fazer parte da revolução da logística?
            </p>
            <Button to="/seja-membro" variant="primary" size="lg">
              Quero me cadastrar agora
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default HowItWorks;