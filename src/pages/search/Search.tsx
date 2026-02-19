import React from 'react'
import { Link } from 'react-router-dom'
import { BiArrowBack, BiSearchAlt2 } from 'react-icons/bi'

import PostDetail from '@/components/PostDetail'
import { useFetchDocuments } from '@/hooks/useFetchDocuments'
import { useQuery } from '@/hooks/useSearch'

const Search: React.FC = () => {
  const query = useQuery()
  const search = query.get('q')

  const { documents: posts, loading } = useFetchDocuments('posts', search)

  return (
    <div className="bg-ed-bg">
      {/* Header */}
      <section className="border-b border-ed-border">
        <div className="page-wrapper py-12">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 section-label hover:text-ed-accent transition-colors duration-200 mb-6"
          >
            <BiArrowBack className="text-sm" />
            Voltar
          </Link>
          <div className="flex items-end gap-4">
            <BiSearchAlt2 className="text-3xl text-ed-accent mb-1.5 shrink-0" />
            <div>
              <p className="section-label mb-2">Busca</p>
              <h1 className="font-display text-3xl md:text-4xl text-ed-tp leading-snug">
                Resultados para{' '}
                <span className="italic text-ed-accent">"{search}"</span>
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="page-wrapper py-12">
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card-ed card-gold-top overflow-hidden animate-pulse">
                <div className="aspect-video bg-ed-elevated" />
                <div className="p-5 space-y-3">
                  <div className="h-3 w-16 rounded bg-ed-elevated" />
                  <div className="h-5 w-4/5 rounded bg-ed-elevated" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && posts && posts.length === 0 && (
          <div className="text-center py-24 border border-dashed border-ed-border rounded-sm animate-fade-in">
            <p className="font-display text-2xl text-ed-ts mb-3">
              Nenhum resultado encontrado
            </p>
            <p className="font-body text-sm text-ed-tm mb-8">
              Tente buscar por outra tag ou termo.
            </p>
            <Link to="/">
              <button className="btn-ghost text-xs">
                <BiArrowBack className="text-sm" />
                Ver todos os posts
              </button>
            </Link>
          </div>
        )}

        {!loading && posts && posts.length > 0 && (
          <>
            <p className="section-label mb-6">
              {posts.length} {posts.length === 1 ? 'resultado' : 'resultados'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {posts.map((post, i) => (
                <div
                  key={post.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <PostDetail post={post} />
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  )
}

export default Search
