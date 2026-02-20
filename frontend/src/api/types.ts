// ─── User ─────────────────────────────────────────────────────────────────────

export interface ApiUser {
  id: string
  email: string
  displayName: string
  isAdmin: boolean
  createdAt: string
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface RegisterPayload {
  displayName: string
  email: string
  password: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface TokenResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
  user: ApiUser
}

// ─── Posts ────────────────────────────────────────────────────────────────────

export interface ApiPost {
  id: string
  title: string
  image: string
  body: string
  tags: string[]
  /** author's user ID — mapped to `uid` for backwards compatibility */
  uid: string
  /** author's displayName — mapped to `createdBy` for backwards compatibility */
  createdBy: string
  createdAt: string
  likeCount: number
  commentCount: number
  likedByMe: boolean
}

export interface PostCreatePayload {
  title: string
  image: string
  body: string
  tags: string[]
}

export interface PostUpdatePayload {
  title?: string
  image?: string
  body?: string
  tags?: string[]
}

export interface PaginatedPosts {
  items: ApiPost[]
  total: number
  page: number
  size: number
  pages: number
}

// ─── Comments ─────────────────────────────────────────────────────────────────

export interface ApiComment {
  id: string
  body: string
  postId: string
  authorId: string
  authorName: string
  parentId: string | null
  createdAt: string
  replyCount: number
}

export interface CommentCreatePayload {
  body: string
  parentId?: string
}

// ─── Tags ─────────────────────────────────────────────────────────────────────

export interface ApiTag {
  name: string
  postCount: number
}

export interface TagListResponse {
  tags: ApiTag[]
}

// ─── Projects ─────────────────────────────────────────────────────────────────

export interface TechStackItem {
  name: string
}

export interface StatItem {
  label: string
  value: string
}

export interface ApiProject {
  id: string
  slug: string
  title: string
  tagline: string
  description: string
  category: string
  url: string
  githubUrl: string | null
  image: string
  tags: string[]
  techStack: TechStackItem[]
  stats: StatItem[]
  features: string[]
  year: number
  featured: boolean
  createdAt: string
  updatedAt: string
}

export interface ProjectCreatePayload {
  slug: string
  title: string
  tagline: string
  description: string
  category: string
  url: string
  githubUrl?: string
  image: string
  tags: string[]
  techStack: TechStackItem[]
  stats: StatItem[]
  features: string[]
  year: number
  featured: boolean
}

export interface ProjectUpdatePayload {
  slug?: string
  title?: string
  tagline?: string
  description?: string
  category?: string
  url?: string
  githubUrl?: string | null
  image?: string
  tags?: string[]
  techStack?: TechStackItem[]
  stats?: StatItem[]
  features?: string[]
  year?: number
  featured?: boolean
}

export interface PaginatedProjects {
  items: ApiProject[]
  total: number
  page: number
  size: number
  pages: number
}

// ─── Errors ───────────────────────────────────────────────────────────────────

export interface ApiError {
  code: string
  message: string
}
