import React from 'react'
import { Link } from 'react-router-dom'
import { BiPencil } from 'react-icons/bi'

import PostDetail from '@/components/PostDetail'
import { useFetchDocuments } from '@/hooks/useFetchDocuments'
import { useAuthValue } from '@/context/AuthContext'

const SkeletonCard: React.FC = () => (
  <div className="card-ed card-gold-top overflow-hidden">
    <div className="aspect-video bg-ed-elevated animate-pulse" />
    <div className="p-5 space-y-3">
      <div className="h-3 w-16 rounded bg-ed-elevated animate-pulse" />
      <div className="h-5 w-4/5 rounded bg-ed-elevated animate-pulse" />
      <div className="h-5 w-3/5 rounded bg-ed-elevated animate-pulse" />
      <div className="space-y-2 pt-1">
        <div className="h-3 w-full rounded bg-ed-elevated animate-pulse" />
        <div className="h-3 w-5/6 rounded bg-ed-elevated animate-pulse" />
      </div>
    </div>
  </div>
)

const HomePage: React.FC = () => {
  const { documents: posts, loading } = useFetchDocuments('posts')
  const authValue = useAuthValue()
  const user = authValue?.user

  return (
    <div className="bg-ed-bg">
      {/* Hero */}
      <section className="border-b border-ed-border">
        <div className="page-wrapper py-20 md:py-28">
          <div className="max-w-2xl animate-fade-up">
            <p className="section-label mb-5">Lucas Oliveira · Dev Blog</p>
            <div className="gold-line mb-8" />
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-ed-tp leading-[1.05] mb-6">
              Pensamentos sobre
              <span className="block italic text-ed-accent">
                código &amp; craft.
              </span>
            </h1>
            <p className="font-body text-base md:text-lg text-ed-ts leading-relaxed max-w-xl">
              Desenvolvimento web, engenharia de software e reflexões sobre a
              indústria tech. Escrito por quem vive isso no dia a dia.
            </p>
          </div>
        </div>
      </section>

      {/* Posts */}
      <section className="page-wrapper py-16">
        <div
          className="flex items-center justify-between mb-10 animate-fade-up"
          style={{ animationDelay: '100ms' }}
        >
          <div>
            <p className="section-label mb-2">Publicações</p>
            <h2 className="font-display text-3xl text-ed-tp">
              Últimos artigos
            </h2>
          </div>
          {user && (
            <Link to="/post/create" className="btn-ghost hidden md:inline-flex">
              <BiPencil className="text-sm" />
              Escrever
            </Link>
          )}
        </div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {!loading && posts && posts.length === 0 && (
          <div className="text-center py-24 border border-dashed border-ed-border rounded-sm">
            <p className="font-display text-2xl text-ed-ts mb-3">
              Nenhum post ainda
            </p>
            <p className="font-body text-sm text-ed-tm mb-8">
              Seja o primeiro a compartilhar algo.
            </p>
            {user && (
              <Link to="/post/create">
                <button className="btn-gold">
                  <BiPencil />
                  Criar primeiro post
                </button>
              </Link>
            )}
          </div>
        )}

        {!loading && posts && posts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map((post, i) => (
              <div
                key={post.id}
                className="animate-fade-up"
                style={{ animationDelay: `${150 + i * 80}ms` }}
              >
                <PostDetail post={post} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default HomePage
