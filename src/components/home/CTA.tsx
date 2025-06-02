import React from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';

const CTA: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-primary to-primary-dark">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-white mb-6">
            Junte-se ao futuro da logística urbana
          </h2>
          <p className="text-white/90 text-lg mb-8">
            Faça parte da maior rede de entregadores independentes de São Paulo. Juntos somos mais fortes, juntos somos Monopoly Express.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button 
              to="/seja-membro" 
              variant="accent" 
              size="lg"
            >
              Quero me cadastrar
            </Button>
            <Button 
              href="https://wa.me/5511999999999" 
              variant="outline" 
              size="lg"
              className="border-white text-white hover:bg-white/10"
            >
              Fale conosco
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;