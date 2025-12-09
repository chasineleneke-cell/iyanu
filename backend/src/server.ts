import { createApp } from './app'

const PORT = parseInt(process.env.PORT || '5000')
const NODE_ENV = process.env.NODE_ENV || 'development'

const app = createApp()

app.listen(PORT, () => {
  console.log(`[Server] Running on http://localhost:${PORT}`)
  console.log(`[Environment] ${NODE_ENV}`)
  console.log(`[Database] ${process.env.DATABASE_URL?.split('/').pop()}`)
})

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n📛 Server shutting down...')
  process.exit(0)
})
