import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Logo from '../ui/Logo';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Início', path: '/' },
    { name: 'Quem Somos', path: '/quem-somos' },
    { name: 'Como Funciona', path: '/como-funciona' },
    { name: 'Seja Membro', path: '/seja-membro' },
    { name: 'Blog', path: '/blog' },
  ];

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-secondary py-2 shadow-md' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-4 md:px-8">
        <nav className="flex justify-between items-center">
          <Link to="/" className="flex-shrink-0">
            <Logo size="small" />
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium text-base hover:text-accent transition-colors duration-200 ${
                  location.pathname === link.path ? 'text-accent' : 'text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/seja-membro"
              className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded-full transition-colors duration-200"
            >
              Junte-se a nós
            </Link>
          </div>
          
          {/* Mobile Navigation Toggle */}
          <button
            className="md:hidden text-white p-2"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
        
        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-secondary shadow-lg py-4">
            <div className="flex flex-col space-y-4 px-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`font-medium text-base hover:text-accent transition-colors duration-200 ${
                    location.pathname === link.path ? 'text-accent' : 'text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/seja-membro"
                className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded-full transition-colors duration-200 text-center mt-2"
              >
                Junte-se a nós
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;