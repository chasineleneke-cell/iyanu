import { Router } from 'express'
import { authController } from '../controllers/authController'
import { authMiddleware } from '../middlewares/auth'

const router = Router()

// POST /api/auth/register
router.post('/register', (req, res, next) => authController.register(req, res, next))

// POST /api/auth/login
router.post('/login', (req, res, next) => authController.login(req, res, next))

// POST /api/auth/logout
router.post('/logout', authMiddleware, (req, res, next) => authController.logout(req, res, next))

// POST /api/auth/refresh
router.post('/refresh', (req, res, next) => authController.refresh(req, res, next))

// GET /api/auth/me
router.get('/me', authMiddleware, (req, res, next) => authController.getProfile(req, res, next))

// PUT /api/auth/profile
router.put('/profile', authMiddleware, (req, res, next) => authController.updateProfile(req, res, next))

// POST /api/auth/change-password
router.post('/change-password', authMiddleware, (req, res, next) =>
  authController.changePassword(req, res, next)
)

// POST /api/auth/profile-image
router.post('/profile-image', authMiddleware, (req, res, next) =>
  authController.updateProfileImage(req, res, next)
)

export default router
