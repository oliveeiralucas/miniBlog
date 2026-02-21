import type {
  ApiComment,
  ApiPost,
  ApiProject,
  ApiTag,
  CommentCreatePayload,
  GenerateImagePayload,
  GenerateImageResponse,
  GeneratePromptPayload,
  GeneratePromptResponse,
  LoginPayload,
  PaginatedPosts,
  PaginatedProjects,
  PostCreatePayload,
  PostUpdatePayload,
  ProjectCreatePayload,
  ProjectUpdatePayload,
  RegisterPayload,
  TagListResponse,
  TokenResponse,
} from './types'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1'

// ─── Token storage ────────────────────────────────────────────────────────────

const REFRESH_KEY = 'miniblog_refresh_token'

export const tokenStorage = {
  getRefresh: (): string | null => localStorage.getItem(REFRESH_KEY),
  setRefresh: (token: string): void => localStorage.setItem(REFRESH_KEY, token),
  clearRefresh: (): void => localStorage.removeItem(REFRESH_KEY),
}

// In-memory access token (never persisted to localStorage for security)
let _accessToken: string | null = null

export const accessTokenStore = {
  get: () => _accessToken,
  set: (t: string | null) => { _accessToken = t },
}

// ─── Core fetch wrapper ───────────────────────────────────────────────────────

async function request<T>(
  path: string,
  options: RequestInit = {},
  retry = true
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  if (_accessToken) {
    headers['Authorization'] = `Bearer ${_accessToken}`
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })

  // Auto-refresh on 401 (expired access token)
  if (res.status === 401 && retry) {
    const refreshed = await attemptRefresh()
    if (refreshed) {
      return request<T>(path, options, false)
    }
    // Refresh failed — clear tokens and propagate the 401
    accessTokenStore.set(null)
    tokenStorage.clearRefresh()
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({ code: 'UNKNOWN', message: res.statusText }))
    let message: string = body.message
    if (!message && Array.isArray(body.detail)) {
      // Pydantic validation error: { detail: [{loc, msg, type}] }
      message = body.detail.map((e: any) => e.msg).join('; ')
    }
    const err = new Error(message ?? 'Request failed')
    ;(err as any).code = body.code ?? 'UNKNOWN'
    ;(err as any).status = res.status
    throw err
  }

  if (res.status === 204) return undefined as unknown as T
  return res.json() as Promise<T>
}

async function attemptRefresh(): Promise<boolean> {
  const refresh = tokenStorage.getRefresh()
  if (!refresh) return false

  try {
    const data = await request<TokenResponse>(
      '/auth/refresh',
      {
        method: 'POST',
        body: JSON.stringify({ refreshToken: refresh }),
      },
      false // prevent infinite loop
    )
    accessTokenStore.set(data.accessToken)
    tokenStorage.setRefresh(data.refreshToken)
    return true
  } catch {
    return false
  }
}

// ─── Auth endpoints ───────────────────────────────────────────────────────────

export const authApi = {
  register: (payload: RegisterPayload) =>
    request<TokenResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  login: (payload: LoginPayload): Promise<TokenResponse> =>
    request<TokenResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  logout: (refreshToken: string): Promise<void> =>
    request<void>('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    }),

  me: () => request<TokenResponse['user']>('/auth/me'),

  refresh: (refreshToken: string): Promise<TokenResponse> =>
    request<TokenResponse>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    }),
}

// ─── Posts endpoints ──────────────────────────────────────────────────────────

export const postsApi = {
  getAll: (params?: { q?: string; uid?: string; page?: number; size?: number }) => {
    const qs = new URLSearchParams()
    if (params?.q) qs.set('q', params.q)
    if (params?.uid) qs.set('uid', params.uid)
    if (params?.page) qs.set('page', String(params.page))
    if (params?.size) qs.set('size', String(params.size))
    const query = qs.toString() ? `?${qs.toString()}` : ''
    return request<PaginatedPosts>(`/posts${query}`)
  },

  getById: (id: string) => request<ApiPost>(`/posts/${id}`),

  create: (payload: PostCreatePayload) =>
    request<ApiPost>('/posts', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  update: (id: string, payload: PostUpdatePayload) =>
    request<ApiPost>(`/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  delete: (id: string): Promise<void> =>
    request<void>(`/posts/${id}`, { method: 'DELETE' }),

  like: (id: string): Promise<void> =>
    request<void>(`/posts/${id}/like`, { method: 'POST' }),

  unlike: (id: string): Promise<void> =>
    request<void>(`/posts/${id}/like`, { method: 'DELETE' }),
}

// ─── Comments endpoints ───────────────────────────────────────────────────────

export const commentsApi = {
  getByPost: (postId: string) => request<ApiComment[]>(`/posts/${postId}/comments`),

  create: (postId: string, payload: CommentCreatePayload) =>
    request<ApiComment>(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  delete: (commentId: string): Promise<void> =>
    request<void>(`/comments/${commentId}`, { method: 'DELETE' }),
}

// ─── Tags endpoints ───────────────────────────────────────────────────────────

export const tagsApi = {
  getAll: (): Promise<ApiTag[]> =>
    request<TagListResponse>('/tags').then((r) => r.tags),
}

// ─── Projects endpoints ───────────────────────────────────────────────────────

export const projectsApi = {
  getAll: (params?: { featured?: boolean; page?: number; size?: number }) => {
    const qs = new URLSearchParams()
    if (params?.featured) qs.set('featured', 'true')
    if (params?.page) qs.set('page', String(params.page))
    if (params?.size) qs.set('size', String(params.size))
    const query = qs.toString() ? `?${qs.toString()}` : ''
    return request<PaginatedProjects>(`/projects${query}`)
  },

  getBySlug: (slug: string) => request<ApiProject>(`/projects/${slug}`),

  create: (payload: ProjectCreatePayload) =>
    request<ApiProject>('/projects', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  update: (id: string, payload: ProjectUpdatePayload) =>
    request<ApiProject>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  delete: (id: string): Promise<void> =>
    request<void>(`/projects/${id}`, { method: 'DELETE' }),
}

// ─── Image AI endpoints ───────────────────────────────────────────────────────

export const imageAiApi = {
  generatePrompt: (payload: GeneratePromptPayload): Promise<GeneratePromptResponse> =>
    request<GeneratePromptResponse>('/image-ai/generate-prompt', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  generateImage: (payload: GenerateImagePayload): Promise<GenerateImageResponse> =>
    request<GenerateImageResponse>('/image-ai/generate-image', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
}
