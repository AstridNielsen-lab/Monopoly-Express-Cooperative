import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Phone, MessageCircle, Send } from 'lucide-react';
import Logo from '../ui/Logo';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary-dark pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <Logo size="medium" />
            <p className="mt-4 text-gray-400">
              A revolução das entregas em São Paulo começa aqui. Unidos somos imbatíveis.
            </p>
            <div className="flex mt-6 space-x-4">
              <a 
                href="https://www.instagram.com/radiotatuapefm" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-accent transition-colors duration-200"
                aria-label="Instagram"
              >
                <Instagram size={24} />
              </a>
              <a 
                href="https://wa.me/5511970603441" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-accent transition-colors duration-200"
                aria-label="WhatsApp"
              >
                <MessageCircle size={24} />
              </a>
              <a 
                href="https://www.facebook.com/likelooksolutions" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-accent transition-colors duration-200"
                aria-label="Facebook"
              >
                <Send size={24} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Páginas</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-accent transition-colors duration-200">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/quem-somos" className="text-gray-400 hover:text-accent transition-colors duration-200">
                  Quem Somos
                </Link>
              </li>
              <li>
                <Link to="/como-funciona" className="text-gray-400 hover:text-accent transition-colors duration-200">
                  Como Funciona
                </Link>
              </li>
              <li>
                <Link to="/seja-membro" className="text-gray-400 hover:text-accent transition-colors duration-200">
                  Seja Membro
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-accent transition-colors duration-200">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Contato</h3>
            <ul className="space-y-4">
              <li className="flex items-center text-gray-400">
                <Phone size={18} className="mr-2" />
                <a href="tel:+5511992946628" className="hover:text-accent transition-colors duration-200">
                  (11) 99294-6628
                </a>
              </li>
              <li className="flex items-center text-gray-400">
                <MessageCircle size={18} className="mr-2" />
                <a href="https://wa.me/5511970603441" className="hover:text-accent transition-colors duration-200">
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Endereço</h3>
            <p className="text-gray-400">
              Rua. Dante Pellacani, 92<br />
              Tatuapé, São Paulo - SP<br />
              CEP: 03334-070
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              Monopoly Express – Todos os direitos reservados © {currentYear}
            </p>
            <div className="flex space-x-4">
              <Link to="/termos-de-uso" className="text-gray-500 text-sm hover:text-accent transition-colors duration-200">
                Termos de Uso
              </Link>
              <Link to="/politica-de-privacidade" className="text-gray-500 text-sm hover:text-accent transition-colors duration-200">
                Política de Privacidade
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
