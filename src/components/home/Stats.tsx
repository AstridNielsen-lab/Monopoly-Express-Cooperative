import React from 'react';
import { motion } from 'framer-motion';
import { Users, TrendingUp, ShieldCheck, DollarSign } from 'lucide-react';
import Card from '../ui/Card';

const Stats: React.FC = () => {
  const stats = [
    {
      icon: <Users size={32} className="text-primary" />,
      number: '1500+',
      title: 'Motoboys unidos',
      description: 'Entregadores que já fazem parte do nosso movimento'
    },
    {
      icon: <TrendingUp size={32} className="text-primary" />,
      number: '35%',
      title: 'Aumento de renda',
      description: 'Média de crescimento na receita dos nossos membros'
    },
    {
      icon: <ShieldCheck size={32} className="text-primary" />,
      number: '100%',
      title: 'Proteção legal',
      description: 'Suporte jurídico completo para todos os membros'
    },
    {
      icon: <DollarSign size={32} className="text-primary" />,
      number: 'R$ 2.5M',
      title: 'Fundo cooperativo',
      description: 'Investimento coletivo para benefício de todos'
    }
  ];

  return (
    <section id="stats" className="py-20 bg-gradient-to-b from-secondary to-secondary-light">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <Card className="h-full">
                <div className="mb-4">{stat.icon}</div>
                <h3 className="text-3xl md:text-4xl font-heading font-bold text-accent mb-2">
                  {stat.number}
                </h3>
                <h4 className="text-xl font-medium text-white mb-2">{stat.title}</h4>
                <p className="text-gray-400">{stat.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;