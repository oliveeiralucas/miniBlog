import React, { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { BiArrowBack, BiPencil, BiTrash } from 'react-icons/bi'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { postsApi } from '@/api/apiClient'
import { useAuthValue } from '@/context/AuthContext'
import { useFetchDocument } from '../../hooks/useFetchDocument'

const Post: React.FC = () => {
  const { id } = useParams()
  const { document: post, loading } = useFetchDocument('posts', id || '')
  const { user } = useAuthValue()
  const navigate = useNavigate()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!post || !confirm(`Excluir "${post.title}"? Esta ação não pode ser desfeita.`)) return
    setDeleting(true)
    try {
      await postsApi.delete(post.id)
      navigate('/')
    } catch {
      // silencioso — erro raro
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="page-wrapper py-16 max-w-3xl">
        <div className="space-y-4 animate-pulse">
          <div className="h-3 w-24 bg-ed-elevated rounded" />
          <div className="h-8 w-3/4 bg-ed-elevated rounded" />
          <div className="h-8 w-1/2 bg-ed-elevated rounded" />
          <div className="h-64 w-full bg-ed-elevated rounded mt-6" />
          <div className="space-y-3 mt-6">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="h-4 bg-ed-elevated rounded" style={{ width: `${80 + Math.random() * 20}%` }} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="page-wrapper py-20 text-center">
        <p className="font-display text-3xl text-ed-ts mb-4">Post não encontrado</p>
        <Link to="/" className="btn-ghost text-xs">
          <BiArrowBack className="text-sm" />
          Voltar ao início
        </Link>
      </div>
    )
  }

  return (
    <article className="bg-ed-bg animate-fade-in">
      {/* Header */}
      <div className="border-b border-ed-border">
        <div className="page-wrapper py-12 max-w-3xl">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 section-label hover:text-ed-accent transition-colors duration-200 mb-8"
          >
            <BiArrowBack className="text-sm" />
            Voltar ao blog
          </Link>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags?.map((tag: string) => (
              <span key={tag} className="tag-ed">
                #{tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-ed-tp leading-[1.05] mb-6">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-ed-accent/20 border border-ed-accent/30 flex items-center justify-center">
              <span className="font-ui text-xs font-bold text-ed-accent">
                {post.createdBy?.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="font-ui text-xs text-ed-ts tracking-wide">
              {post.createdBy}
            </span>
          </div>

          {/* Admin actions */}
          {user?.isAdmin && (
            <div className="flex items-center gap-2 mt-6">
              <Link
                to={`/posts/edit/${post.id}`}
                className="btn-ghost text-xs"
              >
                <BiPencil className="text-sm" /> Editar
              </Link>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="btn-ghost text-xs text-red-400 hover:border-red-900/40 disabled:opacity-40"
              >
                {deleting ? (
                  <div className="h-3.5 w-3.5 border border-red-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <BiTrash className="text-sm" />
                )}
                {deleting ? 'Excluindo...' : 'Excluir'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Featured image */}
      {post.image && (
        <div className="border-b border-ed-border">
          <div className="page-wrapper py-6 max-w-3xl">
            <img
              src={post.image}
              alt={post.title}
              className="w-full rounded-sm border border-ed-border"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
          </div>
        </div>
      )}

      {/* Body */}
      <div className="page-wrapper py-12 max-w-3xl">
        <div className="gold-line mb-8" />
        <div className="prose prose-ed max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.body}
          </ReactMarkdown>
        </div>

        {/* Tags footer */}
        <div className="mt-12 pt-8 border-t border-ed-border">
          <p className="section-label mb-4">Tags</p>
          <div className="flex flex-wrap gap-2">
            {post.tags?.map((tag: string) => (
              <Link
                key={tag}
                to={`/search?q=${tag}`}
                className="tag-ed hover:bg-ed-ad/60 transition-colors duration-200"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>

        {/* Back link */}
        <div className="mt-8">
          <Link to="/" className="btn-ghost text-xs">
            <BiArrowBack className="text-sm" />
            Ver todos os posts
          </Link>
        </div>
      </div>
    </article>
  )
}

export default Post
