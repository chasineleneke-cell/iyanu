import { Router } from 'express'

const router = Router()

// POST /api/payments/initialize
router.post('/initialize', async (req, res) => {
  res.status(501).json({ error: 'Not implemented' })
})

// POST /api/payments/verify
router.post('/verify', async (req, res) => {
  res.status(501).json({ error: 'Not implemented' })
})

// GET /api/payments/history
router.get('/history', async (req, res) => {
  res.status(501).json({ error: 'Not implemented' })
})

export default router
