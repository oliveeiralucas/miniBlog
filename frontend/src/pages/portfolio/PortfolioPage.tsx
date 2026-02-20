import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BiLinkExternal, BiLogoGithub } from 'react-icons/bi'

import { projectsApi } from '@/api/apiClient'
import type { ApiProject } from '@/api/types'
import { useAuthValue } from '@/context/AuthContext'

const CATEGORIES = ['Todos', 'web-app', 'corporate', 'saas', 'analytics', 'other']

const SkeletonCard: React.FC = () => (
  <div className="card-ed overflow-hidden animate-pulse">
    <div className="aspect-video bg-ed-elevated" />
    <div className="p-5 space-y-3">
      <div className="flex justify-between">
        <div className="h-5 w-16 rounded-sm bg-ed-elevated" />
        <div className="h-4 w-8 rounded-sm bg-ed-elevated" />
      </div>
      <div className="h-6 w-4/5 rounded-sm bg-ed-elevated" />
      <div className="h-4 w-3/5 rounded-sm bg-ed-elevated" />
      <div className="flex gap-1">
        <div className="h-5 w-12 rounded-sm bg-ed-elevated" />
        <div className="h-5 w-16 rounded-sm bg-ed-elevated" />
        <div className="h-5 w-10 rounded-sm bg-ed-elevated" />
      </div>
    </div>
  </div>
)

const ProjectCard: React.FC<{ project: ApiProject }> = ({ project }) => (
  <Link to={`/portfolio/${project.slug}`} className="group block h-full">
    <article className="card-ed overflow-hidden h-full flex flex-col">
      <div className="overflow-hidden aspect-video bg-ed-elevated relative">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            ;(e.target as HTMLImageElement).src =
              'https://placehold.co/800x450/1c1917/272217?text=projeto'
          }}
        />
        {project.featured && (
          <span className="absolute top-3 left-3 bg-ed-accent text-ed-bg font-ui text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded-sm">
            Destaque
          </span>
        )}
      </div>

      <div className="flex flex-col flex-1 p-5 gap-3">
        <div className="flex items-center justify-between">
          <span className="tag-ed">{project.category}</span>
          <span className="font-ui text-xs text-ed-tm">{project.year}</span>
        </div>

        <h2 className="font-display text-xl text-ed-tp leading-snug group-hover:text-ed-accent transition-colors duration-200">
          {project.title}
        </h2>

        <p className="font-body text-sm text-ed-ts leading-relaxed line-clamp-2 flex-1">
          {project.tagline}
        </p>

        {project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {project.techStack.slice(0, 4).map((t) => (
              <span key={t.name} className="tag-ed text-[10px] py-0">
                {t.name}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3 pt-3 border-t border-ed-border mt-auto">
          <button
            type="button"
            className="flex items-center gap-1 font-ui text-xs text-ed-accent hover:opacity-80 transition-opacity"
            onClick={(e) => {
              e.preventDefault()
              window.open(project.url, '_blank', 'noreferrer')
            }}
          >
            <BiLinkExternal className="text-sm" /> Ver projeto
          </button>
          {project.githubUrl && (
            <button
              type="button"
              className="flex items-center gap-1 font-ui text-xs text-ed-ts hover:text-ed-tp transition-colors"
              onClick={(e) => {
                e.preventDefault()
                window.open(project.githubUrl!, '_blank', 'noreferrer')
              }}
            >
              <BiLogoGithub className="text-sm" /> GitHub
            </button>
          )}
        </div>
      </div>
    </article>
  </Link>
)

const PortfolioPage: React.FC = () => {
  const [projects, setProjects] = useState<ApiProject[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('Todos')
  const { user } = useAuthValue()

  useEffect(() => {
    projectsApi
      .getAll({ size: 100 })
      .then((data) => setProjects(data.items))
      .finally(() => setLoading(false))
  }, [])

  const availableCategories = ['Todos', ...Array.from(new Set(projects.map((p) => p.category)))]

  const filtered =
    activeCategory === 'Todos'
      ? projects
      : projects.filter((p) => p.category === activeCategory)

  return (
    <div className="bg-ed-bg">
      {/* Hero */}
      <section className="border-b border-ed-border relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=1920&h=600&fit=crop&auto=format"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-15"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ed-bg via-ed-bg/90 to-ed-bg/50" />
        <div className="page-wrapper py-20 md:py-28 relative">
          <div className="max-w-2xl animate-fade-up">
            <p className="section-label mb-5">Trabalhos selecionados</p>
            <div className="gold-line mb-8" />
            <h1 className="font-display text-5xl md:text-6xl text-ed-tp leading-[1.05] mb-6">
              Portfólio &{' '}
              <span className="block italic text-ed-accent">Projetos.</span>
            </h1>
            <p className="font-body text-base text-ed-ts leading-relaxed max-w-xl">
              Uma seleção de projetos que construí — de aplicações web completas
              a ferramentas de análise e sistemas corporativos.
            </p>
          </div>
        </div>
      </section>

      {/* Filter bar */}
      <section className="border-b border-ed-border sticky top-16 z-40 bg-ed-bg/95 backdrop-blur-sm">
        <div className="page-wrapper py-3 flex items-center gap-3 overflow-x-auto scrollbar-hide">
          {availableCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 font-ui text-xs tracking-widest uppercase px-4 py-2 rounded-sm border transition-all duration-200 ${
                activeCategory === cat
                  ? 'border-ed-accent text-ed-accent bg-ed-elevated'
                  : 'border-ed-border text-ed-ts hover:border-ed-accent hover:text-ed-accent'
              }`}
            >
              {cat}
            </button>
          ))}
          {user?.isAdmin && (
            <Link to="/admin/projects/new" className="btn-gold text-xs ml-auto shrink-0">
              + Novo projeto
            </Link>
          )}
        </div>
      </section>

      {/* Grid */}
      <section className="page-wrapper py-16">
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-24 border border-dashed border-ed-border rounded-sm">
            <p className="font-display text-2xl text-ed-ts mb-3">
              Nenhum projeto encontrado
            </p>
            {user?.isAdmin && (
              <Link to="/admin/projects/new" className="btn-ghost text-xs mt-4 inline-flex">
                + Adicionar projeto
              </Link>
            )}
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((project, i) => (
              <div
                key={project.id}
                className="animate-fade-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default PortfolioPage
