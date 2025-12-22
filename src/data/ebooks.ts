export type EbookCategory = "Receitas" | "Emagrecimento" | "Hipertrofia" | "Outra";

export type EbookItem = {
  id: string;
  title: string;
  description: string;
  category: EbookCategory;
  cover: string;
  alt: string;
  url: string;
  highlight?: string;
};

export const EBOOK_CATEGORIES: EbookCategory[] = ["Receitas", "Emagrecimento", "Hipertrofia", "Outra"];

export const EBOOKS: EbookItem[] = [
  {
    id: "desinchar-7-dias",
    title: "Protocolo para Desinchar em 7 Dias",
    description: "Aprenda, passo a passo, como reduzir inchaço e retenção sem dietas malucas.",
    category: "Emagrecimento",
    cover:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80",
    alt: "Mesa com vegetais frescos e caderno de receitas",
    url: "https://go.thaispaganini.com/desinchar7dias",
    highlight: "Favorito das alunas",
  },
  {
    id: "plano-15-minutos",
    title: "Cardápios Práticos em 15 Minutos",
    description: "Descubra como montar refeições completas em minutos, mesmo em dias corridos.",
    category: "Receitas",
    cover:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80",
    alt: "Prato saudável com abacate e ovos",
    url: "https://go.thaispaganini.com/cardapios15",
  },
  {
    id: "proteina-na-medida",
    title: "Guia Proteico para Hipertrofia Feminina",
    description: "Estruture combinações inteligentes de proteínas para força e definição real.",
    category: "Hipertrofia",
    cover:
      "https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=900&q=80",
    alt: "Utensílios de academia ao lado de refeição proteica",
    url: "https://go.thaispaganini.com/proteinafeminina",
    highlight: "Foco em performance",
  },
  {
    id: "doces-equilibrados",
    title: "Doces Equilibrados Sem Culpa",
    description: "Transforme sua relação com a sobremesa com receitas leves e saciantes.",
    category: "Receitas",
    cover:
      "https://images.unsplash.com/photo-1481391032119-d89fee407e44?auto=format&fit=crop&w=900&q=80",
    alt: "Sobremesa saudável em pote de vidro",
    url: "https://go.thaispaganini.com/doces",
  },
  {
    id: "metabolismo-ativo",
    title: "Metabolismo Ativo para Emagrecer",
    description: "Ajustes simples para acelerar resultados e manter energia durante o dia.",
    category: "Emagrecimento",
    cover:
      "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?auto=format&fit=crop&w=900&q=80",
    alt: "Mulher preparando vitamina saudável",
    url: "https://go.thaispaganini.com/metabolismo",
  },
  {
    id: "rotina-sem-ansiedade",
    title: "Rotina Alimentar Sem Ansiedade",
    description: "Guia prático para sair do ciclo de beliscar e criar estabilidade emocional.",
    category: "Outra",
    cover:
      "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&w=900&q=80",
    alt: "Caderno de planejamento com chá ao lado",
    url: "https://go.thaispaganini.com/rotinasemanxiety",
  },
  {
    id: "musculo-em-casa",
    title: "Hipertrofia em Casa com Nutrição Inteligente",
    description: "Planeje treinos e refeições que conversam para ganho de massa magra.",
    category: "Hipertrofia",
    cover:
      "https://images.unsplash.com/photo-1505253216365-86c5af6b114f?auto=format&fit=crop&w=900&q=80",
    alt: "Halteres e caderno de treino sobre tatame",
    url: "https://go.thaispaganini.com/hipertrofiaemcasa",
  },
  {
    id: "marmitas-equilibradas",
    title: "Marmitas Equilibradas para a Semana",
    description: "Aprenda a montar marmitas completas que mantêm saciedade e praticidade.",
    category: "Receitas",
    cover:
      "https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=900&q=80",
    alt: "Marmitas coloridas organizadas em bancada",
    url: "https://go.thaispaganini.com/marmitas",
  },
  {
    id: "recomposicao-corporal",
    title: "Recomposição Corporal Descomplicada",
    description: "Combine alimentação e treino para perder gordura e ganhar definição ao mesmo tempo.",
    category: "Hipertrofia",
    cover:
      "https://images.unsplash.com/photo-1505253216365-86c5af6b114f?auto=format&fit=crop&w=900&q=80",
    alt: "Pessoa segurando halteres com shake proteico",
    url: "https://go.thaispaganini.com/recomposicao",
  },
  {
    id: "detox-suave",
    title: "Detox Suave e Seguro",
    description: "Limpeza leve para melhorar digestão e disposição sem radicalismos.",
    category: "Emagrecimento",
    cover:
      "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=900&q=80",
    alt: "Copo de suco verde e folhas frescas",
    url: "https://go.thaispaganini.com/detoxsuave",
  },
  {
    id: "snacks-inteligentes",
    title: "Snacks Inteligentes para Não Sair da Linha",
    description: "Receitas rápidas de lanches saciantes para segurar a fome entre refeições.",
    category: "Receitas",
    cover:
      "https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=900&q=80",
    alt: "Mix de castanhas e frutas secas em tigela",
    url: "https://go.thaispaganini.com/snacks",
  },
  {
    id: "mindful-eating",
    title: "Mindful Eating na Prática",
    description: "Transforme a forma de comer para ter controle, prazer e resultado consistente.",
    category: "Outra",
    cover:
      "https://images.unsplash.com/photo-1484981184820-2e84ea0ae63a?auto=format&fit=crop&w=900&q=80",
    alt: "Pessoa segurando tigela saudável com as mãos",
    url: "https://go.thaispaganini.com/mindfuleating",
  },
];
