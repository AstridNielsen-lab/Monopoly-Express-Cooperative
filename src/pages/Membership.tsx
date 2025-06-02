import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import SectionHeading from '../components/ui/SectionHeading';
import Button from '../components/ui/Button';

const Membership: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    experience: '',
    vehicle: '',
    message: '',
    acceptTerms: false
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) errors.name = 'Nome é obrigatório';
    if (!formData.email.trim()) errors.email = 'Email é obrigatório';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email inválido';
    
    if (!formData.phone.trim()) errors.phone = 'Telefone é obrigatório';
    else if (!/^\(\d{2}\) \d{5}-\d{4}$/.test(formData.phone)) errors.phone = 'Formato: (99) 99999-9999';
    
    if (!formData.city.trim()) errors.city = 'Cidade é obrigatória';
    if (!formData.experience) errors.experience = 'Selecione uma opção';
    if (!formData.vehicle) errors.vehicle = 'Selecione uma opção';
    if (!formData.acceptTerms) errors.acceptTerms = 'Você deve aceitar os termos';
    
    return errors;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Clear form
      setFormData({
        name: '',
        email: '',
        phone: '',
        city: '',
        experience: '',
        vehicle: '',
        message: '',
        acceptTerms: false
      });
    }, 1500);
  };
  
  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Format: (99) 99999-9999
    if (digits.length <= 2) {
      return digits.length ? `(${digits}` : '';
    } else if (digits.length <= 7) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    } else {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
    }
  };
  
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData(prev => ({ ...prev, phone: formatted }));
    
    if (formErrors.phone) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.phone;
        return newErrors;
      });
    }
  };
  
  return (
    <>
      <Helmet>
        <title>Seja Membro | Monopoly Express</title>
        <meta name="description" content="Junte-se à Monopoly Express, a maior cooperativa de motoboys de São Paulo. Faça parte da revolução das entregas urbanas." />
      </Helmet>
      
      <section className="pt-32 pb-20 bg-secondary">
        <div className="container mx-auto px-4 md:px-8">
          <SectionHeading
            title="Seja Membro"
            subtitle="Junte-se à maior cooperativa de entregadores de São Paulo e transforme sua carreira."
            centered
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-bold text-white mb-6">Por que se juntar a nós?</h3>
              <p className="text-gray-300 mb-6">
                Ao se tornar membro da Monopoly Express, você ganha mais do que um trabalho. Você se torna parte de um movimento que está transformando a logística urbana e devolvendo o poder a quem realmente faz a diferença: os entregadores.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary flex items-center justify-center mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <p className="ml-3 text-gray-300">
                    <strong className="text-white">Autonomia real</strong>: escolha seus horários e rotas sem algoritmos controlando sua vida
                  </p>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary flex items-center justify-center mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <p className="ml-3 text-gray-300">
                    <strong className="text-white">Ganhos justos</strong>: receba 100% do valor das entregas, sem taxas abusivas
                  </p>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary flex items-center justify-center mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <p className="ml-3 text-gray-300">
                    <strong className="text-white">Proteção completa</strong>: seguro de vida, acidentes e suporte jurídico
                  </p>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary flex items-center justify-center mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <p className="ml-3 text-gray-300">
                    <strong className="text-white">Poder de decisão</strong>: voto em assembleias e participação nas decisões da cooperativa
                  </p>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary flex items-center justify-center mt-1">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <p className="ml-3 text-gray-300">
                    <strong className="text-white">Comunidade forte</strong>: faça parte de uma rede de apoio com mais de 1.500 entregadores
                  </p>
                </div>
              </div>
              
              <div className="bg-primary/10 p-6 rounded-xl border border-primary/20">
                <div className="flex items-center mb-4">
                  <MessageCircle size={24} className="text-primary mr-2" />
                  <h4 className="text-lg font-bold text-white">Prefere conversar pelo WhatsApp?</h4>
                </div>
                <p className="text-gray-300 mb-4">
                  Se você tem dúvidas ou prefere um atendimento mais personalizado, fale diretamente com um dos nossos coordenadores.
                </p>
                <Button 
                  href="https://wa.me/5511999999999?text=Olá!%20Quero%20saber%20mais%20sobre%20a%20Monopoly%20Express" 
                  variant="primary"
                  className="w-full sm:w-auto"
                >
                  Falar pelo WhatsApp
                </Button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {isSubmitted ? (
                <div className="bg-success/10 p-8 rounded-xl border border-success/20 text-center">
                  <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg\" className="h-8 w-8 text-success\" fill="none\" viewBox="0 0 24 24\" stroke="currentColor">
                      <path strokeLinecap="round\" strokeLinejoin="round\" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Cadastro recebido com sucesso!</h3>
                  <p className="text-gray-300 mb-6">
                    Agradecemos seu interesse em fazer parte da Monopoly Express. Nossa equipe analisará suas informações e entrará em contato em até 48 horas úteis.
                  </p>
                  <Button variant="outline" onClick={() => setIsSubmitted(false)}>
                    Enviar novo cadastro
                  </Button>
                </div>
              ) : (
                <div className="bg-secondary-light p-8 rounded-xl shadow-card">
                  <h3 className="text-2xl font-bold text-white mb-6">Formulário de cadastro</h3>
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label htmlFor="name" className="block text-white font-medium mb-2">Nome completo *</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 bg-secondary-dark border ${formErrors.name ? 'border-error' : 'border-gray-700'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary`}
                          placeholder="Seu nome completo"
                        />
                        {formErrors.name && <p className="mt-1 text-error text-sm">{formErrors.name}</p>}
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-white font-medium mb-2">E-mail *</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 bg-secondary-dark border ${formErrors.email ? 'border-error' : 'border-gray-700'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary`}
                          placeholder="seu@email.com"
                        />
                        {formErrors.email && <p className="mt-1 text-error text-sm">{formErrors.email}</p>}
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="block text-white font-medium mb-2">Telefone/WhatsApp *</label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handlePhoneChange}
                          className={`w-full px-4 py-2 bg-secondary-dark border ${formErrors.phone ? 'border-error' : 'border-gray-700'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary`}
                          placeholder="(11) 97060-3441"
                        />
                        {formErrors.phone && <p className="mt-1 text-error text-sm">{formErrors.phone}</p>}
                      </div>
                      
                      <div>
                        <label htmlFor="city" className="block text-white font-medium mb-2">Cidade/Região *</label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 bg-secondary-dark border ${formErrors.city ? 'border-error' : 'border-gray-700'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary`}
                          placeholder="São Paulo - Zona Sul"
                        />
                        {formErrors.city && <p className="mt-1 text-error text-sm">{formErrors.city}</p>}
                      </div>
                      
                      <div>
                        <label htmlFor="experience" className="block text-white font-medium mb-2">Experiência como entregador *</label>
                        <select
                          id="experience"
                          name="experience"
                          value={formData.experience}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 bg-secondary-dark border ${formErrors.experience ? 'border-error' : 'border-gray-700'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary`}
                        >
                          <option value="">Selecione...</option>
                          <option value="0-6 meses">Menos de 6 meses</option>
                          <option value="6-12 meses">6 a 12 meses</option>
                          <option value="1-3 anos">1 a 3 anos</option>
                          <option value="3+ anos">Mais de 3 anos</option>
                        </select>
                        {formErrors.experience && <p className="mt-1 text-error text-sm">{formErrors.experience}</p>}
                      </div>
                      
                      <div>
                        <label htmlFor="vehicle" className="block text-white font-medium mb-2">Tipo de veículo *</label>
                        <select
                          id="vehicle"
                          name="vehicle"
                          value={formData.vehicle}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 bg-secondary-dark border ${formErrors.vehicle ? 'border-error' : 'border-gray-700'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary`}
                        >
                          <option value="">Selecione...</option>
                          <option value="Moto até 125cc">Moto até 125cc</option>
                          <option value="Moto 150cc a 250cc">Moto 150cc a 250cc</option>
                          <option value="Moto acima de 250cc">Moto acima de 250cc</option>
                          <option value="Bicicleta/E-bike">Bicicleta/E-bike</option>
                          <option value="Carro">Carro</option>
                        </select>
                        {formErrors.vehicle && <p className="mt-1 text-error text-sm">{formErrors.vehicle}</p>}
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="message" className="block text-white font-medium mb-2">Mensagem (opcional)</label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-2 bg-secondary-dark border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Conte-nos mais sobre você ou faça perguntas"
                      ></textarea>
                    </div>
                    
                    <div className="mb-8">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="acceptTerms"
                            name="acceptTerms"
                            type="checkbox"
                            checked={formData.acceptTerms}
                            onChange={handleChange}
                            className="w-4 h-4 bg-secondary-dark border-gray-700 rounded focus:ring-primary"
                          />
                        </div>
                        <label htmlFor="acceptTerms" className={`ml-3 text-sm ${formErrors.acceptTerms ? 'text-error' : 'text-gray-400'}`}>
                          Concordo com os termos de uso e política de privacidade da Monopoly Express *
                        </label>
                      </div>
                      {formErrors.acceptTerms && <p className="mt-1 text-error text-sm">{formErrors.acceptTerms}</p>}
                    </div>
                    
                    <Button
                      type="submit"
                      variant="primary"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Enviando...' : 'Enviar cadastro'}
                    </Button>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
          
          <div className="bg-primary/5 p-8 rounded-xl border border-primary/20 mb-16">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Próximos passos após o cadastro</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                  1
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Análise</h4>
                <p className="text-gray-400">
                  Nossa equipe analisa seu cadastro e documentação em até 48 horas úteis.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                  2
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Integração</h4>
                <p className="text-gray-400">
                  Você recebe acesso ao app e realiza um treinamento online rápido sobre a cooperativa.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                  3
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Ativação</h4>
                <p className="text-gray-400">
                  Comece a realizar entregas e a participar das decisões da cooperativa.
                </p>
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
            <p className="text-xl text-gray-300 mb-4 max-w-2xl mx-auto">
              Ainda tem dúvidas sobre como funciona a Monopoly Express?
            </p>
            <Button to="/como-funciona" variant="outline">
              Saiba mais sobre o funcionamento
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Membership;
