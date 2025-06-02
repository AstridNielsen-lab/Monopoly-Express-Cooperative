export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  category: string;
  readTime: number;
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: 'Vitória histórica: motoboys conquistam direito à participação nos lucros',
    excerpt: 'Após meses de negociação, cooperativa Monopoly Express garante avanço inédito para entregadores de São Paulo.',
    date: '15 Maio, 2025',
    image: 'https://images.pexels.com/photos/6169668/pexels-photo-6169668.jpeg?auto=compress&cs=tinysrgb&w=1600',
    category: 'Direitos',
    readTime: 5
  },
  {
    id: 2,
    title: 'Como a cooperativa mudou a vida de entregadores em São Paulo',
    excerpt: 'Relatos reais de motoboys que viram sua renda aumentar e qualidade de vida melhorar após se juntarem à Monopoly Express.',
    date: '28 Abril, 2025',
    image: 'https://images.pexels.com/photos/3747139/pexels-photo-3747139.jpeg?auto=compress&cs=tinysrgb&w=1600',
    category: 'Histórias',
    readTime: 7
  },
  {
    id: 3,
    title: 'Tecnologia a serviço dos entregadores: conheça nosso novo app',
    excerpt: 'Desenvolvido com e para motoboys, a nova plataforma da Monopoly Express garante mais transparência e controle sobre as entregas.',
    date: '10 Abril, 2025',
    image: 'https://images.pexels.com/photos/5083414/pexels-photo-5083414.jpeg?auto=compress&cs=tinysrgb&w=1600',
    category: 'Tecnologia',
    readTime: 4
  },
  {
    id: 4,
    title: 'Monopoly Express expande operações para a região metropolitana',
    excerpt: 'Cooperativa agora atende cidades como Guarulhos, Osasco e ABC Paulista, ampliando oportunidades para entregadores.',
    date: '02 Abril, 2025',
    image: 'https://images.pexels.com/photos/1722198/pexels-photo-1722198.jpeg?auto=compress&cs=tinysrgb&w=1600',
    category: 'Comunidade',
    readTime: 3
  },
  {
    id: 5,
    title: 'Entenda seus direitos: o que todo entregador precisa saber',
    excerpt: 'Guia completo sobre direitos trabalhistas, previdenciários e tributários para motoboys e entregadores autônomos.',
    date: '25 Março, 2025',
    image: 'https://images.pexels.com/photos/6590920/pexels-photo-6590920.jpeg?auto=compress&cs=tinysrgb&w=1600',
    category: 'Direitos',
    readTime: 8
  },
  {
    id: 6,
    title: 'Dicas para economizar na manutenção da sua moto',
    excerpt: 'Aprenda como fazer seu veículo durar mais e gastar menos com reparos, aumentando sua margem de lucro nas entregas.',
    date: '18 Março, 2025',
    image: 'https://images.pexels.com/photos/4018576/pexels-photo-4018576.jpeg?auto=compress&cs=tinysrgb&w=1600',
    category: 'Dicas',
    readTime: 6
  },
  {
    id: 7,
    title: 'Cooperativa firma parceria com restaurantes locais para entregas exclusivas',
    excerpt: 'Acordo beneficia estabelecimentos independentes e garante demanda contínua para entregadores da Monopoly Express.',
    date: '05 Março, 2025',
    image: 'https://images.pexels.com/photos/5920744/pexels-photo-5920744.jpeg?auto=compress&cs=tinysrgb&w=1600',
    category: 'Comunidade',
    readTime: 4
  },
  {
    id: 8,
    title: 'Saúde do entregador: como cuidar do corpo nas longas jornadas',
    excerpt: 'Médicos e fisioterapeutas dão orientações para prevenir lesões e manter a saúde física durante o trabalho nas ruas.',
    date: '25 Fevereiro, 2025',
    image: 'https://images.pexels.com/photos/3490348/pexels-photo-3490348.jpeg?auto=compress&cs=tinysrgb&w=1600',
    category: 'Dicas',
    readTime: 5
  },
  {
    id: 9,
    title: 'Da exploração à cooperação: a história da Monopoly Express',
    excerpt: 'Conheça a trajetória de luta e organização que deu origem à maior cooperativa de entregadores do Brasil.',
    date: '15 Fevereiro, 2025',
    image: 'https://images.pexels.com/photos/5812861/pexels-photo-5812861.jpeg?auto=compress&cs=tinysrgb&w=1600',
    category: 'Histórias',
    readTime: 10
  }
];