import { Request, Response, NextFunction } from 'express'
import { AppError } from '../utils/errors'
import { ZodError } from 'zod'

export const errorHandler = (
  error: Error | AppError | ZodError | any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', error?.message || error)

  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      data: {
        errors: error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      },
    })
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      data: error.details || null,
    })
  }

  res.status(500).json({
    success: false,
    message: 'Internal server error',
    data: process.env.NODE_ENV === 'development' ? error.message : null,
  })
}

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    data: {
      path: req.originalUrl,
    },
  })
}
