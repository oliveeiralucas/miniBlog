import React from 'react'
import { Link } from 'react-router-dom'

import PostDetail from '@/components/PostDetail'
import { useFetchDocuments } from '@/hooks/useFetchDocuments'

// components

const HomePage: React.FC = () => {
  const { documents: posts, loading } = useFetchDocuments('posts')

  return (
    <div className="bg-white py-20">
      {loading && <p>Carregando...</p>}
      <div className="mx-auto mb-8 max-w-screen-sm text-center lg:mb-16">
        <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 lg:text-4xl">
          Confira os nossos posts recentes
        </h2>
        <p className="font-light text-gray-500 sm:text-xl">
          Neste blog, você encontrará uma variedade de conteúdos relacionados a
          programação, desenvolvimento web, dicas práticas, tutoriais e
          reflexões sobre a indústria de tecnologia.
        </p>
      </div>
      {posts && posts.length === 0 && (
        <div>
          <p>Não foram encontrados posts</p>
          <Link to="/posts/create" className="">
            Criar primeiro post
          </Link>
        </div>
      )}
      <div className="grid grid-cols-3">
        {posts && posts.map((post) => <PostDetail key={post.id} post={post} />)}
      </div>
    </div>
  )
}

export default HomePage
