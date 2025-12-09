import { Router } from 'express'

const router = Router()

// GET /api/messages
router.get('/', async (req, res) => {
  res.status(501).json({ error: 'Not implemented' })
})

// POST /api/messages
router.post('/', async (req, res) => {
  res.status(501).json({ error: 'Not implemented' })
})

// PUT /api/messages/:id/read
router.put('/:id/read', async (req, res) => {
  res.status(501).json({ error: 'Not implemented' })
})

export default router
