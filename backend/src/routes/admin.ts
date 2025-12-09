import { Router } from 'express'

const router = Router()

// GET /api/admin/bookings
router.get('/bookings', async (req, res) => {
  res.status(501).json({ error: 'Not implemented' })
})

// POST /api/admin/bookings/:id/approve
router.post('/bookings/:id/approve', async (req, res) => {
  res.status(501).json({ error: 'Not implemented' })
})

// POST /api/admin/bookings/:id/reject
router.post('/bookings/:id/reject', async (req, res) => {
  res.status(501).json({ error: 'Not implemented' })
})

// GET /api/admin/dashboard
router.get('/dashboard', async (req, res) => {
  res.status(501).json({ error: 'Not implemented' })
})

export default router
