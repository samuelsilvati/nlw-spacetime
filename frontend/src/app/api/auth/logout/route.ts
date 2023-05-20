import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const rediretURL = new URL('/', request.url)

  return NextResponse.redirect(rediretURL, {
    headers: {
      'Set-Cookie': `token=; Path=/;max-age=0`,
    },
  })
}
