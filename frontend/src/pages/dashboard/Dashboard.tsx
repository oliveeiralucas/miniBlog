import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { BiPencil, BiTrash, BiShow, BiPlus } from 'react-icons/bi'

import { useAuthValue } from '@/context/AuthContext'
import { useDeleteDocument } from '@/hooks/useDeleteDocument'
import { useFetchDocuments } from '@/hooks/useFetchDocuments'

const Dashboard: React.FC = () => {
  const authValue = useAuthValue()
  const user = authValue?.user
  const uid = user?.uid

  const { documents: posts, loading } = useFetchDocuments('posts', null, uid)
  const { deleteDocument } = useDeleteDocument('posts')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Excluir "${title}"? Esta ação não pode ser desfeita.`)) return
    setDeletingId(id)
    await deleteDocument(id)
    setDeletingId(null)
  }

  return (
    <div className="bg-ed-bg">
      {/* Header */}
      <section className="border-b border-ed-border">
        <div className="page-wrapper py-10 flex items-end justify-between">
          <div className="animate-fade-up">
            <p className="section-label mb-2">Painel de controle</p>
            <div className="gold-line mb-4" />
            <h1 className="font-display text-3xl md:text-4xl text-ed-tp">
              Meus Posts
            </h1>
          </div>
          <Link to="/post/create" className="btn-gold text-xs">
            <BiPlus className="text-base" />
            Novo post
          </Link>
        </div>
      </section>

      {/* Content */}
      <section className="page-wrapper py-10">
        {loading && (
          <div className="space-y-2 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 bg-ed-elevated rounded-sm" />
            ))}
          </div>
        )}

        {!loading && posts && posts.length === 0 && (
          <div className="text-center py-24 border border-dashed border-ed-border rounded-sm animate-fade-in">
            <p className="font-display text-2xl text-ed-ts mb-3">
              Nenhum post publicado
            </p>
            <p className="font-body text-sm text-ed-tm mb-8">
              Comece escrevendo seu primeiro artigo.
            </p>
            <Link to="/post/create">
              <button className="btn-gold">
                <BiPlus />
                Criar post
              </button>
            </Link>
          </div>
        )}

        {!loading && posts && posts.length > 0 && (
          <div className="animate-fade-in">
            {/* Table header */}
            <div className="grid grid-cols-[1fr_auto] gap-4 px-4 py-2 border-b border-ed-border mb-1">
              <span className="section-label">Título</span>
              <span className="section-label">Ações</span>
            </div>

            {/* Rows */}
            <div className="divide-y divide-ed-border">
              {posts.map((post, i) => (
                <div
                  key={post.id}
                  className="grid grid-cols-[1fr_auto] gap-4 px-4 py-4 items-center hover:bg-ed-elevated/50 transition-colors duration-150 group animate-fade-up"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  {/* Title + tags */}
                  <div className="min-w-0">
                    <h3 className="font-display text-ed-tp text-base leading-snug truncate group-hover:text-ed-accent transition-colors duration-200">
                      {post.title}
                    </h3>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {post.tags?.slice(0, 3).map((tag: string) => (
                        <span key={tag} className="tag-ed text-[10px] py-0">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      to={`/posts/${post.id}`}
                      className="p-2 text-ed-tm hover:text-ed-tp border border-transparent hover:border-ed-border rounded-sm transition-all duration-200"
                      title="Ver post"
                    >
                      <BiShow className="text-base" />
                    </Link>
                    <Link
                      to={`/posts/edit/${post.id}`}
                      className="p-2 text-ed-tm hover:text-ed-accent border border-transparent hover:border-ed-border rounded-sm transition-all duration-200"
                      title="Editar"
                    >
                      <BiPencil className="text-base" />
                    </Link>
                    <button
                      onClick={() => handleDelete(post.id, post.title)}
                      disabled={deletingId === post.id}
                      className="p-2 text-ed-tm hover:text-red-400 border border-transparent hover:border-red-900/40 rounded-sm transition-all duration-200 disabled:opacity-40"
                      title="Excluir"
                    >
                      {deletingId === post.id ? (
                        <div className="h-3.5 w-3.5 border border-red-400 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <BiTrash className="text-base" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

export default Dashboard
