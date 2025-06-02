import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Search } from 'lucide-react';
import SectionHeading from '../components/ui/SectionHeading';
import { blogPosts } from '../data/blogPosts';

const Blog: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [activeCategory, setActiveCategory] = React.useState('Todos');
  
  const categories = ['Todos', 'Direitos', 'Tecnologia', 'Histórias', 'Comunidade', 'Dicas'];
  
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'Todos' || post.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  return (
    <>
      <Helmet>
        <title>Blog | Monopoly Express</title>
        <meta name="description" content="Fique por dentro das novidades, histórias e conquistas da maior cooperativa de motoboys de São Paulo." />
      </Helmet>
      
      <section className="pt-32 pb-20 bg-secondary">
        <div className="container mx-auto px-4 md:px-8">
          <SectionHeading
            title="Blog e Notícias"
            subtitle="Fique por dentro das novidades, histórias e conquistas da nossa cooperativa e dos direitos dos entregadores."
            centered
          />
          
          <div className="mb-12">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
              <div className="relative w-full md:w-96">
                <input
                  type="text"
                  placeholder="Buscar artigos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full py-3 pl-4 pr-12 bg-secondary-light border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-white"
                />
                <Search size={20} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              
              <div className="flex flex-wrap gap-2 justify-center">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                      activeCategory === category
                        ? 'bg-primary text-white'
                        : 'bg-secondary-light text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            
            {filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg mb-4">Nenhum artigo encontrado para sua busca.</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setActiveCategory('Todos');
                  }}
                  className="text-primary hover:text-primary-light"
                >
                  Limpar filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post, index) => (
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
            )}
          </div>
          
          <div className="flex justify-center">
            <div className="flex space-x-1">
              <button className="px-4 py-2 bg-primary text-white rounded-md">1</button>
              <button className="px-4 py-2 bg-secondary-light text-white hover:bg-gray-700 rounded-md">2</button>
              <button className="px-4 py-2 bg-secondary-light text-white hover:bg-gray-700 rounded-md">3</button>
              <span className="px-4 py-2 text-gray-400">...</span>
              <button className="px-4 py-2 bg-secondary-light text-white hover:bg-gray-700 rounded-md">10</button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Blog;