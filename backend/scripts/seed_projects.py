"""Seed script — populates the database with portfolio projects.

Usage (from backend/ directory):
    python scripts/seed_projects.py
"""

import asyncio
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.db.engine import close_engine, get_session_factory  # noqa: E402
from app.db.models import Project  # noqa: E402
from sqlalchemy import select  # noqa: E402

# Unsplash URL helper
def _img(photo_id: str) -> str:
    return f"https://images.unsplash.com/{photo_id}?w=1280&h=720&fit=crop&auto=format"


PROJECTS = [
    # ── Projetos de Clientes / Freelance ─────────────────────────────────────

    {
        "slug": "admita-rh",
        "title": "Admita RH",
        "tagline": "Plataforma completa de gestão de RH",
        "description": (
            "Sistema robusto de gestão de recursos humanos com 38+ anos de mercado, "
            "servindo mais de 200 clientes empresariais. Solução completa para folha de "
            "pagamento, ponto eletrônico, recrutamento e gestão de benefícios."
        ),
        "category": "web-app",
        "url": "https://admitarh.com.br/",
        "githubUrl": None,
        "image": _img("photo-1522202176988-66273c2fd55f"),  # equipe trabalhando
        "tags": ["Gestão de RH", "Enterprise", "Folha de Pagamento"],
        "techStack": [
            {"name": "Next.js"}, {"name": "TypeScript"},
            {"name": "PostgreSQL"}, {"name": "Node.js"},
        ],
        "stats": [
            {"label": "Anos de Mercado", "value": "38+"},
            {"label": "Clientes Ativos", "value": "200+"},
            {"label": "Funcionários Gerenciados", "value": "10k+"},
        ],
        "features": [
            "Folha de pagamento automatizada",
            "Ponto eletrônico integrado",
            "Gestão de benefícios",
            "Recrutamento e seleção",
            "Relatórios avançados",
        ],
        "year": 2024,
        "featured": True,
    },
    {
        "slug": "afinte",
        "title": "Afinte",
        "tagline": "Soluções digitais que transformam negócios",
        "description": (
            "Site institucional da Afinte, empresa especializada em desenvolvimento de "
            "soluções digitais enterprise. Showcase de tecnologias modernas e cases de "
            "sucesso no mercado corporativo, com score de performance Lighthouse 98+."
        ),
        "category": "corporate",
        "url": "https://www.afinte.com/",
        "githubUrl": None,
        "image": _img("photo-1497366216548-37526070297c"),  # escritório moderno
        "tags": ["Institucional", "Corporate", "Showcase"],
        "techStack": [
            {"name": "Next.js"}, {"name": "TypeScript"},
            {"name": "Tailwind CSS"}, {"name": "Framer Motion"},
        ],
        "stats": [
            {"label": "Performance Score", "value": "98"},
            {"label": "Projetos Entregues", "value": "50+"},
            {"label": "Anos de Experiência", "value": "15+"},
        ],
        "features": [
            "Design moderno e responsivo",
            "Animações fluidas com Framer Motion",
            "SEO otimizado",
            "Performance de ponta (Lighthouse 98+)",
        ],
        "year": 2024,
        "featured": True,
    },
    {
        "slug": "confidere",
        "title": "Confidere",
        "tagline": "Plataforma de crédito online simplificada",
        "description": (
            "Plataforma digital para solicitação e gestão de crédito online. "
            "Interface intuitiva que simplifica processos complexos de análise de crédito "
            "e aprovação, com taxa de satisfação de 4.8/5 e aprovação em até 24 horas."
        ),
        "category": "saas",
        "url": "https://www.confiderecreditos.com.br/",
        "githubUrl": None,
        "image": _img("photo-1563986768609-322da13575f3"),  # fintech / dados
        "tags": ["Fintech", "Crédito", "SaaS"],
        "techStack": [
            {"name": "React"}, {"name": "Node.js"},
            {"name": "MongoDB"}, {"name": "AWS"},
        ],
        "stats": [
            {"label": "Taxa de Aprovação", "value": "85%"},
            {"label": "Tempo Médio", "value": "24h"},
            {"label": "Satisfação", "value": "4.8/5"},
        ],
        "features": [
            "Análise de crédito automatizada",
            "Processo 100% digital",
            "Aprovação em até 24h",
            "Dashboard de acompanhamento",
        ],
        "year": 2023,
        "featured": True,
    },
    {
        "slug": "insightloop",
        "title": "InsightLoop",
        "tagline": "Analytics de Instagram com IA",
        "description": (
            "Ferramenta SaaS de analytics para Instagram com insights gerados por "
            "inteligência artificial. Análise profunda de métricas, crescimento de "
            "audiência e otimização de conteúdo por apenas R$47/mês."
        ),
        "category": "analytics",
        "url": "https://insightloop.ialumia.com/",
        "githubUrl": None,
        "image": _img("photo-1551288049-bebda4e38f71"),  # analytics dashboard
        "tags": ["Analytics", "IA", "Social Media"],
        "techStack": [
            {"name": "Next.js"}, {"name": "OpenAI"},
            {"name": "PostgreSQL"}, {"name": "Vercel"},
        ],
        "stats": [
            {"label": "Usuários Ativos", "value": "500+"},
            {"label": "Preço Mensal", "value": "R$47"},
            {"label": "Insights Gerados", "value": "10k+"},
        ],
        "features": [
            "Análise de métricas com IA",
            "Sugestões de conteúdo",
            "Identificação de melhores horários",
            "Análise de concorrentes",
            "Relatórios automatizados",
        ],
        "year": 2024,
        "featured": True,
    },
    {
        "slug": "grupo-egx",
        "title": "Grupo EGX",
        "tagline": "Consultoria de growth e marketing de performance",
        "description": (
            "Site institucional para consultoria especializada em estratégias de growth "
            "e marketing de performance. Foco em resultados mensuráveis e crescimento "
            "acelerado, com CMS headless para gestão autônoma de conteúdo."
        ),
        "category": "corporate",
        "url": "https://ogrupoegx.com/",
        "githubUrl": None,
        "image": _img("photo-1460925895917-afdab827c52f"),  # marketing / laptop
        "tags": ["Consultoria", "Marketing", "Growth"],
        "techStack": [
            {"name": "Next.js"}, {"name": "TypeScript"},
            {"name": "Tailwind CSS"}, {"name": "Sanity CMS"},
        ],
        "stats": [
            {"label": "Clientes Atendidos", "value": "100+"},
            {"label": "ROI Médio", "value": "3.5x"},
            {"label": "Projetos Ativos", "value": "30+"},
        ],
        "features": [
            "CMS headless para gestão de conteúdo",
            "Blog otimizado para SEO",
            "Formulários de contato",
            "Integração com CRM",
        ],
        "year": 2023,
        "featured": False,
    },
    {
        "slug": "versatil",
        "title": "Versátil",
        "tagline": "Assessoria contábil de confiança",
        "description": (
            "Site moderno para escritório de contabilidade com mais de 30 anos de "
            "experiência. Apresentação de serviços, equipe e diferenciais competitivos "
            "para o mercado B2B, com satisfação de 4.9/5 entre os clientes."
        ),
        "category": "corporate",
        "url": "https://versatil-lyart.vercel.app/",
        "githubUrl": None,
        "image": _img("photo-1454165804606-c3d57bc86b40"),  # documentos / negócios
        "tags": ["Contabilidade", "Serviços", "B2B"],
        "techStack": [
            {"name": "Next.js"}, {"name": "TypeScript"}, {"name": "Tailwind CSS"},
        ],
        "stats": [
            {"label": "Anos de Experiência", "value": "30+"},
            {"label": "Empresas Atendidas", "value": "150+"},
            {"label": "Satisfação", "value": "4.9/5"},
        ],
        "features": [
            "Apresentação de serviços",
            "Portal do cliente",
            "Formulário de orçamento",
            "Blog informativo",
        ],
        "year": 2023,
        "featured": False,
    },
    {
        "slug": "barbara-alves",
        "title": "Barbara Alves",
        "tagline": "Advocacia corporativa e trabalhista",
        "description": (
            "Site profissional para escritório de advocacia especializado em direito "
            "corporativo e trabalhista. Design elegante que transmite confiança e "
            "expertise jurídica, com taxa de vitória de 92% nos casos atendidos."
        ),
        "category": "corporate",
        "url": "https://barbaraalvesadvocacia.com.br",
        "githubUrl": None,
        "image": _img("photo-1575505586569-646b2ca898fc"),  # direito / justiça
        "tags": ["Advocacia", "Jurídico", "Corporativo"],
        "techStack": [
            {"name": "Next.js"}, {"name": "TypeScript"}, {"name": "Tailwind CSS"},
        ],
        "stats": [
            {"label": "Anos de Atuação", "value": "10+"},
            {"label": "Casos de Sucesso", "value": "500+"},
            {"label": "Taxa de Vitória", "value": "92%"},
        ],
        "features": [
            "Áreas de atuação detalhadas",
            "Formulário de consulta",
            "Blog jurídico",
            "Agendamento online",
        ],
        "year": 2024,
        "featured": False,
    },

    # ── Projetos Pessoais ────────────────────────────────────────────────────

    {
        "slug": "mini-blog",
        "title": "devlog.",
        "tagline": "Blog pessoal com backend próprio em FastAPI e autenticação JWT",
        "description": (
            "Blog pessoal de desenvolvimento construído do zero. O backend, "
            "originalmente em Firebase, foi migrado completamente para FastAPI + "
            "PostgreSQL com autenticação JWT stateless, rotação de refresh token "
            "e rate limiting por IP. Frontend em React com TypeScript e Vite."
        ),
        "category": "web-app",
        "url": "https://mini-blog-cyan-pi.vercel.app",
        "githubUrl": "https://github.com/oliveeiralucas/miniBlog",
        "image": _img("photo-1461749280684-dccba630e2f6"),  # código no laptop (laranja)
        "tags": ["Blog", "Open Source", "Full Stack"],
        "techStack": [
            {"name": "React"}, {"name": "TypeScript"}, {"name": "FastAPI"},
            {"name": "PostgreSQL"}, {"name": "Docker"}, {"name": "Alembic"},
        ],
        "stats": [],
        "features": [
            "Autenticação JWT com rotação de refresh token",
            "CRUD de posts com sistema de likes e comentários",
            "Rate limiting por IP via slowapi",
            "Sistema de tags para categorização",
            "Busca de artigos por texto e tag",
        ],
        "year": 2025,
        "featured": True,
    },
    {
        "slug": "projeto-exactus",
        "title": "Exactus Schedule",
        "tagline": "Sistema de agendamento e gerenciamento de reuniões corporativas",
        "description": (
            "Plataforma web para gerenciar reuniões com eficiência, voltada para "
            "usuários corporativos. Possui interface de login split-screen e suporte "
            "completo a desktop e mobile, construída sobre Next.js com React Server "
            "Components."
        ),
        "category": "saas",
        "url": "https://projeto-exactus.vercel.app",
        "githubUrl": "https://github.com/oliveeiralucas/ProjetoExactus",
        "image": _img("photo-1552664730-d307ca884978"),  # reunião corporativa
        "tags": ["Agendamento", "Corporativo", "SaaS"],
        "techStack": [
            {"name": "Next.js"}, {"name": "React"},
            {"name": "TypeScript"}, {"name": "Tailwind CSS"},
        ],
        "stats": [],
        "features": [
            "Autenticação com email e senha",
            "Criação e gerenciamento de reuniões",
            "Interface responsiva para desktop e mobile",
            "Design split-screen moderno",
            "Localização em português do Brasil",
        ],
        "year": 2024,
        "featured": False,
    },
    {
        "slug": "license-server",
        "title": "License Server",
        "tagline": "Servidor de licenciamento e validação de software",
        "description": (
            "Sistema de controle e validação de licenças de software. Plataforma "
            "para gerenciamento centralizado de licenças com validação automática "
            "e controle de ativações por dispositivo."
        ),
        "category": "tool",
        "url": "https://license-server-rouge-one.vercel.app",
        "githubUrl": "https://github.com/oliveeiralucas/license-server",
        "image": _img("photo-1558494949-ef010cbdcc31"),  # servidor / data center
        "tags": ["Licenciamento", "Ferramenta", "Backend"],
        "techStack": [],
        "stats": [],
        "features": [
            "Gerenciamento centralizado de licenças",
            "Validação automática por chave",
            "Controle de ativações por dispositivo",
        ],
        "year": 2024,
        "featured": False,
    },
    {
        "slug": "tailwind-library",
        "title": "Tailwind Library",
        "tagline": "Renderizador interativo de componentes Tailwind UI",
        "description": (
            "Ferramenta de visualização de componentes Tailwind UI+, permitindo ao "
            "desenvolvedor selecionar dinamicamente blocos, grupos e componentes para "
            "renderizá-los em tempo real. Funciona como um navegador/preview de "
            "biblioteca de componentes com suporte a caminho manual."
        ),
        "category": "tool",
        "url": "https://tailwind-library.vercel.app",
        "githubUrl": "https://github.com/oliveeiralucas/tailwind-library",
        "image": _img("photo-1507003211169-0a1dd7228f2d"),  # design / laptop workspace
        "tags": ["Tailwind CSS", "Componentes", "Ferramenta"],
        "techStack": [
            {"name": "Vite"}, {"name": "React"},
            {"name": "TypeScript"}, {"name": "Tailwind CSS"},
        ],
        "stats": [],
        "features": [
            "Seletor hierárquico (Block > Grupo > Componente > Arquivo)",
            "Renderização dinâmica em tempo real",
            "Campo de caminho manual para acesso direto",
            "Preview integrado de layouts",
        ],
        "year": 2024,
        "featured": False,
    },
    {
        "slug": "extensao-horta-solidaria",
        "title": "Horta Solidária",
        "tagline": "Plataforma de extensão universitária para hortas comunitárias",
        "description": (
            "Aplicação web de suporte a projeto de extensão universitária voltado para "
            "hortas comunitárias solidárias. Desenvolvida com Next.js e Tailwind CSS, "
            "com foco em gestão e acompanhamento de iniciativas de agricultura urbana "
            "comunitária."
        ),
        "category": "web-app",
        "url": "https://extensao-horta-solidaria-one.vercel.app",
        "githubUrl": "https://github.com/oliveeiralucas/extensao-horta-solidaria",
        "image": _img("photo-1416879595882-3373a0480b5b"),  # jardim / plantas
        "tags": ["Extensão Universitária", "Comunidade", "Agricultura"],
        "techStack": [
            {"name": "Next.js"}, {"name": "TypeScript"}, {"name": "Tailwind CSS"},
        ],
        "stats": [],
        "features": [
            "Sistema de autenticação de usuários",
            "Identidade visual temática (green scheme)",
            "Design responsivo",
            "Gestão de iniciativas comunitárias",
        ],
        "year": 2024,
        "featured": False,
    },
    {
        "slug": "mentalidade-imersiva",
        "title": "Mentalidade Imersiva",
        "tagline": "Landing page de alta conversão para eBook de desenvolvimento pessoal",
        "description": (
            "Landing page de alta conversão para um eBook gratuito de desenvolvimento "
            "pessoal com foco em reprogramação mental e liberdade emocional. Conteúdo "
            "estruturado em 6 capítulos com design dark e call-to-action de urgência "
            "para download do PDF."
        ),
        "category": "corporate",
        "url": "https://mentalidade-imersiva.vercel.app",
        "githubUrl": "https://github.com/oliveeiralucas/mentalidadeImersiva",
        "image": _img("photo-1481627834876-b7833e8f5570"),  # livros / biblioteca
        "tags": ["Landing Page", "eBook", "Marketing"],
        "techStack": [
            {"name": "Next.js"}, {"name": "React"}, {"name": "Tailwind CSS"},
        ],
        "stats": [
            {"label": "Capítulos", "value": "6"},
        ],
        "features": [
            "Download gratuito de eBook em PDF",
            "Conteúdo estruturado em 6 capítulos",
            "Seção de FAQ completa",
            "Design dark com paleta de alta conversão",
            "Call-to-action com urgência e escassez",
        ],
        "year": 2024,
        "featured": False,
    },
    {
        "slug": "dia-na",
        "title": "DIAna",
        "tagline": "Sistema de transcrição e geração automática de atas via IA",
        "description": (
            "DIAna (Documentação Inteligente de Áudios) automatiza a documentação de "
            "reuniões corporativas. Colaboradores fazem upload de áudio (até 50MB) e "
            "recebem atas estruturadas via N8N + IA, com dashboard de métricas, "
            "workflow de aprovação e autenticação JWT restrita a domínio corporativo."
        ),
        "category": "saas",
        "url": "https://dia-na.vercel.app",
        "githubUrl": "https://github.com/oliveeiralucas/DIAna",
        "image": _img("photo-1620712943543-bcc4688e7485"),  # IA / tecnologia
        "tags": ["IA", "Automação", "Produtividade"],
        "techStack": [
            {"name": "Next.js"}, {"name": "React 19"}, {"name": "TypeScript"},
            {"name": "Tailwind CSS"}, {"name": "Prisma"}, {"name": "PostgreSQL"},
            {"name": "N8N"}, {"name": "JWT"},
        ],
        "stats": [
            {"label": "Tamanho máx. de áudio", "value": "50MB"},
            {"label": "Formatos suportados", "value": "MP3, WAV, M4A"},
        ],
        "features": [
            "Upload de áudio com barra de progresso em tempo real",
            "Transcrição e geração de atas via N8N + IA",
            "Workflow de aprovação com status dinâmico (Pendente/Aprovada/Rejeitada)",
            "Dashboard interativo com métricas e gráficos (Recharts)",
            "Autenticação JWT com restrição de domínio corporativo",
        ],
        "year": 2025,
        "featured": True,
    },
    {
        "slug": "madhub-space",
        "title": "MadHub",
        "tagline": "Assistente pessoal inteligente com autenticação passwordless",
        "description": (
            "MadHub é um sistema de assistente pessoal denominado J.A.R.V.I.S, com "
            "autenticação passwordless via código enviado ao email do usuário. "
            "Interface dark mode com gradiente, grid pattern e componentes com "
            "backdrop blur."
        ),
        "category": "web-app",
        "url": "https://madhub-space.vercel.app",
        "githubUrl": "https://github.com/oliveeiralucas/madhub.space",
        "image": _img("photo-1526374965328-7f61d4dc18c5"),  # matrix / código verde
        "tags": ["Assistente", "Passwordless", "Dark Mode"],
        "techStack": [
            {"name": "Next.js"}, {"name": "React"},
            {"name": "TypeScript"}, {"name": "Tailwind CSS"},
        ],
        "stats": [],
        "features": [
            "Autenticação passwordless via código por email",
            "Interface dark mode futurística (inspirada em J.A.R.V.I.S)",
            "Layout responsivo com backdrop blur e gradientes",
            "Sistema de cards interativos",
        ],
        "year": 2025,
        "featured": False,
    },
    {
        "slug": "personal-diet",
        "title": "Personal Diet",
        "tagline": "Hub centralizado de bem-estar e performance para triatleta",
        "description": (
            "Hub de performance e bem-estar pessoal para um triatleta, centralizando "
            "múltiplas aplicações: planejador nutricional com dieta mediterrânea "
            "personalizada, plano de bronzeamento de 15 dias e plano de treino "
            "Push/Pull/Legs. Arquitetura modular com 3 mini-apps adicionais em "
            "desenvolvimento."
        ),
        "category": "web-app",
        "url": "https://personal-diet.vercel.app",
        "githubUrl": "https://github.com/oliveeiralucas/personal-diet",
        "image": _img("photo-1571019613454-1cb2f99b2d8b"),  # corrida / triathlon
        "tags": ["Saúde", "Triathlon", "Nutrição"],
        "techStack": [
            {"name": "Next.js"}, {"name": "React"}, {"name": "Tailwind CSS"},
        ],
        "stats": [
            {"label": "Apps ativos", "value": "3"},
            {"label": "Em desenvolvimento", "value": "3"},
        ],
        "features": [
            "Planejador nutricional com dieta mediterrânea para triathlon",
            "Plano de bronzeamento de 15 dias",
            "Plano de treino Push/Pull/Legs (Seg/Qua/Sex)",
            "Cards com indicador de status em tempo real",
            "Arquitetura modular expansível",
        ],
        "year": 2025,
        "featured": False,
    },
    {
        "slug": "vanilla-games",
        "title": "Vanilla Games",
        "tagline": "Plataforma brasileira de servidores privados de MMORPGs",
        "description": (
            "Plataforma de lançamento de servidores privados de MMORPGs para o mercado "
            "brasileiro, com foco em fair-play e anti-pay-to-win. O primeiro servidor é "
            "Perfect World, com balanceamento contínuo, baixa latência e eventos "
            "comunitários integrados ao Discord."
        ),
        "category": "corporate",
        "url": "https://vanilla-games-two.vercel.app",
        "githubUrl": "https://github.com/oliveeiralucas/vanilla-games",
        "image": _img("photo-1542751371-adc38448a05e"),  # setup gamer RGB
        "tags": ["Gaming", "MMORPG", "Comunidade"],
        "techStack": [
            {"name": "Next.js"}, {"name": "React"}, {"name": "TypeScript"},
        ],
        "stats": [
            {"label": "Jogos previstos", "value": "4+"},
        ],
        "features": [
            "Servidor privado de Perfect World (Season 1)",
            "Modelo sem pay-to-win com balanceamento contínuo",
            "Integração com Discord para eventos e suporte",
            "Infraestrutura de baixa latência",
            "Roadmap com Ragnarok, Mu Online e GTA RP",
        ],
        "year": 2024,
        "featured": False,
    },
    {
        "slug": "fidelity-pw-website",
        "title": "Fidelity PW",
        "tagline": "Site oficial do servidor privado Fidelity para Perfect World",
        "description": (
            "Site oficial do servidor privado Fidelity para o MMORPG Perfect World, "
            "atualmente na Season 2. Oferece 4 modalidades de servidor (x1 a x100), "
            "Fidelity Academy com guias de classes e builds, e eventos regulares de "
            "Arena PvP 3v3."
        ),
        "category": "corporate",
        "url": "https://fidelity-pw-website.vercel.app",
        "githubUrl": "https://github.com/oliveeiralucas/fidelity_pw_website",
        "image": _img("photo-1511512578047-dfb367046420"),  # gaming / computador
        "tags": ["Gaming", "MMORPG", "Perfect World"],
        "techStack": [
            {"name": "Next.js"}, {"name": "React"}, {"name": "Tailwind CSS"},
        ],
        "stats": [
            {"label": "Taxas de XP", "value": "x1, x5, x30, x100"},
            {"label": "Redes Sociais", "value": "6 canais"},
        ],
        "features": [
            "4 modalidades de servidor (Clássico x1, Baixa x5, Média x30, Alta x100)",
            "Fidelity Academy com guias de classes e builds",
            "Sistema de patch notes e notícias de Season",
            "Eventos regulares de Arena 3v3 PvP",
            "Presença em 6 plataformas sociais",
        ],
        "year": 2024,
        "featured": False,
    },
]


async def seed() -> None:
    factory = get_session_factory()

    async with factory() as session:
        print("Seeding projects...")
        created = 0
        skipped = 0

        for proj_data in PROJECTS:
            result = await session.execute(
                select(Project).where(Project.slug == proj_data["slug"])
            )
            if result.scalar_one_or_none():
                print(f"  Skipped (already exists): {proj_data['slug']}")
                skipped += 1
                continue

            project = Project(**proj_data)
            session.add(project)
            print(f"  Created: {proj_data['title']}")
            created += 1

        await session.commit()

    await close_engine()
    print(f"\nSeed complete. {created} created, {skipped} skipped.")


if __name__ == "__main__":
    asyncio.run(seed())
