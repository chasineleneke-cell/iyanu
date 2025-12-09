import { Router } from 'express'

const router = Router()

// GET /api/profile
router.get('/', async (req, res) => {
  res.status(501).json({ error: 'Not implemented' })
})

// PUT /api/profile
router.put('/', async (req, res) => {
  res.status(501).json({ error: 'Not implemented' })
})

// POST /api/profile/avatar
router.post('/avatar', async (req, res) => {
  res.status(501).json({ error: 'Not implemented' })
})

// PUT /api/profile/password
router.put('/password', async (req, res) => {
  res.status(501).json({ error: 'Not implemented' })
})

export default router
