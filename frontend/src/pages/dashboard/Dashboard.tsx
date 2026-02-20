import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BiCode, BiPencil, BiPlus, BiShow, BiTrash } from 'react-icons/bi'

import { projectsApi } from '@/api/apiClient'
import type { ApiProject } from '@/api/types'
import { useAuthValue } from '@/context/AuthContext'
import { useDeleteDocument } from '@/hooks/useDeleteDocument'
import { useFetchDocuments } from '@/hooks/useFetchDocuments'

const Dashboard: React.FC = () => {
  const authValue = useAuthValue()
  const user = authValue?.user
  const uid = user?.uid

  const { documents: posts, loading } = useFetchDocuments('posts', null, uid)
  const { deleteDocument, response: deleteResponse } = useDeleteDocument('posts')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [postError, setPostError] = useState<string | null>(null)

  // Admin: projects list
  const [projects, setProjects] = useState<ApiProject[]>([])
  const [projectsLoading, setProjectsLoading] = useState(false)
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null)
  const [projectError, setProjectError] = useState<string | null>(null)

  useEffect(() => {
    if (deleteResponse.error) setPostError(String(deleteResponse.error))
  }, [deleteResponse.error])

  useEffect(() => {
    if (!user?.isAdmin) return
    setProjectsLoading(true)
    projectsApi
      .getAll({ size: 200 })
      .then((data) => setProjects(data.items))
      .finally(() => setProjectsLoading(false))
  }, [user?.isAdmin])

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Excluir "${title}"? Esta ação não pode ser desfeita.`)) return
    setDeletingId(id)
    await deleteDocument(id)
    setDeletingId(null)
  }

  const handleDeleteProject = async (id: string, title: string) => {
    if (!confirm(`Excluir projeto "${title}"? Esta ação não pode ser desfeita.`)) return
    setDeletingProjectId(id)
    try {
      await projectsApi.delete(id)
      setProjects((prev) => prev.filter((p) => p.id !== id))
    } catch (err: any) {
      setProjectError(err.message ?? 'Erro ao excluir projeto.')
    } finally {
      setDeletingProjectId(null)
    }
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
          {user?.isAdmin && (
            <Link to="/post/create" className="btn-gold text-xs">
              <BiPlus className="text-base" />
              Novo post
            </Link>
          )}
        </div>
      </section>

      {/* Posts Content */}
      <section className="page-wrapper py-10">
        {postError && (
          <p className="font-ui text-xs text-red-400 bg-red-900/10 border border-red-900/30 px-3 py-2 rounded-sm mb-4">
            {postError}
          </p>
        )}
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
              {user?.isAdmin
                ? 'Comece escrevendo seu primeiro artigo.'
                : 'Sua conta não tem permissão para publicar posts.'}
            </p>
            {user?.isAdmin && (
              <Link to="/post/create">
                <button className="btn-gold">
                  <BiPlus />
                  Criar post
                </button>
              </Link>
            )}
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
                    {user?.isAdmin && (
                      <>
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
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Admin: Projects Section */}
      {user?.isAdmin && (
        <section className="border-t border-ed-border">
          <div className="page-wrapper py-10">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="section-label mb-2 flex items-center gap-1.5">
                  <BiCode className="text-ed-accent" /> Admin
                </p>
                <div className="gold-line mb-4" />
                <h2 className="font-display text-2xl md:text-3xl text-ed-tp">
                  Projetos do Portfólio
                </h2>
              </div>
              <Link to="/admin/projects/new" className="btn-gold text-xs">
                <BiPlus className="text-base" />
                Novo projeto
              </Link>
            </div>

            {projectError && (
              <p className="font-ui text-xs text-red-400 bg-red-900/10 border border-red-900/30 px-3 py-2 rounded-sm mb-4">
                {projectError}
              </p>
            )}
            {projectsLoading && (
              <div className="space-y-2 animate-pulse">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-14 bg-ed-elevated rounded-sm" />
                ))}
              </div>
            )}

            {!projectsLoading && projects.length === 0 && (
              <div className="text-center py-16 border border-dashed border-ed-border rounded-sm">
                <p className="font-display text-xl text-ed-ts mb-4">
                  Nenhum projeto cadastrado
                </p>
                <Link to="/admin/projects/new" className="btn-ghost text-xs inline-flex">
                  <BiPlus /> Adicionar projeto
                </Link>
              </div>
            )}

            {!projectsLoading && projects.length > 0 && (
              <div className="animate-fade-in">
                <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-4 py-2 border-b border-ed-border mb-1">
                  <span className="section-label">Projeto</span>
                  <span className="section-label">Ano</span>
                  <span className="section-label">Destaque</span>
                  <span className="section-label">Ações</span>
                </div>
                <div className="divide-y divide-ed-border">
                  {projects.map((project, i) => (
                    <div
                      key={project.id}
                      className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-4 py-4 items-center hover:bg-ed-elevated/50 transition-colors duration-150 group animate-fade-up"
                      style={{ animationDelay: `${i * 60}ms` }}
                    >
                      <div className="min-w-0">
                        <h3 className="font-display text-ed-tp text-base leading-snug truncate group-hover:text-ed-accent transition-colors duration-200">
                          {project.title}
                        </h3>
                        <span className="tag-ed text-[10px] py-0">{project.category}</span>
                      </div>
                      <span className="font-ui text-xs text-ed-tm">{project.year}</span>
                      <span className="font-ui text-xs text-ed-tm text-center">
                        {project.featured ? '★' : '—'}
                      </span>
                      <div className="flex items-center gap-2 shrink-0">
                        <Link
                          to={`/portfolio/${project.slug}`}
                          className="p-2 text-ed-tm hover:text-ed-tp border border-transparent hover:border-ed-border rounded-sm transition-all duration-200"
                          title="Ver projeto"
                        >
                          <BiShow className="text-base" />
                        </Link>
                        <Link
                          to={`/admin/projects/edit/${project.slug}`}
                          className="p-2 text-ed-tm hover:text-ed-accent border border-transparent hover:border-ed-border rounded-sm transition-all duration-200"
                          title="Editar"
                        >
                          <BiPencil className="text-base" />
                        </Link>
                        <button
                          onClick={() => handleDeleteProject(project.id, project.title)}
                          disabled={deletingProjectId === project.id}
                          className="p-2 text-ed-tm hover:text-red-400 border border-transparent hover:border-red-900/40 rounded-sm transition-all duration-200 disabled:opacity-40"
                          title="Excluir"
                        >
                          {deletingProjectId === project.id ? (
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
          </div>
        </section>
      )}
    </div>
  )
}

export default Dashboard
