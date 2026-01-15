const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001'

// ============ Types ============

export interface User {
  id: number
  login: string
  isAdmin: boolean
}

export interface AuthResponse {
  message: string
  user: User
  token: string
}

export interface Album {
  id: number
  name: string
  description: string | null
  coverImageId: number | null
  createdAt: string
  updatedAt: string
}

export interface Image {
  id: number
  filename: string
  originalName: string
  description: string | null
  width: number
  height: number
  uploadedAt: string
  webUrl: string
  thumbnailUrl: string
}

export interface AlbumWithImages {
  album: Album
  images: Image[]
}

let authToken: string | null = null

//Токен для авторизации
export function setToken(token: string | null) {
  authToken = token
  if (token) {
    localStorage.setItem('authToken', token)
  } else {
    localStorage.removeItem('authToken')
  }
}

//Токен для щагрузки изображений
export function getToken(): string | null {
  if (!authToken) {
    authToken = localStorage.getItem('authToken')
  }
  return authToken
}

export function clearToken() {
  authToken = null
  localStorage.removeItem('authToken')
}

//Получение заголовков
function getHeaders(includeAuth = false): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }

  if (includeAuth) {
    const token = getToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
  }

  return headers
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(error.error || `HTTP ${response.status}`)
  }
  return response.json()
}

//рега
export async function login(login: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ login, password }),
  })

  const data = await handleResponse<AuthResponse>(response)
  setToken(data.token)
  return data
}

export async function verifyToken(): Promise<{ user: User } | null> {
  const token = getToken()
  if (!token) return null

  try {
    const response = await fetch(`${API_BASE}/api/auth/verify`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!response.ok) {
      clearToken()
      return null
    }

    return response.json()
  } catch {
    clearToken()
    return null
  }
}

export function logout() {
  clearToken()
}

// ============ Albums API ============

export async function fetchAlbums(): Promise<Album[]> {
  const response = await fetch(`${API_BASE}/api/albums`)
  return handleResponse<Album[]>(response)
}

export async function fetchAlbum(id: number): Promise<Album & { images: Image[] }> {
  const response = await fetch(`${API_BASE}/api/albums/${id}`)
  return handleResponse<Album & { images: Image[] }>(response)
}

export async function createAlbum(name: string, description?: string): Promise<Album> {
  const response = await fetch(`${API_BASE}/api/albums`, {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify({ name, description }),
  })
  return handleResponse<Album>(response)
}

export async function updateAlbum(
  id: number,
  data: { name?: string; description?: string; coverImageId?: number },
): Promise<Album> {
  const response = await fetch(`${API_BASE}/api/albums/${id}`, {
    method: 'PUT',
    headers: getHeaders(true),
    body: JSON.stringify(data),
  })
  return handleResponse<Album>(response)
}

export async function deleteAlbum(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/api/albums/${id}`, {
    method: 'DELETE',
    headers: getHeaders(true),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(error.error || `HTTP ${response.status}`)
  }
}

// ============ Images API ============

export async function fetchAllImages(): Promise<AlbumWithImages[]> {
  const response = await fetch(`${API_BASE}/api/images/all`)
  return handleResponse<AlbumWithImages[]>(response)
}

export async function fetchAlbumImages(albumId: number): Promise<Image[]> {
  const response = await fetch(`${API_BASE}/api/images/album/${albumId}`)
  return handleResponse<Image[]>(response)
}

export async function uploadImage(
  file: File,
  albumId: number,
  description?: string,
): Promise<{ id: number; webUrl: string; thumbnailUrl: string }> {
  const formData = new FormData()
  formData.append('image', file)
  formData.append('albumId', albumId.toString())
  if (description) {
    formData.append('description', description)
  }

  const token = getToken()
  const response = await fetch(`${API_BASE}/api/images/upload`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  })

  return handleResponse<{ id: number; webUrl: string; thumbnailUrl: string }>(response)
}

export async function deleteImage(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/api/images/${id}`, {
    method: 'DELETE',
    headers: getHeaders(true),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(error.error || `HTTP ${response.status}`)
  }
}

// ============ Image URLs ============

export function getWebImageUrl(id: number, token?: string): string {
  const url = `${API_BASE}/api/images/web/${id}`
  return token ? `${url}?token=${token}` : url
}

export function getThumbnailUrl(id: number, token?: string): string {
  const url = `${API_BASE}/api/images/thumbnail/${id}`
  return token ? `${url}?token=${token}` : url
}
