import { jwtDecode } from 'jwt-decode'
import Cookies from 'js-cookie'

export interface User {
  user_id: number
  username: string
  role: string
  organization: string
  organization_id: number
}

interface AuthResponse {
  token: string
  user_id: number
  username: string
  role: string
  organization: string
}

export function setAuth(data: AuthResponse) {
  // 设置 cookie，7天过期
  Cookies.set('token', data.token, { expires: 7 })

  // 从token中解析organization_id
  const decoded = jwtDecode(data.token) as { organization_id: number }

  // 存储用户信息到 localStorage
  localStorage.setItem('user', JSON.stringify({
    user_id: data.user_id,
    username: data.username,
    role: data.role,
    organization: data.organization,
    organization_id: decoded.organization_id
  }))
}

export function getUser(): User | null {
  const userStr = localStorage.getItem('user')
  if (!userStr) return null

  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

export function clearAuth() {
  Cookies.remove('token')
  localStorage.removeItem('user')
}

export function isTokenValid(): boolean {
  const token = Cookies.get('token')
  if (!token) return false

  try {
    const decoded = jwtDecode(token) as { exp?: number }
    const currentTime = Date.now() / 1000
    return (decoded.exp ?? 0) > currentTime
  } catch {
    return false
  }
}

export function getToken(): string | undefined {
  return Cookies.get('token')
}
