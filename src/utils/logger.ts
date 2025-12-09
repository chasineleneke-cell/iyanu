/**
 * Logger Utility
 * 
 * Provides logging functions that are disabled in production
 */

type LogLevel = 'log' | 'warn' | 'error' | 'debug' | 'info'

interface LoggerOptions {
  prefix?: string
  timestamp?: boolean
}

const isDev = process.env.NODE_ENV === 'development'

class Logger {
  private prefix: string
  private timestamp: boolean

  constructor(options: LoggerOptions = {}) {
    this.prefix = options.prefix || '[App]'
    this.timestamp = options.timestamp ?? isDev
  }

  private formatMessage(level: LogLevel, message: string, data?: any) {
    const time = this.timestamp ? `[${new Date().toISOString()}]` : ''
    const levelStr = level.toUpperCase()
    const output = `${time} ${this.prefix} [${levelStr}] ${message}`

    return { output, data }
  }

  log(message: string, data?: any) {
    if (isDev) {
      const { output, data: d } = this.formatMessage('log', message, data)
      console.log(output, d)
    }
  }

  warn(message: string, data?: any) {
    if (isDev) {
      const { output, data: d } = this.formatMessage('warn', message, data)
      console.warn(output, d)
    }
  }

  error(message: string, error?: any) {
    // Always log errors, even in production
    const { output } = this.formatMessage('error', message, error)
    console.error(output, error)
  }

  debug(message: string, data?: any) {
    if (isDev) {
      const { output, data: d } = this.formatMessage('debug', message, data)
      console.debug(output, d)
    }
  }

  info(message: string, data?: any) {
    if (isDev) {
      const { output, data: d } = this.formatMessage('info', message, data)
      console.info(output, d)
    }
  }
}

export const logger = new Logger({
  prefix: '[RentNG]',
  timestamp: isDev,
})

export default logger
