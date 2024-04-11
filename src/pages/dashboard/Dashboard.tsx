import { Link } from 'react-router-dom'

import { useAuthValue } from '@/context/AuthContext'
import { useDeleteDocument } from '@/hooks/useDeleteDocument'
import { useFetchDocuments } from '@/hooks/useFetchDocuments'

const Dashboard = () => {
  const authValue = useAuthValue()
  const user = authValue?.user

  const uid = user?.uid

  const { documents: posts } = useFetchDocuments('posts', null, uid)

  const { deleteDocument } = useDeleteDocument('posts')

  console.log(uid)
  console.log(posts)

  return (
    <div className="">
      <p>Gerencie os seus posts</p>
      {posts && posts.length === 0 ? (
        <div className="">
          <p>Não foram encontrados posts</p>
          <Link to="/posts/create" className="">
            Criar primeiro post
          </Link>
        </div>
      ) : (
        <div className="">
          <span>Título</span>
          <span>Ações</span>
        </div>
      )}

      {posts &&
        posts.map((post) => (
          <div className="" key={post.id}>
            <p>{post.title}</p>
            <div className="">
              <Link to={`/posts/${post.id}`} className="">
                Ver
              </Link>
              <Link to={`/posts/edit/${post.id}`} className="">
                Editar
              </Link>
              <button onClick={() => deleteDocument(post.id)} className="">
                Excluir
              </button>
            </div>
          </div>
        ))}
    </div>
  )
}

export default Dashboard
