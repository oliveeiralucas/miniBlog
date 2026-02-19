import React from 'react'
import { NavLink } from 'react-router-dom'

const sections = [
  {
    title: '1. Aceitação dos Termos',
    body: 'Ao acessar e utilizar este blog, você concorda com os presentes Termos de Uso. Caso não concorde com alguma das condições aqui estabelecidas, recomendamos que não utilize o site.',
  },
  {
    title: '2. Conteúdo do Blog',
    body: 'Todo o conteúdo publicado neste blog — incluindo textos, imagens e exemplos de código — é de responsabilidade do autor e tem fins exclusivamente informativos e educacionais.',
  },
  {
    title: '3. Propriedade Intelectual',
    body: 'Os textos, o código e os recursos visuais originais deste blog são protegidos por direitos autorais. A reprodução total ou parcial do conteúdo sem autorização expressa do autor é proibida.',
  },
  {
    title: '4. Responsabilidade',
    body: 'O autor não se responsabiliza por eventuais erros, desatualizações ou danos decorrentes do uso das informações disponibilizadas no blog. O conteúdo é fornecido "como está", sem garantias de qualquer natureza.',
  },
  {
    title: '5. Links Externos',
    body: 'Este blog pode conter links para sites externos. O autor não tem controle sobre esses sites e não se responsabiliza por seu conteúdo, políticas de privacidade ou práticas.',
  },
  {
    title: '6. Alterações nos Termos',
    body: 'Estes termos podem ser atualizados periodicamente sem aviso prévio. A versão mais recente estará sempre disponível nesta página.',
  },
]

const TermsPage: React.FC = () => {
  return (
    <div className="bg-ed-bg">
      {/* Header */}
      <section className="border-b border-ed-border">
        <div className="page-wrapper py-10 md:py-16">
          <p className="section-label mb-2 animate-fade-up">Jurídico</p>
          <div className="gold-line mb-4 animate-fade-up delay-1" />
          <h1 className="font-display text-3xl md:text-5xl text-ed-tp leading-tight animate-fade-up delay-2">
            Termos de Uso
          </h1>
          <p className="font-body text-sm text-ed-ts mt-3 animate-fade-up delay-3">
            Última atualização: fevereiro de 2026.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="page-wrapper py-12 md:py-16">
        <div className="max-w-3xl">
          <div className="space-y-0 divide-y divide-ed-border border border-ed-border rounded-sm overflow-hidden animate-fade-up delay-2">
            {sections.map(({ title, body }, i) => (
              <div
                key={title}
                className="px-6 py-6 md:px-8 animate-fade-up"
                style={{ animationDelay: `${(i + 2) * 80}ms` }}
              >
                <h2 className="font-display text-lg text-ed-tp mb-3">
                  {title}
                </h2>
                <p className="font-body text-sm text-ed-ts leading-relaxed">
                  {body}
                </p>
              </div>
            ))}

            {/* Contact section with NavLink */}
            <div className="px-6 py-6 md:px-8 animate-fade-up" style={{ animationDelay: '640ms' }}>
              <h2 className="font-display text-lg text-ed-tp mb-3">
                7. Contato
              </h2>
              <p className="font-body text-sm text-ed-ts leading-relaxed">
                Para dúvidas sobre estes termos, entre em contato através da nossa{' '}
                <NavLink
                  to="/contact"
                  className="text-ed-accent hover:text-ed-ah underline underline-offset-2 transition-colors duration-200"
                >
                  página de contato
                </NavLink>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default TermsPage
