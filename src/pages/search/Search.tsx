import { Link } from 'react-router-dom'

import { useQuery } from '@/hooks/useSearch'

// components
import PostDetail from '../../components/PostDetail'
// hooks
import { useFetchDocuments } from '../../hooks/useFetchDocuments'

const Search = () => {
  const query = useQuery()
  const search = query.get('q')

  const { documents: posts } = useFetchDocuments('posts', search)

  console.log(posts)

  return (
    <div className="flex flex-col items-center justify-center py-6">
      <h1>Resultados encontrados para: {search}</h1>
      <div className="">
        {posts && posts.length === 0 && (
          <>
            <p>Não foram encontrados posts a partir da sua busca...</p>
            <Link to="/" className="">
              Voltar
            </Link>
          </>
        )}
        {posts && posts.map((post) => <PostDetail key={post.id} post={post} />)}
      </div>
    </div>
  )
}

export default Search
