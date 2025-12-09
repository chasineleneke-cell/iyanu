import { Router } from 'express'

const router = Router()

// POST /api/admin/properties
router.post('/', async (req, res) => {
  res.status(501).json({ error: 'Not implemented' })
})

// GET /api/admin/properties
router.get('/', async (req, res) => {
  res.status(501).json({ error: 'Not implemented' })
})

// PUT /api/admin/properties/:id
router.put('/:id', async (req, res) => {
  res.status(501).json({ error: 'Not implemented' })
})

// DELETE /api/admin/properties/:id
router.delete('/:id', async (req, res) => {
  res.status(501).json({ error: 'Not implemented' })
})

// POST /api/admin/properties/:id/units
router.post('/:id/units', async (req, res) => {
  res.status(501).json({ error: 'Not implemented' })
})

// PUT /api/admin/properties/:propertyId/units/:unitId
router.put('/:propertyId/units/:unitId', async (req, res) => {
  res.status(501).json({ error: 'Not implemented' })
})

// DELETE /api/admin/properties/:propertyId/units/:unitId
router.delete('/:propertyId/units/:unitId', async (req, res) => {
  res.status(501).json({ error: 'Not implemented' })
})

export default router
