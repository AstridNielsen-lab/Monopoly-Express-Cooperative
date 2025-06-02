import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Target, Award, Heart } from 'lucide-react';
import SectionHeading from '../components/ui/SectionHeading';
import Button from '../components/ui/Button';

const About: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Quem Somos | Monopoly Express</title>
        <meta name="description" content="Conheça a história, missão e valores da Monopoly Express, a maior cooperativa de motoboys de São Paulo." />
      </Helmet>
      
      <section className="pt-32 pb-20 bg-secondary">
        <div className="container mx-auto px-4 md:px-8">
          <SectionHeading
            title="Quem Somos"
            subtitle="Conheça nossa história, missão e visão para transformar o futuro das entregas urbanas."
            centered
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-bold text-white mb-6">Nossa História</h3>
              <p className="text-gray-300 mb-4">
                A Monopoly Express nasceu da necessidade de unir forças em um cenário onde a exploração e a fragmentação dominavam. Em 2024, um grupo de entregadores cansados da precarização decidiu criar uma alternativa: uma cooperativa forte, independente e autogerida.
              </p>
              <p className="text-gray-300 mb-4">
                Em um cenário onde a agilidade dita o ritmo da economia, esquecemos muitas vezes quem realmente move a engrenagem da logística: o entregador. A Monopoly Express nasce com um propósito claro e revolucionário — reunir todos os motoboys de São Paulo em uma única estrutura cooperativa.
              </p>
              <p className="text-gray-300">
                Hoje, somos mais de 1.500 entregadores unidos por um objetivo comum: transformar o modelo de entregas urbanas, garantindo dignidade e renda justa para quem realmente faz a cidade se mover.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <img 
                src="https://images.pexels.com/photos/2765869/pexels-photo-2765869.jpeg?auto=compress&cs=tinysrgb&w=1600" 
                alt="Equipe Monopoly Express" 
                className="rounded-lg shadow-lg w-full"
              />
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="p-6 border border-gray-800 rounded-xl text-center"
            >
              <div className="flex justify-center mb-4">
                <Target size={48} className="text-primary" />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Missão</h4>
              <p className="text-gray-400">
                Ser o dente de ouro na engrenagem da logística: valioso, indestrutível e indispensável. Unificar os entregadores de São Paulo em uma estrutura cooperativa que devolva dignidade, representatividade e renda justa.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="p-6 border border-gray-800 rounded-xl text-center"
            >
              <div className="flex justify-center mb-4">
                <Award size={48} className="text-primary" />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Visão</h4>
              <p className="text-gray-400">
                Transformar o modelo de entregas urbanas, tornando-nos a maior e mais influente cooperativa de entregadores do Brasil, um exemplo a ser seguido em todo o mundo de como a união e autogestão podem revolucionar um setor.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="p-6 border border-gray-800 rounded-xl text-center"
            >
              <div className="flex justify-center mb-4">
                <Heart size={48} className="text-primary" />
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Valores</h4>
              <p className="text-gray-400">
                Solidariedade, autonomia, transparência, justiça, cooperação, inovação e resiliência. Acreditamos na força do coletivo e no poder da união para transformar realidades.
              </p>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-primary/10 rounded-xl p-8 border border-primary/20 text-center max-w-3xl mx-auto"
          >
            <h3 className="text-2xl font-bold text-white mb-4">Manifesto Monopoly Express</h3>
            <p className="text-gray-300 italic mb-6">
              "Somos o dente de ouro da logística: valioso, indestrutível e indispensável. Vamos quebrar paradigmas, acabar com a exploração fragmentada e devolver aos entregadores aquilo que é deles por direito — dignidade, representatividade, e renda justa. Monopoly Express é mais que uma empresa. É um movimento. Uma nova forma de pensar logística, onde o entregador é sócio, dono e protagonista."
            </p>
            <Button to="/seja-membro" variant="primary">
              Junte-se a nós
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default About;