import { PrismaClient } from '@prisma/client'

// Avoid multiple Prisma instances in development
declare global {
  var prisma: PrismaClient
}

export const prisma = globalThis.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma
}
