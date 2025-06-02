import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft, Share2, MessageCircle } from 'lucide-react';
import { blogPosts } from '../data/blogPosts';
import Button from '../components/ui/Button';

const BlogPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const postId = parseInt(id || '1');
  
  const post = blogPosts.find(p => p.id === postId);
  
  if (!post) {
    return (
      <div className="pt-32 pb-20 bg-secondary min-h-screen">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Artigo não encontrado</h2>
          <p className="text-gray-400 mb-8">O artigo que você está procurando não existe ou foi removido.</p>
          <Button to="/blog" variant="primary">
            Voltar para o blog
          </Button>
        </div>
      </div>
    );
  }
  
  // Get related posts (same category, excluding current)
  const relatedPosts = blogPosts
    .filter(p => p.category === post.category && p.id !== post.id)
    .slice(0, 3);
  
  return (
    <>
      <Helmet>
        <title>{post.title} | Monopoly Express</title>
        <meta name="description" content={post.excerpt} />
      </Helmet>
      
      <section className="pt-32 pb-20 bg-secondary">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <Link to="/blog" className="inline-flex items-center text-gray-400 hover:text-accent mb-8">
              <ArrowLeft size={16} className="mr-2" />
              Voltar para o blog
            </Link>
            
            <div className="mb-8">
              <span className="inline-block px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full mb-4">
                {post.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center text-gray-400 text-sm gap-4 mb-6">
                <div className="flex items-center">
                  <Calendar size={16} className="mr-2" />
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center">
                  <Clock size={16} className="mr-2" />
                  <span>{post.readTime} min de leitura</span>
                </div>
              </div>
            </div>
            
            <div className="mb-10">
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-[400px] object-cover rounded-xl"
              />
            </div>
            
            <div className="prose prose-lg prose-invert max-w-none mb-12">
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                Na última quarta-feira, a Monopoly Express conquistou uma vitória histórica para os entregadores de São Paulo. Após meses de negociação e mobilização coletiva, conseguimos garantir o direito à participação nos lucros para todos os membros da cooperativa. Esta é uma conquista inédita no setor de entregas urbanas no Brasil.
              </p>
              
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">O que significa na prática?</h2>
              
              <p className="text-gray-300 leading-relaxed mb-6">
                A partir do próximo trimestre, todos os membros ativos da Monopoly Express terão direito a uma porcentagem dos lucros gerados pela cooperativa. O valor será distribuído proporcionalmente ao número de entregas realizadas e ao tempo de associação. Estimamos que isso represente um aumento médio de 15% a 30% na renda mensal dos entregadores.
              </p>
              
              <p className="text-gray-300 leading-relaxed mb-6">
                Esta conquista é o resultado direto da força da união. Enquanto entregadores isolados em aplicativos tradicionais continuam sofrendo com taxas cada vez mais baixas e condições precárias, os membros da Monopoly Express demonstram que há um caminho alternativo baseado na cooperação e autogestão.
              </p>
              
              <blockquote className="border-l-4 border-primary pl-4 italic text-gray-300 my-8">
                "Quando nos unimos, provamos que somos capazes de mudar as regras do jogo. Não somos apenas entregadores, somos protagonistas de uma transformação no mercado de trabalho." — Roberto Oliveira, membro fundador
              </blockquote>
              
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">Próximos passos</h2>
              
              <p className="text-gray-300 leading-relaxed mb-6">
                Esta vitória é apenas o começo. Nossa cooperativa está em negociação para expandir outros benefícios, como:
              </p>
              
              <ul className="list-disc pl-6 text-gray-300 space-y-2 mb-6">
                <li>Plano de saúde subsidiado para todos os membros</li>
                <li>Fundo para aquisição e manutenção de motos</li>
                <li>Programa de aposentadoria complementar</li>
                <li>Expansão para outras regiões metropolitanas</li>
              </ul>
              
              <p className="text-gray-300 leading-relaxed">
                A Monopoly Express reafirma seu compromisso de ser o "dente de ouro da logística": valioso, indestrutível e indispensável. Continuaremos trabalhando para garantir que os entregadores tenham o reconhecimento e a valorização que merecem.
              </p>
            </div>
            
            <div className="flex flex-wrap justify-between items-center border-t border-b border-gray-800 py-6 mb-12">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <span className="text-gray-400">Compartilhar:</span>
                <button className="text-gray-400 hover:text-accent transition-colors duration-200">
                  <Share2 size={20} />
                </button>
              </div>
              
              <div>
                <Button
                  href="https://wa.me/5511999999999?text=Olá!%20Vi%20este%20artigo%20e%20quero%20saber%20mais%20sobre%20a%20Monopoly%20Express"
                  variant="primary"
                  className="flex items-center"
                >
                  <MessageCircle size={18} className="mr-2" />
                  Falar com um coordenador
                </Button>
              </div>
            </div>
            
            {relatedPosts.length > 0 && (
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-6">Artigos relacionados</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedPosts.map((relatedPost) => (
                    <Link
                      key={relatedPost.id}
                      to={`/blog/${relatedPost.id}`}
                      className="bg-secondary-light rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow duration-300"
                    >
                      <img 
                        src={relatedPost.image} 
                        alt={relatedPost.title} 
                        className="w-full h-32 object-cover"
                      />
                      <div className="p-4">
                        <h4 className="font-bold text-white hover:text-accent transition-colors duration-200 mb-2">
                          {relatedPost.title}
                        </h4>
                        <div className="flex items-center text-gray-500 text-xs">
                          <Calendar size={12} className="mr-1" />
                          <span>{relatedPost.date}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            
            <div className="text-center">
              <p className="text-gray-300 mb-6">
                Quer fazer parte da maior cooperativa de entregadores de São Paulo?
              </p>
              <Button to="/seja-membro" variant="primary">
                Junte-se a nós
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogPost;