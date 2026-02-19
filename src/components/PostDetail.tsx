import React from 'react'
import { Link } from 'react-router-dom'
import { BiRightArrowAlt } from 'react-icons/bi'

interface Post {
  id: string
  title: string
  image: string
  createdBy: string
  tags: string[]
  body: string
}

interface Props {
  post: Post
}

const PostDetail: React.FC<Props> = ({ post }) => {
  return (
    <Link to={`/posts/${post.id}`} className="group block">
      <article className="card-ed card-gold-top h-full flex flex-col overflow-hidden">
        {/* Image */}
        <div className="overflow-hidden aspect-video bg-ed-elevated">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              ;(e.target as HTMLImageElement).src =
                'https://placehold.co/800x450/161616/272217?text=devlog'
            }}
          />
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-5 gap-3">
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="tag-ed">
                #{tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h2 className="font-display text-xl text-ed-tp leading-snug group-hover:text-ed-accent transition-colors duration-200 line-clamp-2">
            {post.title}
          </h2>

          {/* Preview */}
          <p className="font-body text-sm text-ed-ts leading-relaxed line-clamp-3 flex-1">
            {post.body}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-ed-border mt-auto">
            <span className="font-ui text-xs text-ed-tm tracking-wider">
              {post.createdBy}
            </span>
            <span className="flex items-center gap-1 font-ui text-xs text-ed-accent group-hover:gap-2 transition-all duration-200">
              Ler <BiRightArrowAlt className="text-sm" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}

export default PostDetail
