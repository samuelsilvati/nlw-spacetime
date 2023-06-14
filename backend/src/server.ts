import 'dotenv/config'
import fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import multipart from '@fastify/multipart'
import { memoriesRoutes } from './routes/memories'
import { authRoutes } from './routes/auth'
import { uploadRoutes } from './routes/upload'

export function init() {
  const app = fastify()

  app.register(multipart)

  app.register(cors, {
    origin: true,
  })

  app.register(jwt, {
    secret: `${process.env.JWT_SECRET}`,
  })

  app.register(authRoutes)
  app.register(memoriesRoutes)
  app.register(uploadRoutes)
}

if (require.main === module) {
  init()
    .listen({
      port: 3333,
    })
    .then(() => {
      console.log('HTTP server running on http://localhost:3333')
    })
}
