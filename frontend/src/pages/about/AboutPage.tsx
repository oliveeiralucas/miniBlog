import React from 'react'
import {
  BiCodeAlt,
  BiLogoGithub,
  BiLogoInstagram,
  BiChevronDown
} from 'react-icons/bi'

const stats = [
  { value: '15+', label: 'Projetos concluídos', sub: 'Confira no portfólio' },
  { value: '850+', label: 'Horas de código', sub: 'Desde o início da jornada' },
  { value: '4', label: 'Posts publicados', sub: 'E crescendo' }
]

const AboutPage: React.FC = () => {
  return (
    <div className="bg-ed-bg">
      {/* Hero */}
      <section className="relative flex min-h-[85vh] items-center overflow-hidden border-b border-ed-border">
        {/* Background image */}
        <img
          src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1920&h=1080&fit=crop&auto=format"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ed-bg via-ed-bg/90 to-ed-bg/50" />
        <div className="page-wrapper relative py-20">
          <div className="max-w-3xl animate-fade-up">
            <p className="section-label mb-5">Sobre o autor</p>
            <div className="gold-line mb-8" />
            <h1 className="mb-6 font-display text-5xl leading-[1.05] text-ed-tp md:text-7xl">
              Lucas
              <span className="block italic text-ed-accent">Oliveira.</span>
            </h1>
            <p className="mb-4 font-ui text-base tracking-wide text-ed-ts md:text-lg">
              Engenheiro de Software · Desenvolvedor Web
            </p>
            <p className="max-w-xl font-body text-base leading-relaxed text-ed-ts">
              Estudante de Engenharia de Software, apaixonado por criar soluções
              digitais elegantes e compartilhar o que aprendo ao longo do
              caminho.
            </p>
          </div>
        </div>

        {/* Scroll cue */}
        <a
          href="#sobre"
          className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-ed-tm transition-colors duration-200 hover:text-ed-accent"
        >
          <span className="section-label">Rolar</span>
          <BiChevronDown className="animate-bounce text-lg" />
        </a>
      </section>

      {/* About section */}
      <section id="sobre" className="border-b border-ed-border">
        <div className="page-wrapper py-20">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            {/* Photo */}
            <div className="order-2 animate-fade-up lg:order-1">
              <div className="relative">
                <div className="absolute -inset-3 rounded-sm border border-ed-accent/20" />
                <img
                  src="https://avatars.githubusercontent.com/u/124714081?v=4"
                  alt="Lucas Oliveira"
                  className="relative mx-auto w-full max-w-sm rounded-sm grayscale transition-all duration-500 hover:grayscale-0"
                />
              </div>
            </div>

            {/* Text */}
            <div
              className="order-1 animate-fade-up lg:order-2"
              style={{ animationDelay: '150ms' }}
            >
              <p className="section-label mb-4">01 — Sobre Mim</p>
              <div className="gold-line mb-6" />
              <h2 className="mb-6 font-display text-3xl leading-snug text-ed-tp md:text-4xl">
                Olá, prazer em{' '}
                <span className="italic text-ed-accent">conhecê-lo.</span>
              </h2>
              <div className="space-y-4 font-body leading-relaxed text-ed-ts">
                <p>
                  Sou o Lucas Oliveira, estudante de Engenharia de Software e
                  desenvolvedor web em formação. Este blog é meu espaço para
                  documentar aprendizados, compartilhar experiências e refletir
                  sobre o universo da tecnologia.
                </p>
                <p>
                  Acredito que escrever é uma forma poderosa de consolidar
                  conhecimento — e quem sabe, ajudar alguém que está no mesmo
                  caminho.
                </p>
              </div>
              <div className="mt-8 flex items-center gap-4">
                <a
                  href="https://github.com/oliveeiralucas"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-ghost text-xs"
                >
                  <BiLogoGithub className="text-base" />
                  GitHub
                </a>
                <a
                  href="https://instagram.com/oliveeiralucas"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-ghost text-xs"
                >
                  <BiLogoInstagram className="text-base" />
                  Instagram
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-ed-border">
        <div className="page-wrapper py-16">
          <div className="grid grid-cols-1 gap-px bg-ed-border md:grid-cols-3">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="animate-fade-up bg-ed-bg p-10"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="mb-3 font-display text-5xl text-ed-accent">
                  {stat.value}
                </div>
                <div className="mb-1 font-ui text-sm font-semibold text-ed-tp">
                  {stat.label}
                </div>
                <div className="font-body text-xs text-ed-tm">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey */}
      <section className="border-b border-ed-border">
        <div className="page-wrapper py-20">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div className="animate-fade-up">
              <p className="section-label mb-4">02 — Jornada</p>
              <div className="gold-line mb-6" />
              <h2 className="mb-6 font-display text-3xl leading-snug text-ed-tp md:text-4xl">
                Do zero ao{' '}
                <span className="italic text-ed-accent">desenvolvimento.</span>
              </h2>
              <div className="space-y-4 font-body leading-relaxed text-ed-ts">
                <p>
                  Tudo começou com curiosidade genuína sobre como computadores e
                  a internet funcionam. Essa faísca se transformou em dedicação:
                  estudos constantes, projetos práticos e muitas horas de
                  código.
                </p>
                <p>
                  Hoje, mergulhado em Engenharia de Software, continuo
                  aprimorando habilidades para criar soluções cada vez mais
                  robustas e elegantes.
                </p>
              </div>
            </div>

            <div
              className="animate-fade-up"
              style={{ animationDelay: '150ms' }}
            >
              <img
                src="https://blog.gokursos.com/wp-content/uploads/2024/10/professional-programmer-is-working-indoors-neon-l-2023-11-27-05-36-33-utc-1-1202x800.jpg"
                alt="Inteligência Artificial"
                className="w-full rounded-sm border border-ed-border"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What to expect */}
      <section>
        <div className="page-wrapper py-20 text-center">
          <div className="mx-auto max-w-2xl animate-fade-up">
            <BiCodeAlt className="mx-auto mb-6 text-4xl text-ed-accent" />
            <p className="section-label mb-4">03 — O que esperar</p>
            <div className="gold-line mx-auto mb-8" />
            <h2 className="mb-6 font-display text-3xl text-ed-tp md:text-4xl">
              Conteúdo pensado para{' '}
              <span className="italic text-ed-accent">desenvolvedores.</span>
            </h2>
            <p className="font-body text-base leading-relaxed text-ed-ts">
              Programação, desenvolvimento web, dicas práticas, tutoriais e
              reflexões honestas sobre a indústria de tecnologia. O objetivo é
              simples: conteúdo útil, direto e inspirador.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage
