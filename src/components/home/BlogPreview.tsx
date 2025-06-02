import React from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionHeading from '../ui/SectionHeading';
import Button from '../ui/Button';

const BlogPreview: React.FC = () => {
  const posts = [
    {
      id: 1,
      title: 'Vitória histórica: motoboys conquistam direito à participação nos lucros',
      excerpt: 'Após meses de negociação, cooperativa Monopoly Express garante avanço inédito para entregadores...',
      date: '15 Maio, 2025',
      image: 'https://images.pexels.com/photos/6169668/pexels-photo-6169668.jpeg?auto=compress&cs=tinysrgb&w=1600',
      category: 'Direitos',
    },
    {
      id: 2,
      title: 'Como a cooperativa mudou a vida de entregadores em São Paulo',
      excerpt: 'Relatos reais de motoboys que viram sua renda aumentar e qualidade de vida melhorar após...',
      date: '28 Abril, 2025',
      image: 'https://images.pexels.com/photos/3747139/pexels-photo-3747139.jpeg?auto=compress&cs=tinysrgb&w=1600',
      category: 'Histórias',
    },
    {
      id: 3,
      title: 'Tecnologia a serviço dos entregadores: conheça nosso novo app',
      excerpt: 'Desenvolvido com e para motoboys, a nova plataforma da Monopoly Express garante mais transparência...',
      date: '10 Abril, 2025',
      image: 'https://images.pexels.com/photos/5083414/pexels-photo-5083414.jpeg?auto=compress&cs=tinysrgb&w=1600',
      category: 'Tecnologia',
    }
  ];

  return (
    <section className="py-20 bg-secondary-dark">
      <div className="container mx-auto px-4 md:px-8">
        <SectionHeading
          title="Últimas notícias"
          subtitle="Acompanhe as novidades sobre direitos dos entregadores, vitórias legais e avanços da nossa cooperativa."
          centered
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {posts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="bg-secondary-light rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow duration-300"
            >
              <Link to={`/blog/${post.id}`} className="block">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-48 object-cover"
                />
              </Link>
              <div className="p-6">
                <span className="inline-block px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full mb-4">
                  {post.category}
                </span>
                <Link to={`/blog/${post.id}`}>
                  <h3 className="text-xl font-bold text-white mb-3 hover:text-accent transition-colors duration-200">
                    {post.title}
                  </h3>
                </Link>
                <p className="text-gray-400 mb-4">{post.excerpt}</p>
                <div className="flex items-center text-gray-500 text-sm">
                  <Calendar size={16} className="mr-2" />
                  <span>{post.date}</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
        
        <div className="text-center">
          <Button to="/blog" variant="outline">
            Ver todas as notícias
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;