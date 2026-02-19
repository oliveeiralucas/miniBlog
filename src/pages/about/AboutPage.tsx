import React from 'react'
import {
  BiCodeAlt,
  BiLogoGithub,
  BiLogoInstagram,
  BiChevronDown,
} from 'react-icons/bi'

const stats = [
  { value: '15+', label: 'Projetos concluídos', sub: 'Confira no portfólio' },
  { value: '850+', label: 'Horas de código', sub: 'Desde o início da jornada' },
  { value: '4', label: 'Posts publicados', sub: 'E crescendo' },
]

const AboutPage: React.FC = () => {
  return (
    <div className="bg-ed-bg">
      {/* Hero */}
      <section className="border-b border-ed-border min-h-[85vh] flex items-center relative">
        <div className="page-wrapper py-20">
          <div className="max-w-3xl animate-fade-up">
            <p className="section-label mb-5">Sobre o autor</p>
            <div className="gold-line mb-8" />
            <h1 className="font-display text-5xl md:text-7xl text-ed-tp leading-[1.05] mb-6">
              Lucas
              <span className="block italic text-ed-accent">Oliveira.</span>
            </h1>
            <p className="font-ui text-base md:text-lg text-ed-ts tracking-wide mb-4">
              Engenheiro de Software · Desenvolvedor Web
            </p>
            <p className="font-body text-base text-ed-ts leading-relaxed max-w-xl">
              Estudante de Engenharia de Software, apaixonado por criar
              soluções digitais elegantes e compartilhar o que aprendo ao
              longo do caminho.
            </p>
          </div>
        </div>

        {/* Scroll cue */}
        <a
          href="#sobre"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-ed-tm hover:text-ed-accent transition-colors duration-200"
        >
          <span className="section-label">Rolar</span>
          <BiChevronDown className="text-lg animate-bounce" />
        </a>
      </section>

      {/* About section */}
      <section id="sobre" className="border-b border-ed-border">
        <div className="page-wrapper py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Photo */}
            <div className="animate-fade-up order-2 lg:order-1">
              <div className="relative">
                <div className="absolute -inset-3 border border-ed-accent/20 rounded-sm" />
                <img
                  src="https://avatars.githubusercontent.com/u/124714081?v=4"
                  alt="Lucas Oliveira"
                  className="relative w-full max-w-sm mx-auto rounded-sm grayscale hover:grayscale-0 transition-all duration-500"
                />
              </div>
            </div>

            {/* Text */}
            <div className="animate-fade-up order-1 lg:order-2" style={{ animationDelay: '150ms' }}>
              <p className="section-label mb-4">01 — Sobre Mim</p>
              <div className="gold-line mb-6" />
              <h2 className="font-display text-3xl md:text-4xl text-ed-tp mb-6 leading-snug">
                Olá, prazer em{' '}
                <span className="italic text-ed-accent">conhecê-lo.</span>
              </h2>
              <div className="space-y-4 font-body text-ed-ts leading-relaxed">
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
              <div className="flex items-center gap-4 mt-8">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-ed-border">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="bg-ed-bg p-10 animate-fade-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="font-display text-5xl text-ed-accent mb-3">
                  {stat.value}
                </div>
                <div className="font-ui text-sm font-semibold text-ed-tp mb-1">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-up">
              <p className="section-label mb-4">02 — Jornada</p>
              <div className="gold-line mb-6" />
              <h2 className="font-display text-3xl md:text-4xl text-ed-tp mb-6 leading-snug">
                Do zero ao{' '}
                <span className="italic text-ed-accent">desenvolvimento.</span>
              </h2>
              <div className="space-y-4 font-body text-ed-ts leading-relaxed">
                <p>
                  Tudo começou com curiosidade genuína sobre como computadores
                  e a internet funcionam. Essa faísca se transformou em
                  dedicação: estudos constantes, projetos práticos e muitas
                  horas de código.
                </p>
                <p>
                  Hoje, mergulhado em Engenharia de Software, continuo
                  aprimorando habilidades para criar soluções cada vez mais
                  robustas e elegantes.
                </p>
              </div>
            </div>

            <div className="animate-fade-up" style={{ animationDelay: '150ms' }}>
              <img
                src="https://blog.unifil.br/wp-content/uploads/Alunos-no-lancamento-do-hackathon-1.jpeg"
                alt="Hackathon"
                className="w-full rounded-sm border border-ed-border"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What to expect */}
      <section>
        <div className="page-wrapper py-20 text-center">
          <div className="max-w-2xl mx-auto animate-fade-up">
            <BiCodeAlt className="text-4xl text-ed-accent mx-auto mb-6" />
            <p className="section-label mb-4">03 — O que esperar</p>
            <div className="gold-line mx-auto mb-8" />
            <h2 className="font-display text-3xl md:text-4xl text-ed-tp mb-6">
              Conteúdo pensado para{' '}
              <span className="italic text-ed-accent">desenvolvedores.</span>
            </h2>
            <p className="font-body text-base text-ed-ts leading-relaxed">
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
