import { NextResponse, NextRequest } from 'next/server'

export async function middleware(req: { nextUrl: { pathname: any, clone: () => any } }, ev: any) {
  const { pathname } = req.nextUrl
  if (pathname == '/') {
    const url = req.nextUrl.clone()
    url.pathname = '/test/jobs'
      return NextResponse.redirect(url)
  }
  return NextResponse.next()
}
