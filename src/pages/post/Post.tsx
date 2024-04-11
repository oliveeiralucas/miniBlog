import { useParams } from 'react-router-dom'

import { useFetchDocument } from '../../hooks/useFetchDocument'

const Post = () => {
  const { id } = useParams()
  const { document: post } = useFetchDocument('posts', id || '')

  return (
    <div className="mx-auto mt-10 w-fit flex-col items-center justify-center rounded-lg border border-gray-300 p-6">
      {post && (
        <>
          <h1 className="mb-4 text-3xl font-bold">{post.title}</h1>
          <img
            src={post.image}
            alt={post.title}
            className="mb-4 max-w-sm rounded-lg"
          />
          <p className="text-lg">{post.body}</p>
          <h3 className="mt-6 text-xl font-semibold">Este post trata sobre:</h3>
          <div className="mt-2 flex flex-wrap">
            {post.tags.map((tag: string) => (
              <span
                key={tag}
                className="mb-2 mr-2 rounded-full bg-gray-200 px-3 py-1 text-sm text-gray-800"
              >
                #{tag}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default Post
