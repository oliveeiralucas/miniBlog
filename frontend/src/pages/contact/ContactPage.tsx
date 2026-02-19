import React from 'react'
import { BiEnvelope, BiLogoGithub, BiLogoInstagram, BiLinkExternal } from 'react-icons/bi'

const contacts = [
  {
    icon: BiEnvelope,
    label: 'Email',
    value: 'oliveeiralucas@gmail.com',
    href: 'mailto:oliveeiralucas@gmail.com',
    description: 'Respondo em até 48 horas.',
  },
  {
    icon: BiLogoGithub,
    label: 'GitHub',
    value: 'github.com/oliveeiralucas',
    href: 'https://github.com/oliveeiralucas',
    description: 'Projetos, contribuições e código aberto.',
  },
  {
    icon: BiLogoInstagram,
    label: 'Instagram',
    value: '@oliveeiralucas',
    href: 'https://instagram.com/oliveeiralucas',
    description: 'Atualizações e bastidores.',
  },
]

const ContactPage: React.FC = () => {
  return (
    <div className="bg-ed-bg">
      {/* Header */}
      <section className="border-b border-ed-border">
        <div className="page-wrapper py-10 md:py-16">
          <p className="section-label mb-2 animate-fade-up">Contato</p>
          <div className="gold-line mb-4 animate-fade-up delay-1" />
          <h1 className="font-display text-3xl md:text-5xl text-ed-tp leading-tight animate-fade-up delay-2">
            Vamos conversar
          </h1>
          <p className="font-body text-sm md:text-base text-ed-ts mt-3 max-w-lg animate-fade-up delay-3">
            Tem alguma dúvida, sugestão ou quer colaborar em algum projeto?
            Escolha o canal mais conveniente para você.
          </p>
        </div>
      </section>

      {/* Contact cards */}
      <section className="page-wrapper py-12 md:py-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl">
          {contacts.map(({ icon: Icon, label, value, href, description }, i) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noreferrer' : undefined}
              className="group card-ed card-gold-top p-6 flex flex-col gap-4 hover:border-ed-accent/40 transition-colors duration-300 animate-fade-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex items-start justify-between">
                <div className="p-2.5 rounded-sm bg-ed-ad border border-ed-accent/20">
                  <Icon className="text-ed-accent text-xl" />
                </div>
                <BiLinkExternal className="text-ed-tm group-hover:text-ed-accent transition-colors duration-200 text-sm mt-1" />
              </div>

              <div>
                <p className="section-label mb-1">{label}</p>
                <p className="font-ui text-sm text-ed-tp font-medium truncate">
                  {value}
                </p>
                <p className="font-body text-xs text-ed-ts mt-1.5">
                  {description}
                </p>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  )
}

export default ContactPage
