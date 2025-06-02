import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, Briefcase, Activity, HeartHandshake, Award } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';

const Features: React.FC = () => {
  const features = [
    {
      icon: <Shield size={40} className="text-accent" />,
      title: 'Proteção coletiva',
      description: 'Seguro completo contra acidentes e suporte jurídico para todas as situações do dia a dia.'
    },
    {
      icon: <Users size={40} className="text-accent" />,
      title: 'Força sindical',
      description: 'Representatividade unificada para negociações com empresas, plataformas e governo.'
    },
    {
      icon: <Briefcase size={40} className="text-accent" />,
      title: 'Autonomia real',
      description: 'Escolha suas rotas, horários e clientes, sem algoritmos controlando sua jornada.'
    },
    {
      icon: <Activity size={40} className="text-accent" />,
      title: 'Melhores taxas',
      description: 'Tarifas justas, sem descontos abusivos e com participação nos lucros da cooperativa.'
    },
    {
      icon: <HeartHandshake size={40} className="text-accent" />,
      title: 'Comunidade solidária',
      description: 'Rede de apoio com outros entregadores e benefícios exclusivos para membros.'
    },
    {
      icon: <Award size={40} className="text-accent" />,
      title: 'Capacitação contínua',
      description: 'Cursos e treinamentos para aprimorar suas habilidades e aumentar seus ganhos.'
    }
  ];

  return (
    <section className="py-20 bg-secondary">
      <div className="container mx-auto px-4 md:px-8">
        <SectionHeading
          title="Por que se juntar a nós?"
          subtitle="Na Monopoly Express, construímos um movimento que devolve o poder aos verdadeiros heróis da logística urbana."
          centered
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="p-6 rounded-xl border border-gray-800 hover:border-primary/30 transition-colors duration-300"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;