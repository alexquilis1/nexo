import express from 'express'
import cors from 'cors'
import searchRoute from './routes/searchRoute'
import verifyRoute from './routes/verifyRoute'

const app = express()
const PORT = 3001

// Middleware
app.use(cors())
app.use(express.json())

// Logging
app.use((req: any, res: any, next: any) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

// Rutas
app.use('/api/search-identity', searchRoute)
app.use('/api/verify-identity', verifyRoute)

// Health check
app.get('/api/health', (req: any, res: any) => {
  res.json({
    status: 'OK',
    message: 'Servidor ONCE funcionando',
    timestamp: new Date().toISOString()
  })
})

// Iniciar servidor
app.listen(PORT, () => {
  console.log('═══════════════════════════════════════════════════════════')
  console.log('🏛️  SERVIDOR ONCE - API DE ACREDITACIONES')
  console.log('═══════════════════════════════════════════════════════════')
  console.log(`🚀 Servidor corriendo en: http://localhost:${PORT}`)
  console.log('')
  console.log('📡 Endpoints disponibles:')
  console.log(`   GET  http://localhost:${PORT}/api/search-identity?expediente=ONCE-2025-ABC123`)
  console.log(`   GET  http://localhost:${PORT}/api/verify-identity?expediente=ONCE-2025-ABC123`)
  console.log(`   GET  http://localhost:${PORT}/api/health`)
  console.log('═══════════════════════════════════════════════════════════')
})