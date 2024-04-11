import { BiPurchaseTagAlt } from 'react-icons/bi'
import { Link } from 'react-router-dom'

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
    <Link to={`/posts/${post.id}`}>
      <section className="bg-white">
        <div className="mx-auto max-w-screen-xl p-6">
          <article className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
            <img className="rounded-lg" src={post.image} alt={post.title} />
            <div className="my-3 flex items-center justify-between text-gray-500">
              <div className="">
                {post.tags.map((tag: string) => (
                  <p
                    key={tag}
                    className="mr-4 inline-flex items-center gap-1 rounded bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
                  >
                    <BiPurchaseTagAlt />
                    {tag}
                  </p>
                ))}
              </div>
              <span className="text-sm">{post.createdBy}</span>
            </div>
            <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 ">
              <p>{post.title}</p>
            </h2>
            <p className="mb-5 font-light text-gray-500">{post.body}</p>
          </article>
        </div>
      </section>
    </Link>
  )
}

export default PostDetail
