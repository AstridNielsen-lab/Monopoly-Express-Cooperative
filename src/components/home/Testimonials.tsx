import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      quote: "Depois que entrei para a Monopoly Express, minha renda aumentou 40%. O mais importante: tenho voz nas decisões e não sou mais um número.",
      name: "Carlos Silva",
      role: "Membro há 8 meses",
      image: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
      quote: "A cooperativa me deu segurança. Quando sofri um acidente, tive todo o suporte médico e jurídico. Isso não tem preço.",
      name: "Marina Santos",
      role: "Membro há 1 ano",
      image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
      quote: "As plataformas tradicionais estavam me explorando. Aqui na Monopoly, tenho autonomia de verdade e faço parte de algo maior.",
      name: "Julio Campos Machado",
      role: "Fundador",
      image: "https://th.bing.com/th/id/OIP.h_qSAvnfmWBVl9yzjduy-QHaHa?rs=1&pid=ImgDetMain?auto=compress&cs=tinysrgb&w=400"
    }
  ];

  return (
    <section className="py-20 bg-primary/5">
      <div className="container mx-auto px-4 md:px-8">
        <SectionHeading
          title="Histórias de transformação"
          subtitle="Conheça alguns dos entregadores que já fazem parte do nosso movimento e como suas vidas mudaram."
          centered
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="bg-secondary-light rounded-xl p-6 shadow-card relative"
            >
              <Quote className="absolute top-4 right-4 text-primary/20" size={40} />
              
              <p className="text-gray-300 mb-6 relative z-10">"{testimonial.quote}"</p>
              
              <div className="flex items-center">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="text-white font-medium">{testimonial.name}</h4>
                  <p className="text-gray-400 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
