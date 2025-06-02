import React from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-16">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-black opacity-60"
          style={{ 
            backgroundImage: 'url(https://images.pexels.com/photos/2519374/pexels-photo-2519374.jpeg?auto=compress&cs=tinysrgb&w=1600)', 
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-secondary-dark/90 via-secondary/80 to-secondary"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-heading font-extrabold text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6">
              O <span className="text-accent">dente de ouro</span> <br className="hidden md:block" />
              da logística
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-xl">
              Unidos somos imbatíveis. Quem move a cidade, agora decide o rumo.
            </p>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button 
                to="/seja-membro" 
                variant="primary" 
                size="lg"
              >
                Faça parte da revolução
              </Button>
              
              <Button 
                to="/como-funciona" 
                variant="outline" 
                size="lg"
              >
                Como funciona
              </Button>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent rounded-full opacity-20 animate-pulse delay-700"></div>
              <img 
                src="https://images.pexels.com/photos/9218732/pexels-photo-9218732.jpeg?auto=compress&cs=tinysrgb&w=1600" 
                alt="Entregador Monopoly Express" 
                className="rounded-lg shadow-2xl max-h-[600px] object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
      
      <div className="absolute bottom-6 left-0 right-0 flex justify-center animate-bounce">
        <a href="#stats" className="text-white opacity-70 hover:opacity-100">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 13l5 5 5-5M7 6l5 5 5-5"/>
          </svg>
        </a>
      </div>
    </section>
  );
};

export default Hero;