-- ─── Seed: Projetos do Portfólio ──────────────────────────────────────────────
-- Execute via psql:
--   psql "postgres://usuario:senha@host:porta/miniblog" -f scripts/seed_projects.sql
--
-- Idempotente: ON CONFLICT (slug) DO NOTHING
-- Imagens: adicione os arquivos PNG em frontend/public/images/projects/{slug}.png
-- ──────────────────────────────────────────────────────────────────────────────

INSERT INTO projects (
  id, slug, title, tagline, description, category,
  url, github_url, image,
  tags, tech_stack, stats, features,
  year, featured
)
VALUES

  -- ── Projetos de Clientes / Freelance ────────────────────────────────────────

  -- 1. Admita RH
  (
    'proj_admita_rh',
    'admita-rh',
    'Admita RH',
    'Plataforma completa de gestão de RH',
    'Sistema robusto de gestão de recursos humanos com 38+ anos de mercado, servindo mais de 200 clientes empresariais. Solução completa para folha de pagamento, ponto eletrônico, recrutamento e gestão de benefícios.',
    'web-app',
    'https://admitarh.com.br/', NULL,
    '/images/projects/admita-rh.png',
    '["Gestão de RH","Enterprise","Folha de Pagamento"]'::json,
    '[{"name":"Next.js"},{"name":"TypeScript"},{"name":"PostgreSQL"},{"name":"Node.js"}]'::json,
    '[{"label":"Anos de Mercado","value":"38+"},{"label":"Clientes Ativos","value":"200+"},{"label":"Funcionários Gerenciados","value":"10k+"}]'::json,
    '["Folha de pagamento automatizada","Ponto eletrônico integrado","Gestão de benefícios","Recrutamento e seleção","Relatórios avançados"]'::json,
    2024, true
  ),

  -- 2. Afinte
  (
    'proj_afinte',
    'afinte',
    'Afinte',
    'Soluções digitais que transformam negócios',
    'Site institucional da Afinte, empresa especializada em desenvolvimento de soluções digitais enterprise. Showcase de tecnologias modernas e cases de sucesso no mercado corporativo, com score de performance Lighthouse 98+.',
    'corporate',
    'https://www.afinte.com/', NULL,
    '/images/projects/afinte.png',
    '["Institucional","Corporate","Showcase"]'::json,
    '[{"name":"Next.js"},{"name":"TypeScript"},{"name":"Tailwind CSS"},{"name":"Framer Motion"}]'::json,
    '[{"label":"Performance Score","value":"98"},{"label":"Projetos Entregues","value":"50+"},{"label":"Anos de Experiência","value":"15+"}]'::json,
    '["Design moderno e responsivo","Animações fluidas com Framer Motion","SEO otimizado","Performance de ponta (Lighthouse 98+)"]'::json,
    2024, true
  ),

  -- 3. Confidere
  (
    'proj_confidere',
    'confidere',
    'Confidere',
    'Plataforma de crédito online simplificada',
    'Plataforma digital para solicitação e gestão de crédito online. Interface intuitiva que simplifica processos complexos de análise de crédito e aprovação, com taxa de satisfação de 4.8/5 e aprovação em até 24 horas.',
    'saas',
    'https://www.confiderecreditos.com.br/', NULL,
    '/images/projects/confidere.png',
    '["Fintech","Crédito","SaaS"]'::json,
    '[{"name":"React"},{"name":"Node.js"},{"name":"MongoDB"},{"name":"AWS"}]'::json,
    '[{"label":"Taxa de Aprovação","value":"85%"},{"label":"Tempo Médio","value":"24h"},{"label":"Satisfação","value":"4.8/5"}]'::json,
    '["Análise de crédito automatizada","Processo 100% digital","Aprovação em até 24h","Dashboard de acompanhamento"]'::json,
    2023, true
  ),

  -- 4. InsightLoop
  (
    'proj_insightloop',
    'insightloop',
    'InsightLoop',
    'Analytics de Instagram com IA',
    'Ferramenta SaaS de analytics para Instagram com insights gerados por inteligência artificial. Análise profunda de métricas, crescimento de audiência e otimização de conteúdo por apenas R$47/mês.',
    'analytics',
    'https://insightloop.ialumia.com/', NULL,
    '/images/projects/insightloop.png',
    '["Analytics","IA","Social Media"]'::json,
    '[{"name":"Next.js"},{"name":"OpenAI"},{"name":"PostgreSQL"},{"name":"Vercel"}]'::json,
    '[{"label":"Usuários Ativos","value":"500+"},{"label":"Preço Mensal","value":"R$47"},{"label":"Insights Gerados","value":"10k+"}]'::json,
    '["Análise de métricas com IA","Sugestões de conteúdo","Identificação de melhores horários","Análise de concorrentes","Relatórios automatizados"]'::json,
    2024, true
  ),

  -- 5. Grupo EGX
  (
    'proj_grupo_egx',
    'grupo-egx',
    'Grupo EGX',
    'Consultoria de growth e marketing de performance',
    'Site institucional para consultoria especializada em estratégias de growth e marketing de performance. Foco em resultados mensuráveis e crescimento acelerado, com CMS headless para gestão autônoma de conteúdo.',
    'corporate',
    'https://ogrupoegx.com/', NULL,
    '/images/projects/ogrupoegx.png',
    '["Consultoria","Marketing","Growth"]'::json,
    '[{"name":"Next.js"},{"name":"TypeScript"},{"name":"Tailwind CSS"},{"name":"Sanity CMS"}]'::json,
    '[{"label":"Clientes Atendidos","value":"100+"},{"label":"ROI Médio","value":"3.5x"},{"label":"Projetos Ativos","value":"30+"}]'::json,
    '["CMS headless para gestão de conteúdo","Blog otimizado para SEO","Formulários de contato","Integração com CRM"]'::json,
    2023, false
  ),

  -- 6. Versátil
  (
    'proj_versatil',
    'versatil',
    'Versátil',
    'Assessoria contábil de confiança',
    'Site moderno para escritório de contabilidade com mais de 30 anos de experiência. Apresentação de serviços, equipe e diferenciais competitivos para o mercado B2B, com satisfação de 4.9/5 entre os clientes.',
    'corporate',
    'https://versatil-lyart.vercel.app/', NULL,
    '/images/projects/versatil.png',
    '["Contabilidade","Serviços","B2B"]'::json,
    '[{"name":"Next.js"},{"name":"TypeScript"},{"name":"Tailwind CSS"}]'::json,
    '[{"label":"Anos de Experiência","value":"30+"},{"label":"Empresas Atendidas","value":"150+"},{"label":"Satisfação","value":"4.9/5"}]'::json,
    '["Apresentação de serviços","Portal do cliente","Formulário de orçamento","Blog informativo"]'::json,
    2023, false
  ),

  -- 7. Barbara Alves
  (
    'proj_barbara_alves',
    'barbara-alves',
    'Barbara Alves',
    'Advocacia corporativa e trabalhista',
    'Site profissional para escritório de advocacia especializado em direito corporativo e trabalhista. Design elegante que transmite confiança e expertise jurídica, com taxa de vitória de 92% nos casos atendidos.',
    'corporate',
    'https://barbaraalvesadvocacia.com.br', NULL,
    '/images/projects/barbara-alves.png',
    '["Advocacia","Jurídico","Corporativo"]'::json,
    '[{"name":"Next.js"},{"name":"TypeScript"},{"name":"Tailwind CSS"}]'::json,
    '[{"label":"Anos de Atuação","value":"10+"},{"label":"Casos de Sucesso","value":"500+"},{"label":"Taxa de Vitória","value":"92%"}]'::json,
    '["Áreas de atuação detalhadas","Formulário de consulta","Blog jurídico","Agendamento online"]'::json,
    2024, false
  ),

  -- ── Projetos Pessoais ─────────────────────────────────────────────────────────

  -- 8. devlog. (miniBlog)
  (
    'proj_mini_blog',
    'mini-blog',
    'devlog.',
    'Blog pessoal com backend próprio em FastAPI e autenticação JWT',
    'Blog pessoal de desenvolvimento construído do zero. O backend, originalmente em Firebase, foi migrado completamente para FastAPI + PostgreSQL com autenticação JWT stateless, rotação de refresh token e rate limiting por IP. Frontend em React com TypeScript e Vite.',
    'web-app',
    'https://mini-blog-cyan-pi.vercel.app', 'https://github.com/oliveeiralucas/miniBlog',
    '/images/projects/mini-blog.png',
    '["Blog","Open Source","Full Stack"]'::json,
    '[{"name":"React"},{"name":"TypeScript"},{"name":"FastAPI"},{"name":"PostgreSQL"},{"name":"Docker"},{"name":"Alembic"}]'::json,
    '[]'::json,
    '["Autenticação JWT com rotação de refresh token","CRUD de posts com sistema de likes e comentários","Rate limiting por IP via slowapi","Sistema de tags para categorização","Busca de artigos por texto e tag"]'::json,
    2025, true
  ),

  -- 9. Exactus Schedule
  (
    'proj_exactus',
    'projeto-exactus',
    'Exactus Schedule',
    'Sistema de agendamento e gerenciamento de reuniões corporativas',
    'Plataforma web para gerenciar reuniões com eficiência, voltada para usuários corporativos. Possui interface de login split-screen e suporte completo a desktop e mobile, construída sobre Next.js com React Server Components.',
    'saas',
    'https://projeto-exactus.vercel.app', 'https://github.com/oliveeiralucas/ProjetoExactus',
    '/images/projects/projeto-exactus.png',
    '["Agendamento","Corporativo","SaaS"]'::json,
    '[{"name":"Next.js"},{"name":"React"},{"name":"TypeScript"},{"name":"Tailwind CSS"}]'::json,
    '[]'::json,
    '["Autenticação com email e senha","Criação e gerenciamento de reuniões","Interface responsiva para desktop e mobile","Design split-screen moderno","Localização em português do Brasil"]'::json,
    2024, false
  ),

  -- 10. License Server
  (
    'proj_license_server',
    'license-server',
    'License Server',
    'Servidor de licenciamento e validação de software',
    'Sistema de controle e validação de licenças de software. Plataforma para gerenciamento centralizado de licenças com validação automática e controle de ativações por dispositivo.',
    'tool',
    'https://license-server-rouge-one.vercel.app', 'https://github.com/oliveeiralucas/license-server',
    '/images/projects/license-server.png',
    '["Licenciamento","Ferramenta","Backend"]'::json,
    '[]'::json,
    '[]'::json,
    '["Gerenciamento centralizado de licenças","Validação automática por chave","Controle de ativações por dispositivo"]'::json,
    2024, false
  ),

  -- 11. Tailwind Library
  (
    'proj_tailwind_library',
    'tailwind-library',
    'Tailwind Library',
    'Renderizador interativo de componentes Tailwind UI',
    'Ferramenta de visualização de componentes Tailwind UI+, permitindo ao desenvolvedor selecionar dinamicamente blocos, grupos e componentes para renderizá-los em tempo real. Funciona como um navegador/preview de biblioteca de componentes com suporte a caminho manual.',
    'tool',
    'https://tailwind-library.vercel.app', 'https://github.com/oliveeiralucas/tailwind-library',
    '/images/projects/tailwind-library.png',
    '["Tailwind CSS","Componentes","Ferramenta"]'::json,
    '[{"name":"Vite"},{"name":"React"},{"name":"TypeScript"},{"name":"Tailwind CSS"}]'::json,
    '[]'::json,
    '["Seletor hierárquico (Block > Grupo > Componente > Arquivo)","Renderização dinâmica em tempo real","Campo de caminho manual para acesso direto","Preview integrado de layouts"]'::json,
    2024, false
  ),

  -- 12. Horta Solidária
  (
    'proj_horta_solidaria',
    'extensao-horta-solidaria',
    'Horta Solidária',
    'Plataforma de extensão universitária para hortas comunitárias',
    'Aplicação web de suporte a projeto de extensão universitária voltado para hortas comunitárias solidárias. Desenvolvida com Next.js e Tailwind CSS, com foco em gestão e acompanhamento de iniciativas de agricultura urbana comunitária.',
    'web-app',
    'https://extensao-horta-solidaria-one.vercel.app', 'https://github.com/oliveeiralucas/extensao-horta-solidaria',
    '/images/projects/extensao-horta-solidaria.png',
    '["Extensão Universitária","Comunidade","Agricultura"]'::json,
    '[{"name":"Next.js"},{"name":"TypeScript"},{"name":"Tailwind CSS"}]'::json,
    '[]'::json,
    '["Sistema de autenticação de usuários","Identidade visual temática (green scheme)","Design responsivo","Gestão de iniciativas comunitárias"]'::json,
    2024, false
  ),

  -- 13. Mentalidade Imersiva
  (
    'proj_mentalidade_imersiva',
    'mentalidade-imersiva',
    'Mentalidade Imersiva',
    'Landing page de alta conversão para eBook de desenvolvimento pessoal',
    'Landing page de alta conversão para um eBook gratuito de desenvolvimento pessoal com foco em reprogramação mental e liberdade emocional. Conteúdo estruturado em 6 capítulos com design dark e call-to-action de urgência para download do PDF.',
    'corporate',
    'https://mentalidade-imersiva.vercel.app', 'https://github.com/oliveeiralucas/mentalidadeImersiva',
    '/images/projects/mentalidade-imersiva.png',
    '["Landing Page","eBook","Marketing"]'::json,
    '[{"name":"Next.js"},{"name":"React"},{"name":"Tailwind CSS"}]'::json,
    '[{"label":"Capítulos","value":"6"}]'::json,
    '["Download gratuito de eBook em PDF","Conteúdo estruturado em 6 capítulos","Seção de FAQ completa","Design dark com paleta de alta conversão","Call-to-action com urgência e escassez"]'::json,
    2024, false
  ),

  -- 14. DIAna
  (
    'proj_diana',
    'dia-na',
    'DIAna',
    'Sistema de transcrição e geração automática de atas via IA',
    'DIAna (Documentação Inteligente de Áudios) automatiza a documentação de reuniões corporativas. Colaboradores fazem upload de áudio (até 50MB) e recebem atas estruturadas via N8N + IA, com dashboard de métricas, workflow de aprovação e autenticação JWT restrita a domínio corporativo.',
    'saas',
    'https://dia-na.vercel.app', 'https://github.com/oliveeiralucas/DIAna',
    '/images/projects/dia-na.png',
    '["IA","Automação","Produtividade"]'::json,
    '[{"name":"Next.js"},{"name":"React 19"},{"name":"TypeScript"},{"name":"Tailwind CSS"},{"name":"Prisma"},{"name":"PostgreSQL"},{"name":"N8N"},{"name":"JWT"}]'::json,
    '[{"label":"Tamanho máx. de áudio","value":"50MB"},{"label":"Formatos suportados","value":"MP3, WAV, M4A"}]'::json,
    '["Upload de áudio com barra de progresso em tempo real","Transcrição e geração de atas via N8N + IA","Workflow de aprovação com status dinâmico (Pendente/Aprovada/Rejeitada)","Dashboard interativo com métricas e gráficos (Recharts)","Autenticação JWT com restrição de domínio corporativo"]'::json,
    2025, true
  ),

  -- 15. MadHub
  (
    'proj_madhub',
    'madhub-space',
    'MadHub',
    'Assistente pessoal inteligente com autenticação passwordless',
    'MadHub é um sistema de assistente pessoal denominado J.A.R.V.I.S, com autenticação passwordless via código enviado ao email do usuário. Interface dark mode com gradiente, grid pattern e componentes com backdrop blur.',
    'web-app',
    'https://madhub-space.vercel.app', 'https://github.com/oliveeiralucas/madhub.space',
    '/images/projects/madhub-space.png',
    '["Assistente","Passwordless","Dark Mode"]'::json,
    '[{"name":"Next.js"},{"name":"React"},{"name":"TypeScript"},{"name":"Tailwind CSS"}]'::json,
    '[]'::json,
    '["Autenticação passwordless via código por email","Interface dark mode futurística (inspirada em J.A.R.V.I.S)","Layout responsivo com backdrop blur e gradientes","Sistema de cards interativos"]'::json,
    2025, false
  ),

  -- 16. Personal Diet
  (
    'proj_personal_diet',
    'personal-diet',
    'Personal Diet',
    'Hub centralizado de bem-estar e performance para triatleta',
    'Hub de performance e bem-estar pessoal para um triatleta, centralizando múltiplas aplicações: planejador nutricional com dieta mediterrânea personalizada, plano de bronzeamento de 15 dias e plano de treino Push/Pull/Legs. Arquitetura modular com 3 mini-apps adicionais em desenvolvimento.',
    'web-app',
    'https://personal-diet.vercel.app', 'https://github.com/oliveeiralucas/personal-diet',
    '/images/projects/personal-diet.png',
    '["Saúde","Triathlon","Nutrição"]'::json,
    '[{"name":"Next.js"},{"name":"React"},{"name":"Tailwind CSS"}]'::json,
    '[{"label":"Apps ativos","value":"3"},{"label":"Em desenvolvimento","value":"3"}]'::json,
    '["Planejador nutricional com dieta mediterrânea para triathlon","Plano de bronzeamento de 15 dias","Plano de treino Push/Pull/Legs (Seg/Qua/Sex)","Cards com indicador de status em tempo real","Arquitetura modular expansível"]'::json,
    2025, false
  ),

  -- 17. Vanilla Games
  (
    'proj_vanilla_games',
    'vanilla-games',
    'Vanilla Games',
    'Plataforma brasileira de servidores privados de MMORPGs',
    'Plataforma de lançamento de servidores privados de MMORPGs para o mercado brasileiro, com foco em fair-play e anti-pay-to-win. O primeiro servidor é Perfect World, com balanceamento contínuo, baixa latência e eventos comunitários integrados ao Discord.',
    'corporate',
    'https://vanilla-games-two.vercel.app', 'https://github.com/oliveeiralucas/vanilla-games',
    '/images/projects/vanilla-games.png',
    '["Gaming","MMORPG","Comunidade"]'::json,
    '[{"name":"Next.js"},{"name":"React"},{"name":"TypeScript"}]'::json,
    '[{"label":"Jogos previstos","value":"4+"}]'::json,
    '["Servidor privado de Perfect World (Season 1)","Modelo sem pay-to-win com balanceamento contínuo","Integração com Discord para eventos e suporte","Infraestrutura de baixa latência","Roadmap com Ragnarok, Mu Online e GTA RP"]'::json,
    2024, false
  ),

  -- 18. Fidelity PW
  (
    'proj_fidelity_pw',
    'fidelity-pw-website',
    'Fidelity PW',
    'Site oficial do servidor privado Fidelity para Perfect World',
    'Site oficial do servidor privado Fidelity para o MMORPG Perfect World, atualmente na Season 2. Oferece 4 modalidades de servidor (x1 a x100), Fidelity Academy com guias de classes e builds, e eventos regulares de Arena PvP 3v3.',
    'corporate',
    'https://fidelity-pw-website.vercel.app', 'https://github.com/oliveeiralucas/fidelity_pw_website',
    '/images/projects/fidelity-pw-website.png',
    '["Gaming","MMORPG","Perfect World"]'::json,
    '[{"name":"Next.js"},{"name":"React"},{"name":"Tailwind CSS"}]'::json,
    '[{"label":"Taxas de XP","value":"x1, x5, x30, x100"},{"label":"Redes Sociais","value":"6 canais"}]'::json,
    '["4 modalidades de servidor (Clássico x1, Baixa x5, Média x30, Alta x100)","Fidelity Academy com guias de classes e builds","Sistema de patch notes e notícias de Season","Eventos regulares de Arena 3v3 PvP","Presença em 6 plataformas sociais"]'::json,
    2024, false
  )

ON CONFLICT (slug) DO NOTHING;
