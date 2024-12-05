import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 不需要验证的路由
const publicRoutes = ['/login', '/signup']

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const pathname = request.nextUrl.pathname

  // 如果是公开路由且已登录，重定向到首页
  if (publicRoutes.includes(pathname) && token) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // 如果不是公开路由且未登录，重定向到登录页
  if (!publicRoutes.includes(pathname) && !token) {
    const url = new URL('/login', request.url)
    url.searchParams.set('from', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

// 配置需要进行中间件检查的路由
export const config = {
  matcher: [
    /*
     * 匹配所有路径除了:
     * /api/auth/* (API 路由)
     * /_next/static (静态文件)
     * /_next/image (图片)
     * /favicon.ico (网站图标)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
}
