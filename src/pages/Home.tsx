import React from 'react';
import { Helmet } from 'react-helmet-async';
import Hero from '../components/home/Hero';
import Stats from '../components/home/Stats';
import Features from '../components/home/Features';
import MobileApp from '../components/home/MobileApp';
import Testimonials from '../components/home/Testimonials';
import BlogPreview from '../components/home/BlogPreview';
import CTA from '../components/home/CTA';

const Home: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Monopoly Express - O Futuro da Logística</title>
        <meta name="description" content="A revolução das entregas em São Paulo começa aqui. Unidos somos imbatíveis. Faça parte da maior cooperativa de motoboys do Brasil." />
      </Helmet>
      
      <Hero />
      <Stats />
      <Features />
      <MobileApp />
      <Testimonials />
      <BlogPreview />
      <CTA />
    </>
  );
};

export default Home;